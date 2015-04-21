game.PlayerEntity = me.Entity.extend({

/* -----

constructor

------ */

  init: function(x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(1.25, 5.7);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation("walk",  [0, 1, 2, 3]);
    // define a standing animation (using the first frame)
    this.renderable.addAnimation("stand",  [0]);
    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
  },

  /* -----

  update the player pos

  ------ */
  update: function(dt) {
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else if (me.input.isKeyPressed('right')) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else {
      this.body.vel.x = 0;
      // change to the standing animation
      this.renderable.setCurrentAnimation('stand');
    }

    if (me.input.isKeyPressed('jump')) {
      // make sure we are not already jumping or falling
      if (!this.body.jumping && !this.body.falling) {
        me.audio.play('jump');
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        // set the jumping flag
        this.body.jumping = true;
      }
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
  * colision handler
  * (called when colliding with other objects)
  */
  onCollision : function (response, other) {
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        //console.log('the player collided with a world shape');
        // Simulate a platform object
        if (other.type === 'platform') {
          //console.log('the player hit a platform');
          if (this.body.falling &&
          !me.input.isKeyPressed('down') &&
          // Shortest overlap would move the player upward
          (response.overlapV.y > 0) &&
          // The velocity is reasonably fast enough to have penetrated to the overlap depth
          (~~this.body.vel.y >= ~~response.overlapV.y)
          ) {
            // Disable collision on the x axis
            response.overlapV.x = 0;
            // Repond to the platform (it is solid)
            return true;
          }
          // Do not respond to the platform (pass through)
          return true; // used to be false
        }
        break;
      case me.collision.types.ENEMY_OBJECT:
        if ((response.overlapV.y>0) && !this.body.jumping) {
          // bounce (force jump)
          this.body.falling = false;
          this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
          // set the jumping flag
          this.body.jumping = true;
        }
        else {
          // let's flicker in case we touched an enemy
          //this.renderable.flicker(750);
        }
        return false;
        break;
      default:
        // Do not respond to other objects (e.g. coins)
        return false;
    }
    // Make the object solid
    return true;
  }
});
