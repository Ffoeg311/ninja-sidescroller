/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

  init: function() {
      // call the constructor
      this._super(me.Container, 'init');

      // persistent across level change
      this.isPersistent = true;

      // make sure we use screen coordinates
      this.floating = true;

      // make sure our object is always draw first
      this.z = Infinity;

      // give a name
      this.name = "HUD";

      // add our child score object at the top left corner
      this.addChild(new game.HUD.ScoreItem(10,5));
    }
});


/**
* a basic HUD item to display score
*/
game.HUD.ScoreItem = me.Renderable.extend( {
  /**
  * constructor
  */
  init: function(x, y) {

    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 10, 10]);

    // create a font
    this.font = new me.BitmapFont("fonty",  {x:8,y:12} , 1);
    this.font.lineWidth = 10;

    // local copy of the global score
    this.score = -1;
  },

  /**
  * update function
  */
  update : function (dt) {
    // we don't draw anything fancy here, so just
    // return true if the score has been updated
    if (this.score !== game.data.score) {
    this.score = game.data.score;
    return true;
    }
    return false;
  },

  /**
  * draw the score
  */
  draw : function (renderer) {
    this.font.draw (renderer, this.score, this.pos.x, this.pos.y);
  }
});
