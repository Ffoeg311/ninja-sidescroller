
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
    // Initialize the video.
    if (!me.video.init('screen',  me.video.CANVAS, 160, 80, true, 'auto')) {
        alert('Your browser does not support HTML5 canvas.');
        return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === '#debug') {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, 'debug', me.input.KEY.V);
        });
    }

    // Initialize the audio.
    me.audio.init('mp3,ogg');

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
},

    // Run on game resources loaded.
    "loaded" : function () {
      me.state.set(me.state.MENU, new game.TitleScreen());
      me.state.set(me.state.PLAY, new game.PlayScreen());

      // enable the keyboard
      me.input.bindKey(me.input.KEY.LEFT,  'left');
      me.input.bindKey(me.input.KEY.RIGHT, 'right');
      me.input.bindKey(me.input.KEY.X,     'jump', true);

      // add our player entity in the entity pool
      me.pool.register('mainPlayer', game.PlayerEntity);
      me.pool.register('coin', game.CoinEntity);
      me.pool.register('lava', game.LavaEntity);
      me.pool.register('movingplatform', game.MovingPlatformEntity);
      me.pool.register('platform', game.StaticPlatformEntity);
      me.pool.register('portal', game.PortalEntity);

      // Start the game.
      me.state.change(me.state.PLAY);
    }
};
