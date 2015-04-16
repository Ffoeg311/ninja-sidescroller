/*-------------------
a player entity
-------------------------------- */
game.LavaEntity = me.LevelEntity.extend({
  init: function(x, y, settings) {
    this._super(me.LevelEntity, 'init', [x, y , settings]);
  },

  onCollision : function (response, other) {
    // Make all other objects solid
    game.data.score = 0;
    this._super(me.LevelEntity, 'onCollision', [response, other]);
  }
});
