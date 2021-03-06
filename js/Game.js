BasicGame.Game = function(game) {

    // Initalizing Score
    this.score = 0; // starting score
    this.highScore = 0; // high score
    this.punchesThrown = 0; // punches thrown out
    this.candiesLivedFor = 0; // how long did the candies live
    this.allCandiesLivedFor = 0; // how long were all 3 candies alive for
    this.chanComplete = {
        punches: 0,
        aCandyLived: 0,
        allCandiesLived: 0
    };
    this.challengesComplete = 0; // count of challenges complete
    this.punchMultiplier = 1; // score multiplier
    this.multiplierCounter = 0; // count for score multipling
    this.punchmeter = null; // punch meter image
    this.punchmeterframe = 0; // punch meter frame holder
    this.metals = null; // metal sprite sheet

    // Initalizing Game Options
    this.startGAme = null;
    this.LIONS = 15; // amount of lions to loop
    this.lionSpawnTimer = 1; // Lion Spawn timer default 1 second
    this.candiesAlive = 3; // starting amount of candies to protect
    this.lionTimer = null; // Lion Timer
    this.gameOver = false; // Game over toggle
    this.lionSpawnLocations = [];

    // Constants
    this.GAME_GRAVITY = 1500; // gravity Y constant
    this.LION_MOVEMENT = {
        LION_VELOCITY_LOW_L: -150, // lion low range left
        LION_VELOCITY_HIGH_L: -600, // lion low range left
        LION_VELOCITY_LOW_R: 150, // lion low range right
        LION_VELOCITY_HIGH_R: 600 // lion low range right
    };
    this.LION_PUNCH = {
        X_VELOCITY_LOW: -500,
        X_VELOCITY_HIGH: 500,
        Y_VELOCITY_LOW: -1000,
        Y_VELOCITY_HIGH: -1400,
        Y_ACCELERATION: 3000,
    };

    // game object vars
    this.ground = null; // ground
    this.backgroundImg = null; //background image
    this.clouds = null; // clouds
    this.soundSwitch = null; // sound switch
    this.punch = null; // fist
    this.candy = null; // candy
    this.candyGroup = null; // candy group
    this.lionGroup = null; // lion group

    // Panel
    this.intropanel = null; // background
    this.startGameButton = null; // startbutton
    this.panelTitle = null;
    this.panelChall = null;
    this.panelChall1 = null;
    this.panelChall2 = null;
    this.challStar1 = null;
    this.challStar2 = null;
    this.challStar3 = null;
    this.creditButton = null;

    // credit panel
    this.creditPanel = null;
    this.creditTitle = null;
    this.creditText = null;

    // text vars
    this.scoreText = null;
    this.highScoreText = null;
    this.scoreMultiplierText = null;



    // text style
    this.style = {
        stroke: '#727684',
        strokeThickness: 3,
        font: '26px Arial',
        fill: '#ffffff'
    };
    this.style2 = {
        stroke: '#727684',
        strokeThickness: 3,
        font: '26px Arial',
        fill: '#ffffff'
    };

    this.panelText = {
        font: '22px Arial',
        fill: '#ffffff',
    };

    this.panelChallText = {
        font: '28px Arial',
        fill: '#ffffff',
    };

    this.panelTitleText = {
        font: '28px Arial',
        fill: '#727684',
        stroke: '#727684',
        strokeThickness: 1
    };

    this.creditTitleText = {
        font: '32px Arial',
        fill: '#727684',
        stroke: '#727684',
        strokeThickness: 1
    };

    this.creditTextStyle = {
        font: '22px Arial',
        fill: '#727684',
    };

};

