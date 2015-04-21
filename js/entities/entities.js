/*-------------------
a player entity
-------------------------------- */
game.LavaEntity = me.LevelEntity.extend({
  init: function(x, y, settings) {
    this._super(me.LevelEntity, 'init', [x, y , settings]);
  },

  onCollision : function (response, other) {
    // Make all other objects solid
    me.audio.play('hero_death');
    game.data.score = 0;
    this._super(me.LevelEntity, 'onCollision', [response, other]);
  }
});

game.PlatformEntity = me.Entity.extend({
  init: function(x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // manually update the entity bounds as we manually change the position
    //this.updateBounds();
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
 },

  update: function(dt) {
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
    me.collision.check(this);
    this._super(me.Entity, 'update', [dt]);
    // TODO update the body movement
  },

   /**
    * colision handler
    * (called when colliding with other objects)
    */
  onCollision : function (response, other) {
    //console.log(this.GUID + ' is a platform with ' + this.body.collisionType);
    return true;
  }
});
