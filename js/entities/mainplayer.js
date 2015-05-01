game.PlayerEntity = me.Entity.extend({

/* -----

constructor

------ */

  init: function(x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(.9, 5.9);

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
    // Add a field to track if the player is carried by a platform
    this.body.carried = false;
    // Velocity that the carrying platform is moving
    this.body.carrySpeed - 0;
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
      // If the player is carried by the platform, they should move at the platform's speed
      if (this.body.carried) {
        this.body.vel.x = this.body.carrySpeed;
        this.renderable.setCurrentAnimation('stand');
      }
      else {
        this.body.vel.x = 0;
        // change to the standing addAnimation
        this.renderable.setCurrentAnimation('stand');
      }
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
        // Simulate a platform object
        if (other.type === "platform") {
          // Disable collision on the x axis
          response.overlapV.x = 0;
          // Change velocity of body to follow platform
          this.body.carrySpeed = other.body.vel.x;
          // Repond to the platform (it is solid)
          this.body.carried = true;
          // player should respond to the platform
          return true;
        } else {
          // When colliding with other objects, the body is player is no longer carried.
          this.body.carried = false;
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
