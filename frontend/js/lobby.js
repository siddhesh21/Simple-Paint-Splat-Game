/**
 * Represents the main class.
 * @constructor
 */
const lobbyScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "lobby" });
    },
    init: function(data) {
        this.FLOAT_LEFT = 0.085;
        this.OFFSET_COLOR = 0.03 * config.height;
        this.OFFSET_TEXT = 0.04 * config.width;
        this.START_Y = 0.3;
        this.VERTICAL_STEP = 0.12;

        this.players = data.players;
        this.secondsRemaining = data.timeRemaining-1;
/**
 * Socket connection establishment. at the end of timer the game screen loaded along with the joined in players.
 */
        socket.on('gameStart', data => {
            game.scene.stop("lobby");
            socket.off('lobbyJoined');
            window.clearInterval(this.timerUpdateCallLobby);
            game.scene.start("game", data);
        });
    },
/**
 * Represents a function to load the predefined images in the screen.
 */    
    preload: function ()
    {
        this.load.image('lobby_background', 'assets/lobby_background.png');
        this.load.image('box', 'assets/lobby_color.png');
    },
/**
 * Represents a function to create and modify the way the screen looks.
 */    
    create: function() {
        socket.on('lobbyJoined', data => {
            this.players = data.players;

            this.destroyPreviousPlayers();
            this.labelAllPlayers();
        });

        // Setting the background
        this.background = this.add.image(config.width/2, config.height/2, 'lobby_background');
        this.background.setScale(config.width/this.background.width);

        //give labels to scores on screen
        this.labelAllPlayers();

        const xLobbyTimerText = 0.9 * (config.width);
        const yLobbyTimerText = 0.86 * (config.height);
        this.updateTimerLobby(xLobbyTimerText, yLobbyTimerText)
        this.timerUpdateCallLobby = window.setInterval(() => {
            this.updateTimerLobby(xLobbyTimerText, yLobbyTimerText)
        }, 1000);
    },
/**
 * The function to destroy players from previous session joined.    
 */
    destroyPreviousPlayers() {
        for (let i=0; i<this.onScreenPlayerObjects.length; i++) {
            this.onScreenPlayerObjects[i].destroy()
        }
    },
/**
 * Each time a new session of game starts the updateTimerLoby function will update the time.    
 */  
    updateTimerLobby(x, y){
        if (this.previousTimerTextLobby !== undefined) {
            this.previousTimerTextLobby.destroy();
        }
        
        this.previousTimerTextLobby = set_timer_on_screen(this.secondsRemaining, this, x, y);
        this.secondsRemaining = Math.max(0, this.secondsRemaining-1);
    },
/**
 * Function to label all players present on the lobby screen.    
 */  
    labelAllPlayers() {
        this.onScreenPlayerObjects = [];
        for (let i=0; i<this.players.length; i++) {
            /**
             * function call to the executable function.
             */
            this.labelOnScreen(this.players[i], i);
        }
    },
    labelOnScreen(player, index) {
        const xColor = config.width/2 - this.FLOAT_LEFT * config.width;
        const yColor = (this.START_Y * config.height) + this.VERTICAL_STEP * config.height * index + this.OFFSET_COLOR;

        const xText = config.width/2 - this.FLOAT_LEFT * config.width + this.OFFSET_TEXT;
        const yText = (this.START_Y * config.height) + this.VERTICAL_STEP * config.height * index;
    
        const text = player.nickname;
        const textColor = player.color.substring(1);

        box = this.add.rectangle(xColor, yColor, 500, 500, "0x" + textColor);
        box.setScale(config.box_scale * config.width/box.width);
        box.setStrokeStyle(20, 0x000000);
    
        const playerName = this.add.text(xText, yText, text, { color: 'black', fontFamily: 'Arial', fontSize: '25px '});
        this.onScreenPlayerObjects.push(box);
        this.onScreenPlayerObjects.push(playerName);
    }
});
