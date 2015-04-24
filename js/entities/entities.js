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
  init: function(x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    // Set fields specific to platform
    this.ymove = settings.ymove;
    this.xmove = settings.xmove;
    // manually update the entity bounds as we manually change the position
    // this.updateBounds();
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
 },

  update: function(dt) {
    me.collision.check(this);
    // TODO update the body movement
    //this.body.vel.x = 1 * me.timer.tick;
    // return true if we moved or if the renderable was updated
    this.body.update(dt);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);

  },

  onCollision : function (response, other) {
    return true;
  }
});
