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
    return false;
  }
});

game.MovingPlatformEntity = me.Entity.extend({
  init: function(x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // Start the platform rising
    this.rising = settings.ymove > 0;

    // Determine lowest and highest coordinates of the platform
    if (this.rising) {
      this.bottomY = this.pos.y;
      this.topY = this.bottomY - (settings.ymove * game.tileWidth);
    } else {
      this.topY = this.pos.y;
      this.bottomY = this.topY - (settings.ymove * game.tileWidth);
    }
    
    // Determine the far left and right coordinates of the platform
    this.walkingRight = settings.xmove > 0;
    if (this.walkingRight) {
      this.leftX = this.pos.x;
      this.rightX = this.leftX + (settings.xmove * game.tileWidth);  
    } else {
      this.rightX = this.pos.x;
      this.leftX = this.rightX + (settings.xmove * game.tileWidth);
    }
    // Determine platform speed
    this.xspeed = settings.xspeed;
    this.yspeed = settings.yspeed;
    // update the platform when it isn't on the screen
    this.alwaysUpdate = true;
    // Platform moves independent to gravity
    this.body.gravity = 0;
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
 },

  update: function(dt) {
    me.collision.check(this);
    // Deal with vertical motion
    if (this.rising){
      // up
      this.body.vel.y = -1 * this.yspeed * me.timer.tick;
      this.rising = this.pos.y > this.topY;
    } else {
      // down
      this.body.vel.y = this.yspeed * me.timer.tick;
      this.rising = this.pos.y >= this.bottomY;
    }
    // Deal with horizontal motion
    if (this.walkingRight) {
      // left
      this.body.vel.x = this.xspeed * me.timer.tick;
      this.walkingRight = this.pos.x < this.rightX;
    } else {
      // right
      this.body.vel.x = -1 * this.xspeed * me.timer.tick;
      this.walkingRight = this.pos.x <= this.leftX;
    }
    
    this.body.update(dt);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  onCollision : function (response, other) {
    return false;
  }
});
