/**
 * Represents the main class.
 * @constructor
 */
const homeScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "home" });
    },
    /**
 * Represents a function to load the predefined images in the screen.
 */
    init: function() {
        this.BTNS_REDUCE_SCALE = 0.7;
        this.SPACING_HORIZONTAL = 0.15;
        this.SPACING_VERTICAL = 0.12;
    },
    preload: function () {
        this.load.image('home_background', 'assets/home_background.png');
        this.load.image('insert', 'assets/insert.png');
        this.load.image('single_player', 'assets/single_player.png');
        this.load.image('multi_player', 'assets/multi_player.png');
    },
 /**
 * Represents a function to create and modify the way the screen looks.
 */
    create: function() {
        /**
         * Setting the background.
         */
        this.background = this.add.image(config.width/2, config.height/2, 'home_background');
        this.background.setScale(config.width/this.background.width);

        /**
         * Creating the input and buttons.
         */
        this.initTextInputField();
        this.initSinglePlayerBtn();
        this.initMultiplayerBtn();

        /**
         * Player nickname box.
         */
        this.playerNickname = this.add.sprite(config.width/2, config.height/2, 'insert');
        this.playerNickname.setScale(this.BTNS_REDUCE_SCALE * config.width/this.background.width);
        this.playerNickname.setInteractive();

        /**
         * Socket init.
         */
        socket.on('lobbyJoined', data => {
            socket.off();
            this.textInputField.remove();
            game.scene.stop("home");
            game.scene.start("lobby", data);
        });

        socket.on('gameStart', data => { 
            /**
             * For Singleplayer only.
             */
            socket.off();
            this.textInputField.remove();
            game.scene.stop("home");
            game.scene.start("game", data);
        });
    },
    initTextInputField() {
        this.textInputField = document.createElement("input");
        this.textInputField.id = "nickname";
        this.textInputField.autofocus = true;
        document.getElementById('game').appendChild(this.textInputField);
        this.textInputField.maxLength = 8;
    },
    initSinglePlayerBtn() {
        this.singlePlayerBtn = this.add.sprite(config.width/2 - this.SPACING_HORIZONTAL * (config.width),
                            config.height/2 + this.SPACING_VERTICAL * (config.height),
                                'single_player');
        this.singlePlayerBtn.setScale(this.BTNS_REDUCE_SCALE * config.width/this.background.width);
        this.singlePlayerBtn.setInteractive();
        this.singlePlayerBtn.on('pointerdown', () => {
            this.singlePlayerBtn.setTint(0xaaaaaa);
            socket.emit('joinSingleplayer', {
                nickname: this.textInputField.value
            });
        });
        this.singlePlayerBtn.on('pointerup', () => {
            this.singlePlayerBtn.setTint(0xffffff);
        });
        this.singlePlayerBtn.on('pointerout', () => {
            this.singlePlayerBtn.setTint(0xffffff);
        });
    },
    initMultiplayerBtn() {
        this.multiplayerBtn = this.add.sprite(config.width/2 + this.SPACING_HORIZONTAL * (config.width),
                                        config.height/2 + this.SPACING_VERTICAL * (config.height),
                                            'multi_player');
        this.multiplayerBtn.setScale(this.BTNS_REDUCE_SCALE * config.width/this.background.width);
        this.multiplayerBtn.setInteractive();
        this.multiplayerBtn.on('pointerdown', () => {
            this.multiplayerBtn.setTint(0xaaaaaa);
            socket.emit('joinMultiplayer', {
                nickname: this.textInputField.value
            });
        });
        this.multiplayerBtn.on('pointerup', () => {
            this.multiplayerBtn.setTint(0xffffff);
        });
        this.multiplayerBtn.on('pointerout', () => {
            this.multiplayerBtn.setTint(0xffffff);
        });
    }
});