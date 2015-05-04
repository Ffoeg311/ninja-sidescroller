/* Kills the player and restarts the level */
game.LavaEntity = me.LevelEntity.extend({
  init: function(x, y, settings) {
    settings.duration = 250;
    settings.fade = '#000000';
    this._super(me.LevelEntity, 'init', [x, y , settings]);
  },

  onCollision : function (response, other) {
    // Make all other objects solid
    me.audio.play('hero_death');
    game.data.score = game.data.prevScore;
    this._super(me.LevelEntity, 'onCollision', [response, other]);
  }
});

/* Takes the player to another level, preserving the score. */
game.PortalEntity = me.LevelEntity.extend({
  init: function(x, y, settings) {
    /* settings consistant across all portals */
    settings.image = "portal";
    settings.spritewidth = 6;
    settings.spriteheight = 8;
    settings.duration = 250;
    settings.fade = '#000000';
    /* settings unique from tiled */
    this._super(me.LevelEntity, 'init', [x, y , settings]);
  },

  onCollision : function (response, other) {
    // Make all other objects solid
    game.data.prevScore = game.data.score;
    me.audio.play('portal');
    this._super(me.LevelEntity, 'onCollision', [response, other]);
  }
});

/* An entity for a platform tha doesn't move */
game.StaticPlatformEntity = me.Entity.extend({
  init: function(x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
 },

  update: function(dt) {
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  onCollision : function (response, other) {
    return true;
  }
});


game.MovingPlatformEntity = me.Entity.extend({
  // TODO move speed to tiled property
  init: function(x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    // Determine start and end y
    this.startY = this.pos.y;
    this.endY = this.startY - (settings.ymove * game.tileWidth);
    // Determine if there is any vertical motion
    this.verticalMove = ( this.startY - this.endY != 0 );
    
    // Determine if there is horizontal movement
    this.horizontalMove = (this.leftX - this.endX != 0);
    // Start the platform rising and moving right
    this.rising = true;
    console.log(settings.xmove);
    this.walkingRight = settings.xmove > 0;
    console.log(this.walkingRight);
    if (this.walkingRight) {
       // Determine the start and end x
      this.leftX = this.pos.x;
      this.rightX = this.leftX + (settings.xmove * game.tileWidth);  
    } else {
      this.rightX = this.pos.x;
      this.leftX = this.rightX + (settings.xmove * game.tileWidth);  

    }
    console.log(this.leftX + ', ' + this.rightX);
   
    
    // Determine platform speed
    this.xspeed = settings.xspeed;
    this.yspeed = settings.yspeed;
    // update the platform when it isn't on the screen
    this.alwaysUpdate = true;
    // Platform moves independent to gravity
    this.body.gravity = 0;
    //this.body.setFriction(.9, 0);
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
 },

  update: function(dt) {
    me.collision.check(this);
    // Deal with vertical motion
    if(this.verticalMove){
      // up
      if (this.rising){
        this.body.vel.y = -1 * this.yspeed * me.timer.tick;
        this.rising = this.pos.y > this.endY;
      // down
      } else {
        this.body.vel.y = this.yspeed * me.timer.tick;
        this.rising = this.pos.y >= this.startY;
      }
    } 
    // Deal with horizontal motion
    if (this.horizontalMove) {
      // left
      if (this.walkingRight) {
        this.body.vel.x = this.xspeed * me.timer.tick;
        this.walkingRight = this.pos.x < this.rightX;
      // right
      } else {
        this.body.vel.x = -1 * this.xspeed * me.timer.tick;

        this.walkingRight = this.pos.x <= this.leftX;
      }
    }
    this.body.update(dt);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  onCollision : function (response, other) {
    return false;
  }
});
