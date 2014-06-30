BasicGame.Preloader = function(game) {

    this.preloadBar_Bground = null;
    this.preloadBar = null;
    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function() {

        // Set stage background colour
        this.preloadbackground = this.add.sprite(0, 0, 'preloaderStageBackground');

        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        this.preloadBar_Bground = this.add.sprite(180, 110, 'preloaderBackground');

        this.preloadBar = this.add.sprite(180, 110, 'preloaderBar');
        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        //	Lion assets
        this.game.load.spritesheet('lion', 'assets/LionSpriteSheet_64_64_18.png', 64, 64, 18); // name , location

        // punch assets
        this.game.load.image('punch', 'assets/punch.png');
        this.game.load.audio('punch1', 'sounds/punch1.wav');
        this.game.load.audio('punch2', 'sounds/punch2.wav');
        this.game.load.audio('punch3', 'sounds/punch3.mp3');
        this.game.load.audio('punchmiss', 'sounds/punchmiss.wav');

        // background assets
        this.game.load.image('ground', 'assets/ground.png');
        this.game.load.image('backgroundImg', 'assets/stagebackground.png');
        this.game.load.image('cloud', 'assets/cloud_3.png');
        this.game.load.audio('backGroundMusic', 'sounds/SonicBlast.mp3');

        // punch meter
        this.game.load.spritesheet('punchmeter', 'assets/punch_meter_32_162_5.png', 162, 32);

        // metals
        this.game.load.spritesheet('metals', 'images/metals_41_75_3.png', 41, 75);


        // Panel assets
        this.game.load.image('panel', 'assets/gray_panel.png');
        this.game.load.spritesheet('playbutton', 'assets/playbutton_190_49_2.png', 190, 49);
        this.game.load.spritesheet('goldstar', 'assets/goldstar_39_37_2.png', 39, 37);
        this.game.load.spritesheet('creditButton', 'assets/infobutton_45_48_2.png', 45, 48);
        this.game.load.image('creditPanel', 'assets/credits_458_304.png');

        // HUD assets
        this.game.load.spritesheet('soundicons', 'assets/soundicons.png', 48, 48); // x, y of sprite images

        // Candy Assets
        this.game.load.spritesheet('candy1', 'assets/MintyMan_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('candy2', 'assets/CandyCorn_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('candy3', 'assets/JellyBean_32_32_5.png', 32, 32, 5);

        this.game.load.spritesheet('deadcandy1', 'assets/MintyManpeices_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('deadcandy2', 'assets/CandyCornpeices_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('deadcandy3', 'assets/JellyBeanpieces_32_32_5.png', 32, 32, 5);

        this.game.load.audio('lollydeath1', 'sounds/lollyscream1.wav');
        this.game.load.audio('lollydeath2', 'sounds/lollyscream2.wav');

    },

    create: function() {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloadBar.cropEnabled = false;

        // adding background music
        music = this.add.audio('backGroundMusic');
        music.play('', 0, 0.3, true);

    },

    update: function() {



        //	If you don't have any music in your game then put the game.state.start line into the create function and delete
        //	the update function completely.

        if (this.cache.isSoundDecoded('backGroundMusic') && this.ready == false) {
            this.ready = true;
            this.state.start('Game');
            //this.state.start('MainMenu');
        }

    }

};