BasicGame.Game.prototype = {

    create: function() {

        // start game flag
        this.startGame = false;

        // background elements
        this.backgroundImg = this.game.add.sprite(0, 0, 'backgroundImg');
        this.ground = this.game.add.sprite(0, this.game.world.height - 54, 'ground');
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.body.immovable = true;
        this.ground.body.setSize(1400, 40, 0, 10);

        //Clouds
        this.clouds = this.game.add.group(); // create cloud group
        this.game.physics.enable(this.clouds, Phaser.Physics.ARCADE);
        this.clouds.enableBody = true;
        this.clouds.createMultiple(3, 'cloud', 0);
        this.clouds.setAll('outOfBoundsKill', true);
        this.clouds.setAll('checkWorldBounds', true); // remember checkWorldBounds needs to be active for out of bounds world kill to work

        // spawn clouds every 5 seconds
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.createClouds, this);

        // add in punch meter
        this.punchmeter = this.game.add.sprite(100, 60, 'punchmeter');
        this.punchmeter.anchor.setTo(0.5, 0.5);

        //music
        this.soundSwitch = this.game.add.button(890, 10, 'soundicons', this.switchSound, this); //soundswitch

        // Turn soundSwitch to off if music was turned off
        if (!music.isPlaying) {
            this.soundSwitch.frame = 1;
        }

        // Score Text
        this.scoreText = this.game.add.text(16, 4, 'Score: 0', this.style); // x, y, string of text, style

        // Score multiplier
        this.scoreMultiplierText = this.game.add.text(16, 80, 'Punch Bonus: ', this.style);
        this.MultiplierText = this.game.add.text(this.scoreMultiplierText.x + 180, this.scoreMultiplierText.y + 17, 'x' + this.punchMultiplier, this.style2);
        this.MultiplierText.anchor.setTo(0.5, 0.5);

        // High Score
        this.highScoreText = this.game.add.text(270, 4, 'High Score: ' + this.highScore, this.style); // high score  

        this.metals = this.game.add.sprite(250, 25, 'metals'); // metal sprites
        this.metals.anchor.setTo(0.5, 0.5);
        this.metals.scale.setTo(0.6, 0.6);
        this.metals.exists = false; // hide metal in the begging
        this.loadMetal(this.highScore);

        // challenges complete
        this.challText = this.game.add.text(580, 4, 'Challenges Complete: ' + this.challengesComplete, this.style);

        // tweens
        this.getBigger = this.game.add.tween(this.MultiplierText.scale).to({
            x: 1,
            y: 1
        }, 100, Phaser.Easing.Linear.None).to({
            x: 1.3,
            y: 1.3
        }, 500, Phaser.Easing.Linear.None).to({
            x: 1,
            y: 1
        }, 100, Phaser.Easing.Linear.None);
        // spinning tween
        this.getSpinning = this.game.add.tween(this.MultiplierText).to({
            angle: 15
        }, 500, Phaser.Easing.Linear.None).to({
            angle: -15
        }, 500, Phaser.Easing.Linear.None).to({
            angle: 0
        }, 500, Phaser.Easing.Linear.None);

        // create candy group
        this.candyGroup = this.game.add.group();
        this.game.physics.enable(this.candyGroup, Phaser.Physics.ARCADE);
        this.candyGroup.enableBody = true;

        // create our 3 candies
        this.candy1 = this.candyGroup.create(400 + (40 * 1), this.game.height - 79, 'candy1');
        this.candy1.name = 'candy1';
        this.candy1.animations.add('passive');
        this.candy1anim = this.candy1.animations.play('passive', 15, true);
        this.candy1anim.onLoop.add(this.candySwitch, this);
        this.candy1.anchor.setTo(0.5, 0.5);
        this.candy1.scale.setTo(2, 2);

        this.candy2 = this.candyGroup.create(400 + (40 * 2), this.game.height - 79, 'candy2');
        this.candy2.name = 'candy2';
        this.candy2.animations.add('passive');
        this.candy2anim = this.candy2.animations.play('passive', 15, true);
        this.candy2anim.onLoop.add(this.candySwitch, this);
        this.candy2.anchor.setTo(0.5, 0.5);
        this.candy2.scale.setTo(2, 2);

        this.candy3 = this.candyGroup.create(400 + (40 * 3), this.game.height - 79, 'candy3');
        this.candy3.name = 'candy3';
        this.candy3.animations.add('passive');
        this.candy3anim = this.candy3.animations.play('passive', 15, true);
        this.candy3anim.onLoop.add(this.candySwitch, this);
        this.candy3.anchor.setTo(0.5, 0.5);
        this.candy3.scale.setTo(2, 2);

        // lolly death sounds
        this.lollydeath1_s = this.add.audio('lollydeath1');
        this.lollydeath2_s = this.add.audio('lollydeath2');

        //create lion ground and create lions
        this.lionGroup = this.game.add.group();
        this.game.physics.enable(this.lionGroup, Phaser.Physics.ARCADE);
        this.lionGroup.enableBody = true;
        this.lionGroup.createMultiple(this.LIONS, 'lion'); // number, key, (optional frame), (optional exists)
        this.lionGroup.setAll('outOfBoundsKill', true);
        this.lionGroup.setAll('checkWorldBounds', true); // remember checkWoldBounds needs to be active for outofboundskill to work


        // creating a timer
        this.lionTimer = this.game.time.create(false);
        this.lionTimer.add(Phaser.Timer.SECOND, this.createNewLion, this);

        // create a lion spawn location array
        this.lionSpawnLocations = ["left", "right"];

        // create intropanel
        this.createPanel();

        // Create Fist
        this.punch = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2 - 100, 'punch');
        this.punch.anchor.setTo(0.5, 0.5);
        this.punch.scale.x = -1; // making the fist display in the correct direction
        this.game.physics.enable(this.punch, Phaser.Physics.ARCADE); // this is the way to enable physics 
        this.punch.body.allowRotation = false; // let Physics do the rotation

        // punching sounds
        this.punch1_s = this.add.audio('punch1');
        this.punch2_s = this.add.audio('punch2');
        this.punch3_s = this.add.audio('punch3');
        this.misspunch_s = this.add.audio('punchmiss');

        // Punch on Click or Tap
        this.game.input.onDown.add(this.punchLion, this);

    },

    update: function() {

        // Start spawning lions when play is pressed
        if (this.startGame) {
            // spawn lions starting at 1 per second
            this.lionTimer.start();
        }

        // move to Pointer handles the rotation and the acceleration to cursor
        this.punch.rotation = this.game.physics.arcade.moveToPointer(this.punch, 200, this.game.input.activePointer, 80);

        // checking for collisions
        this.game.physics.arcade.collide(this.lionGroup, this.candyGroup, this.hitCandy, null, this); // checking for collision with our lions and the candy.  If candies do overlap then call hitcandy
        this.game.physics.arcade.collide(this.lionGroup, this.ground); // ground and lions will collide

    },

    // Start of Game function
    playGame: function() {

        // Tween out to top of screen
        this.removePanel = this.game.add.tween(this.intropanel).to({
            y: -400
        }, 1000, Phaser.Easing.Quadratic.Out, true);

        this.removePanel.onComplete.add(function() {
            this.intropanel.destroy();
        }, this);

        // this.intropanel.destroy(); // remove panel
        this.startGame = true; // start Game
        this.punchesThrown = 0; // reset punch counter
        this.candiesLivedFor = this.game.time.now; // reset candy life timer
        this.allCandiesLivedFor = this.game.time.now; // reset all 3 candies life timer
    },

    // creating clouds
    createClouds: function() {

        // grab a dead cloud
        var cloud = this.clouds.getFirstExists(false);

        if (cloud) {
            cloud.reset(this.game.rnd.pick([960, 0]), this.game.rnd.integerInRange(5, 150));
            cloud.revive(); // need to revive the sprite because it is currently dead

            // if cloud spawns on the right side of th screen move left else move right
            if (cloud.x > 480) {
                cloud.body.velocity.x = this.game.rnd.integerInRange(-20, -60); // Move left
                cloud.scale.x = 1;
            } else {
                cloud.body.velocity.x = this.game.rnd.integerInRange(20, 60); // Move right
                cloud.scale.x = -1;
            }
        }
    },

    // create the introduction panel and ending panel
    createPanel: function() {

        // add intropanel
        this.intropanel = this.game.add.group();
        this.intropanel.create(240, 50, 'panel');
        this.startGameButton = this.game.add.button(390, 297, 'playbutton', this.playGame, this, 1, 0); // x, y, key, action, notsure, over,out, down frames
        this.panelTitle = this.game.add.text(270, 70, 'Punch Lions to protect the Candies', this.panelTitleText);
        this.panelChall = this.game.add.text(355, 115, 'Challenge Punches', this.panelChallText);
        this.panelChall1 = this.game.add.text(340, 158, 'Punch over 100 Lions', this.panelText);
        this.panelChall2 = this.game.add.text(340, 203, 'One Candy survives over 60 sec', this.panelText);
        this.panelChall3 = this.game.add.text(340, 249, 'All Candies survive over 20 sec', this.panelText);
        this.challStar1 = this.game.add.sprite(285, 150, 'goldstar');
        this.challStar2 = this.game.add.sprite(285, 195, 'goldstar');
        this.challStar3 = this.game.add.sprite(285, 239, 'goldstar');
        this.creditButton = this.game.add.button(677, 297, 'creditButton', this.loadCredits, this, 1, 0);

        this.intropanel.add(this.startGameButton);
        this.intropanel.add(this.panelTitle);
        this.intropanel.add(this.panelChall);
        this.intropanel.add(this.panelChall1);
        this.intropanel.add(this.panelChall2);
        this.intropanel.add(this.panelChall3);
        this.intropanel.add(this.challStar1);
        this.intropanel.add(this.challStar2);
        this.intropanel.add(this.challStar3);
        this.intropanel.add(this.creditButton);

        // change text when the game is over
        if (this.gameOver) {

            this.panelTitle.x = 400; // moved info text over since it is shorter now
            this.panelTitle.text = 'Game Over';

            // using time method to calculate time since game started till game over
            this.totalTimeCandiesLived = this.game.math.floor(this.game.time.elapsedSecondsSince(this.candiesLivedFor));
            this.panelChall1.text = this.punchesThrown + ' Lions Punched';
            this.panelChall2.text = 'The Candies survived for ' + this.totalTimeCandiesLived + ' seconds';
            this.panelChall3.text = 'All Candies survived for ' + this.totalTimeAllCandiesLived + ' seconds';


            // change the starts to the other frame once the challenges are complete.
            if (this.punchesThrown > 100 || this.chanComplete.punches === 1) {
                this.challStar1.frame = 0;
                this.chanComplete.punches = 1;
            } else {
                this.challStar1.frame = 1;
            }

            if (this.totalTimeCandiesLived > 60 || this.chanComplete.aCandyLived === 1) {
                this.challStar2.frame = 0;
                this.chanComplete.aCandyLived = 1;
            } else {
                this.challStar2.frame = 1;
            }

            if (this.totalTimeAllCandiesLived > 20 || this.chanComplete.allCandiesLived === 1) {
                this.challStar3.frame = 0;
                this.chanComplete.allCandiesLived = 1;
            } else {
                this.challStar3.frame = 1;
            }

            // count challenges complete
            this.challengesComplete = (this.chanComplete.punches + this.chanComplete.aCandyLived + this.chanComplete.allCandiesLived);
            this.challText.text = ('Challenges Complete: ' + this.challengesComplete);


        }

        // Tween in from top of screen
        this.game.add.tween(this.intropanel).from({
            y: -400
        }, 1000, Phaser.Easing.Bounce.Out, true);

    },

    // creating lions
    createNewLion: function() {

        var lion = this.lionGroup.getFirstDead(); // Recycle a dead lion

        // switching lions on the left or right side of screen
        if (lion) {
            this.lionReset(this.score, lion);
            lion.scale.setTo(2, 2); // scaling everything up
            lion.animations.add('punch', [15, 16, 17]);
            lion.animations.add('run', [9, 10, 11, 12, 13, 14]);
            lion.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7]);
            lion.body.checkCollision = {
                up: true,
                down: true,
                left: true,
                right: true
            }; // since we are recycling we need to set collisions up again
            lion.body.gravity.y = this.GAME_GRAVITY; // add gravity to lions
            lion.body.velocity.setTo(0, 0); // Stop moving
            lion.body.acceleration.setTo(0, 0); // Stop accelerating

            // If lion spawns on left move left if right move right
            if (lion.x > 480) {
                this.velocity_L = this.game.rnd.integerInRange(this.LION_MOVEMENT.LION_VELOCITY_LOW_L, this.LION_MOVEMENT.LION_VELOCITY_HIGH_L); // Move left
                lion.body.velocity.x = this.velocity_L
                lion.scale.x = -2;

                if (this.velocity_R > -250) {
                    lion.animations.play('walk', 15, true);
                } else {
                    lion.animations.play('run', 15, true);

                }
            } else {
                this.velocity_R = this.game.rnd.integerInRange(this.LION_MOVEMENT.LION_VELOCITY_LOW_R, this.LION_MOVEMENT.LION_VELOCITY_HIGH_R); // Move right
                lion.body.velocity.x = this.velocity_R
                lion.scale.x = 2;
                if (this.velocity_L < 250) {
                    lion.animations.play('walk', 15, true);
                } else {
                    lion.animations.play('run', 15, true);

                }
            }
            lion.rotation = 0; // Reset rotation
            lion.anchor.setTo(0.5, 0.5); // Center texture
        }



        // creates new spawn timer for the next lion that can be changed.
        this.lionTimer.add(Phaser.Timer.SECOND * this.lionSpawnTimer, this.createNewLion, this);

    },

    // spawn locations depend on the score
    lionReset: function(score, lion) {

        var x = 0;
        var y = 0;

        // as the score grows increase the spawn locations
        if (score > 200) {
            this.lionSpawnLocations = ["left", "right", "b_left"];
        }
        if (score > 800) {
            this.lionSpawnLocations = ["left", "right", "b_left", "b_right"];
        }

        // select random spawn location
        switch (this.game.rnd.pick(this.lionSpawnLocations)) {
            case "left":
                x = -100;
                y = this.game.height - 120;
                break;
            case "right":
                x = 1000;
                y = this.game.height - 120;
                break;
            case "b_left":
                x = 0;
                y = this.game.height - 300;
                break;
            case "b_right":
                x = 960;
                y = this.game.height - 300;
                break;
        }

        lion.reset(x, y); // Position on ground
        lion.revive(); // Set "alive"

    },

    // Punching lion action
    punchLion: function() {

        this.missedLion = true; // missed punch flag



        // add tween to simulate punch feedback
        this.game.add.tween(this.punch.scale).to({
            x: -.4,
            y: 1.4
        }, 100, Phaser.Easing.Linear.None).to({
            x: -1,
            y: 1
        }, 100, Phaser.Easing.Linear.None).start();

        // Kill lions within 90 pixels of the punch
        this.lionGroup.forEachAlive(function(lion) { // grab alive lions
            // if the lioin is within 90 pixels destroy it!
            if (this.game.math.distance(
                this.punch.x, this.punch.y,
                lion.x, lion.y) < 90) {
                lion.body.checkCollision = {
                    up: false,
                    down: false,
                    left: false,
                    right: false
                }; // stop checking for collisions when punched
                lion.body.velocity.y = this.game.rnd.integerInRange(this.LION_PUNCH.Y_VELOCITY_LOW, this.LION_PUNCH.Y_VELOCITY_HIGH);
                lion.body.velocity.x = this.game.rnd.integerInRange(this.LION_PUNCH.X_VELOCITY_LOW, this.LION_PUNCH.X_VELOCITY_HIGH);
                lion.body.acceleration.y = this.LION_PUNCH.Y_ACCELERATION;
                lion.angle = 270;
                lion.animations.play('punch', 10, false); //play the punch animation only once

                this.missedLion = false; // toggle missed flag

                // select a random punch sound to play
                this.game.rnd.pick([this.punch1_s, this.punch2_s, this.punch3_s]).play();

                this.updateScore(10, this.punchMultiplier); // add 10 to score

                this.punchesThrown++; //add 1 to punches thrown

                this.multiplierCounter++;
                this.comboCounter(this.multiplierCounter); // add to count for every lion hit

            }

        }, this);

        // play missed sound when no lion is hit
        if (this.missedLion) {
            this.misspunch_s.play();
            this.multiplierCounter = 0; // reset counter on miss
            this.punchmeter.frame = 0; // reset punch meter
            this.punchMultiplier = 1;
            this.MultiplierText.text = 'x' + this.punchMultiplier;
            this.MultiplierText.fill = '#FFFFFF';
        }


    },

    // interaction between lion and candy
    hitCandy: function(lion, candy) {
        candy.kill();
        lion.kill();

        // candy death sound
        this.game.rnd.pick([this.lollydeath1_s, this.lollydeath2_s]).play();
        this.createDeadLolly(0, candy);
        this.createDeadLolly(1, candy);
        this.createDeadLolly(2, candy);
        this.createDeadLolly(3, candy);
        this.createDeadLolly(4, candy);

        this.candiesAlive--;

        // count how long all candies were alive
        if (this.candiesAlive === 2) {
            this.totalTimeAllCandiesLived = this.game.math.floor(this.game.time.elapsedSecondsSince(this.allCandiesLivedFor));
        }

        // game ends when candies are gone
        if (this.candiesAlive === 0) {
            this.quitGame();
        }
    },

    // animation switch sides
    candySwitch: function(candy, animation) {

        if (animation.loopCount === 5) {
            candy.scale.x = -2;
        } else if (animation.loopCount === 10) {
            candy.scale.x = 2;
            animation.loopCount = 1;

        }

    },

    // create candy dead pieces
    createDeadLolly: function(frame, candy) {

        // use the correct dead candy image (this is broken in 1.5)
        if (candy.name === 'candy1') {
            this.deadLolly = 'deadcandy1';
        } else if (candy.name === 'candy2') {
            this.deadLolly = 'deadcandy2';
        } else {
            this.deadLolly = 'deadcandy3';
        }

        // I will update this when I create new candy parts
        lollypart = this.game.add.sprite(candy.x, candy.y, this.deadLolly, frame);
        lollypart.scale.setTo(2, 2);
        this.game.physics.enable(lollypart, Phaser.Physics.ARCADE);
        lollypart.angle = this.game.rnd.integerInRange(0, 360);
        lollypart.body.velocity.x = this.game.rnd.integerInRange(-120, 120);
        lollypart.body.velocity.y = this.game.rnd.integerInRange(-700, -800);
        lollypart.body.acceleration.y = 3000;
        this.game.add.tween(lollypart).to({
            alpha: 0
        }, 800, Phaser.Easing.Exponential.In, true).onComplete.add(function() {
            this.kill();
        }, lollypart);


    },

    // score combo
    comboCounter: function(count) {

        if (count === 1) {
            this.punchmeter.frame = 1;
        } else if (count === 2) {
            this.punchmeter.frame = 2;
        } else if (count === 3) {
            this.punchmeter.frame = 3;
        } else if (count === 4) {
            this.punchmeter.frame = 4;
            this.punchMultiplier = 2;
            this.MultiplierText.text = 'x' + this.punchMultiplier;
            this.MultiplierText.fill = '#EAFF00';

            // larger tween
            this.getBigger.start();
            // spinning tween
            this.getSpinning.start();




        } else if (count === 8) {
            this.punchMultiplier = 3;
            this.MultiplierText.text = 'x' + this.punchMultiplier;
            this.MultiplierText.fill = '#FF8300';
            this.getBigger.start();
            this.getSpinning.start();
        } else if (count === 15) {
            this.punchMultiplier = 4;
            this.MultiplierText.text = 'x' + this.punchMultiplier;
            this.MultiplierText.fill = '#AA0114';
            this.getBigger.start();
            this.getSpinning.start();
        }
    },

    // add score and adjust the spawn timer
    updateScore: function(addScore, multiplier) {
        this.score += (addScore * multiplier); // update the score when each lion is hit adding in score modifier for punches
        this.scoreText.text = 'Score: ' + this.score;

        // lions spawn faster as score increases spawn timer is in seconds
        if (this.score > 100) {
            this.lionSpawnTimer = .7;
        }
        if (this.score > 350) {
            this.lionSpawnTimer = .65;
        }
        if (this.score > 500) {
            this.lionSpawnTimer = .6;
        }
        if (this.score > 700) {
            this.lionSpawnTimer = .555;
        }
        if (this.score > 900) {
            this.lionSpawnTimer = .52;
        }
        if (this.score > 1300) {
            this.lionSpawnTimer = .505;
        }
        if (this.score > 1700) {
            this.lionSpawnTimer = .480;
        }
        if (this.score > 2500) {
            this.lionSpawnTimer = .450;
        }

        // add tween to score when it is higher than highscore
        if (this.score >= this.highScore) {
            this.game.add.tween(this.scoreText.scale).to({
                x: 1,
                y: 1
            }, 100, Phaser.Easing.Linear.None).to({
                x: 1.1,
                y: 1.1
            }, 500, Phaser.Easing.Linear.None).start();
        }


    },

    // turning music on or off
    switchSound: function() {
        if (this.soundSwitch.frame === 0) {
            this.soundSwitch.frame = 1;
            music.pause(); // music is global so it will stay off
        } else {
            this.soundSwitch.frame = 0;
            music.resume();
        }
    },


    // loading the credits
    loadCredits: function() {
        this.creditGroup = this.game.add.group();
        this.creditPanel = this.game.add.sprite(490, 50, 'creditPanel');
        this.creditTitle = this.game.add.text(610, 90, 'Lion Puncher', this.creditTitleText);
        this.creditText = this.game.add.text(540, 150, 'Code by Sam Russell @samwrussell ' + '\n\n \t\t\t Art by Robert Fink @FinkCG' + '\n\n \t\t\t Music - Sonic Blast by F-777 ' + '\n\n \t\t\t\t\t Sounds - Freesounds.org', this.creditTextStyle);

        this.creditGroup.add(this.creditPanel);
        this.creditGroup.add(this.creditTitle);
        this.creditGroup.add(this.creditText);

        // Tween in from top of screen
        this.game.add.tween(this.creditGroup).from({
            x: 1400
        }, 1000, Phaser.Easing.Bounce.Out, true);

        // bring the fist to the top of the stack
        this.punch.bringToTop();

        // credit panel can be clicked anywhere to close
        this.creditPanel.inputEnabled = true;
        this.creditPanel.events.onInputUp.add(function() {
            this.game.add.tween(this.creditGroup).to({
                x: 1400
            }, 1000, Phaser.Easing.Bounce.Out, true);
        }, this)


    },

    quitGame: function(pointer) {
        // update highscore at the end of the game
        if (this.score > this.highScore) {
            this.highScore = this.score
        }

        // load metal if the user scored enough

        this.loadMetal(this.highScore);

        //	Reset score, stop music, and start the game over
        this.score = 0;
        this.candiesAlive = 3;
        this.spawnTimer = 1000;
        this.gameOver = true;
        this.state.start('Game');

    },

    // load metal depending on score
    loadMetal: function(score) {
        if (score > 1000) {
            this.metals.exists = true;
        }
        if (score > 2000) {
            this.metals.frame = 1;
        }
        if (score > 3000) {
            this.metals.frame = 2;
        }
    },

    render: function() {
        // adding debug info
        //this.game.debug.spriteBounds(this.ground);
        //this.game.debug.bodyInfo(this.ground, 32, 300);
        //this.game.debug.body(this.ground);
        //this.game.debug.spriteCorners(this.lionGroup, true, true);
        //this.game.debug.spriteInfo(this.ground, 32, 200);
    }



};