/**
 * Represents the main class.
 * @constructor
 */
const leaderboardScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "leaderboard" });
    },
    init: function(data) {
        this.SPACING_VERTICAL = 0.3;
        this.BTNS_REDUCE_SCALE = 0.7;
        this.FLOAT_LEFT = 0.085;
        this.START_Y = 0.3;
        this.VERTICAL_STEP = 0.1;

        this.players = data.players;
    },
   /**
 * Represents a function to load the predefined images in the screen.
 */ 
    preload: function ()
    {
        this.load.image('results_background', 'assets/results_background.png');
        this.load.image('home', 'assets/home.png');
    },
    create: function() {
        /**
         * Setting the background.
         */
        this.background = this.add.image(config.width/2, config.height/2, 'results_background');
        this.background.setScale(config.width/this.background.width);
        
        this.initHomeBtn();

        /**
         * give labels to scores on screen.
         */
        for (let i=0; i<this.players.length; i++) {
            this.labelOnScreenResults(this.players[i], i);
        }
    },
/**
 * Represents a function to redirect the page to intial home screen. So that player gan begin a new game playing session.
 */	    
    initHomeBtn() {
        this.homeBtn = this.add.sprite(config.width/2,
            config.height/2 + this.SPACING_VERTICAL * (config.height),
                'home');
        this.homeBtn.setScale(this.BTNS_REDUCE_SCALE * config.width/this.background.width);
        this.homeBtn.setInteractive();
        this.homeBtn.on('pointerdown', () => {
            this.homeBtn.setTint(0xaaaaaa);
            game.scene.stop("leaderboard");
            location.reload();
        });
        this.homeBtn.on('pointerup', () => { this.homeBtn.setTint(0xffffff); });
        this.homeBtn.on('pointerout', () => { this.homeBtn.setTint(0xffffff); });
    },
    /**
     * Represents a function to diplay the finale end game results showing each player scores and thier ranking.
     * @param  {} player
     * @param  {} index
     */
    labelOnScreenResults(player, index) {
        const x = config.width/2 - this.FLOAT_LEFT * config.width;
        const y = (this.START_Y * config.height) + this.VERTICAL_STEP * config.height * index;

        const text = player.nickname + ": " + player.score;
        this.add.text(x, y, text, { color: 'black', fontFamily: 'Arial', fontSize: '25px '});
    }
});