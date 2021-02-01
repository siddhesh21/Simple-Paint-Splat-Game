/**
 * Declaring the required variables for main Game playing screen.
 */
const ROWS = 4;
const COLUMNS = 5;
const PLAYER_COLOR_SPACING = 0.125;
const OFFSET_SCORE_TEXT_X = 0.04 * config.width;
const OFFSET_SCORE_TEXT_Y = 0.03 * config.height;
const MAX_SPEED = 1000;
const GRID_OFFSET = config.width * 0.02
/**
 * Main Class.
 * @constructor.
 */
const gameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "game" });
    },
    init: function(data) {
        this.players = data.players;
        this.speed = 50;
        this.secondsRemaining = data.timeRemaining-1;
    },
    /** 
     * Represents a function to load the predefined images in the screen.
     */
    preload: function()
    {
        this.load.image('game_background', 'assets/game_background.png');
        this.load.image('grid', 'assets/grid.png');
        this.load.image('splat_1abc9c', 'assets/splat_1abc9c.png');
        this.load.image('splat_9b59b6', 'assets/splat_9b59b6.png');
        this.load.image('splat_3498db', 'assets/splat_3498db.png');
        this.load.image('splat_e74c3c', 'assets/splat_e74c3c.png');
        this.load.image('splat_f1c40f', 'assets/splat_f1c40f.png');
        this.load.image('box', 'assets/lobby_color.png');
        this.load.image('fire', 'assets/fire.png');
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('target', 'assets/target.png');

        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.targetSpeed = 0.002 * (config.width);
    },
    create: function() {
        /**
         * Setting the background image as per the screen resolution.
         */
        this.background = this.add.image(config.width/2, config.height/2, 'game_background');
        this.background.setScale(config.width/this.background.width);

        /**
         * Placing the moving grid over the background image.
         */
        this.grid = this.physics.add.sprite(config.width/2, config.height/2, 'grid').setInteractive();
        this.grid.scale = config.width/this.background.width;
        this.grid.scaledWidth = this.grid.width*this.grid.scale;
        this.grid.scaledHeight = this.grid.height*this.grid.scale;
        this.grid.setScale(this.grid.scale);
        /**
         * Calling function to mark player and thier associated score on the screen.
         */
        this.paintPlayers();
        this.paintScores();
        /**
         * function container to capture the paint splash made by the players on the moving grid.
         */
        this.gridContainer = this.add.container(0, 0);
        this.physics.world.enableBody(this.gridContainer);
        this.gridContainer.add(this.grid);
        /**
         * Function to update timer on game playing screen. Its an indication that conveys the time left in the game.
         */
        this.gridContainer.body.setVelocityX(this.speed);
        this.gridContainer.body.setVelocityY(this.speed);

        const xGameTimerText = 0.88 * (config.width);
        const yGameTimerText = 0.08 * (config.height);
        this.updateTimerGame(xGameTimerText, yGameTimerText)
        this.timerUpdateCallGame = setInterval(() => {
            this.updateTimerGame(xGameTimerText, yGameTimerText)
        }, 1000);

        /**
         * Sockets connection established for updating server about miss,hit score and to specify game ending. 
         */
        socket.on('newPaint', data => {
            this.onNewPaint(data);
        });
        socket.on('paintMissed', () => {
            this.onPaintMissed();
        });
        socket.on('gameEnd', data => { this.onGameEnd(data); });
        /**
         * Represents a block of functions to place controls to move the cursor on the screen. 
         * create target
         */
        
        this.target = this.add.image(config.width/2, config.height/2, 'target');
        this.target.scale = 0.5 * (config.width/this.background.width)
        this.target.setScale(this.target.scale);
        this.targetPositionX = config.width/2;
        this.targetPositionY = config.height/2;
        this.canFire = true;
        this.spaceHasBeenReleased = true;

        if(!IS_TOUCH) {
            return;
        }

        /**
         * create fire button.
         */ 
        this.fireButton = this.add.image(0.9 * config.width, 0.85 * config.height, 'fire').setInteractive();
        this.fireButton.setScale(0.15 * (config.width/this.fireButton.width));
        this.fireButton.alpha = 0.6;
        this.fireButton.on('pointerdown', () =>  {
            this.triggerFire();
            this.fireButton.alpha = 0.8;
        });
        this.fireButton.on('pointerup', () => this.fireButton.alpha = 0.6);
        this.fireButton.on('pointerout', () => this.fireButton.alpha = 0.6);

        /**
         * creating arrow up.
         */
        this.arrowUp = this.add.image(0.15 * config.width, 0.64 * config.height, 'arrow').setInteractive();
        this.arrowUp.setScale(0.08 * (config.width/this.arrowUp.width));
        this.arrowUp.alpha = 0.6;
        this.arrowUp.on('pointerdown', () =>  {
            this.arrowUpDown = true;
            this.arrowUp.alpha = 0.8;
        });
        this.arrowUp.on('pointerup', () => {
            this.arrowUpDown = false;
            this.arrowUp.alpha = 0.6;
        });
        this.arrowUp.on('pointerout', () => {
            this.arrowUpDown = false;
            this.arrowUp.alpha = 0.6;
        });

        /**
         * creating arrow down.
         */
        this.arrowDown = this.add.image(0.15 * config.width, 0.92 * config.height, 'arrow').setInteractive();
        this.arrowDown.rotation = Math.PI;
        this.arrowDown.setScale(0.08 * (config.width/this.arrowDown.width));
        this.arrowDown.alpha = 0.6;
        this.arrowDown.on('pointerdown', () =>  {
            this.arrowDownDown = true;
            this.arrowDown.alpha = 0.8;
        });
        this.arrowDown.on('pointerup', () => {
            this.arrowDownDown = false;
            this.arrowDown.alpha = 0.6;
        });
        this.arrowDown.on('pointerout', () => {
            this.arrowDownDown = false;
            this.arrowDown.alpha = 0.6;
        });

        /**
         * creating arrow left.
         */
        this.arrowLeft = this.add.image(0.07 * config.width, 0.78 * config.height, 'arrow').setInteractive();
        this.arrowLeft.rotation = 3*Math.PI/2;
        this.arrowLeft.setScale(0.08 * (config.width/this.arrowLeft.width));
        this.arrowLeft.alpha = 0.6;
        this.arrowLeft.on('pointerdown', () =>  {
            this.arrowLeftDown = true;
            this.arrowLeft.alpha = 0.8;
        });
        this.arrowLeft.on('pointerup', () => {
            this.arrowLeftDown = false;
            this.arrowLeft.alpha = 0.6;
        });
        this.arrowLeft.on('pointerout', () => {
            this.arrowLeftDown = false;
            this.arrowLeft.alpha = 0.6;
        });

        /**
         * creating arrow right
         */
        this.arrowRight = this.add.image(0.23 * config.width, 0.78 * config.height, 'arrow').setInteractive();
        this.arrowRight.rotation = Math.PI/2;
        this.arrowRight.setScale(0.08 * (config.width/this.arrowRight.width));
        this.arrowRight.alpha = 0.6;
        this.arrowRight.on('pointerdown', () =>  {
            this.arrowRightDown = true;
            this.arrowRight.alpha = 0.8;
        });
        this.arrowRight.on('pointerup', () => {
            this.arrowRightDown = false;
            this.arrowRight.alpha = 0.6;
        });
        this.arrowRight.on('pointerout', () => {
            this.arrowRightDown = false;
            this.arrowRight.alpha = 0.6;
        });
    },
    /**
     * Represents a function to collect information about the target co-ordinates hit by the player on the moving grid.
     */
    calculateCoordinates: function() {
        let currentPosition = [this.target.x, this.target.y];

        if(this.upKey.isDown || this.arrowUpDown) {
            currentPosition[1] -= this.targetSpeed;
        }
        if(this.downKey.isDown || this.arrowDownDown) {
            currentPosition[1] += this.targetSpeed;
        }

        if(this.rightKey.isDown || this.arrowRightDown) {
            currentPosition[0] += this.targetSpeed;
        }
        if(this.leftKey.isDown || this.arrowLeftDown) {
            currentPosition[0] -= this.targetSpeed;
        }

        return currentPosition;
    },
    /**
     * Represents a function to trigger paint splat on the moving grid.
     */
    triggerFire: function() {
        if(!this.canFire) {
            return;
        }

        let pointer = {
            downX: this.target.x,
            downY: this.target.y
        };

        this.onPointerDown(pointer);
    },
    /**
     * Represents a function to capture new target fire co-ordinates and update it to server log.
     */
    updateTargetAndCheckFire: function() {
        let newTargetCoordinates = this.calculateCoordinates();

        if(newTargetCoordinates[0] <= 0.92 * config.width && newTargetCoordinates[0] >= 0.055 * config.width) {
            this.target.x = newTargetCoordinates[0];
        }
        if(newTargetCoordinates[1] <= 0.913 * config.height && newTargetCoordinates[1] >= 0.167 * config.height) {
            this.target.y = newTargetCoordinates[1];
        }

        
        console.log(this.canFire); 
        if(this.space.isDown && this.spaceHasBeenReleased) {
            this.spaceHasBeenReleased = false;
            this.triggerFire();
        }
        if(this.space.isUp) {
            this.spaceHasBeenReleased = true;
        }
    },
    /**
     * Represents a function to capture the grid value that are paint splatted.
    */
    update: function() {
        this.speed += 0.1;
        this.speed = Math.min(this.speed, MAX_SPEED);

        if (this.gridContainer.x >= 0.27 * config.width) {
            this.gridContainer.body.setVelocityX(-this.speed);
        }

        if (this.gridContainer.x <= -0.3 * config.width) {
            this.gridContainer.body.setVelocityX(this.speed);
        }

        if (this.gridContainer.y >= 0.272 * config.height) {
            this.gridContainer.body.setVelocityY(-this.speed);
        }

        if (this.gridContainer.y <= -0.195 * config.height) {
            this.gridContainer.body.setVelocityY(this.speed);
        }
        /**
        * Function call to the update console function.
        */
        this.updateTargetAndCheckFire();
    },
    
    /**
     * Represents a block of executable function that are called by onother calling function defined before.
     * @param  {} pointer
     */
    onPointerDown(pointer) {
        const downX = pointer.downX;
        const downY = pointer.downY;

        const gridStartX = this.grid.x - (this.grid.scaledWidth/2) + this.gridContainer.x;
        const gridStartY = this.grid.y - (this.grid.scaledHeight/2) + this.gridContainer.y;

        if(downX <= gridStartX || downX >= (gridStartX + this.grid.scaledWidth) ||
                downY <= gridStartY || downY >= (gridStartY + this.grid.scaledHeight)) {
                    socket.emit('drawPaint', {
                        paintPosition: [-1, -1]
                    });
                    return;
        }
        this.canFire = false;

        const x = downX - gridStartX;
        const y = downY - gridStartY;
        const coordinates = this.getCoordinates(x, y, this.grid.scaledWidth, this.grid.scaledHeight);

        socket.emit('drawPaint', {
            paintPosition: coordinates
        });
    },
    
    /**
     * Take x and y (relative to the grid) and the grid width and height, and returns matrix coordinates
     * @param  {} x
     * @param  {} y
     * @param  {} width
     * @param  {} height
     */
    getCoordinates(x, y, width, height) {
        const rowStep = height/ROWS;
        const colStep = width/COLUMNS;

        const resultingRow = y/rowStep;
        const resultingCol = x/colStep;

        return [parseInt(resultingRow), parseInt(resultingCol)];
    },
    
    /**
     * Collect the score secured by each player.
     * @param  {} data
     */
    onNewPaint(data) {
        this.updatePlayerScore(data.player)
        
        const splatColor = '0x' + data.player.color.substring(1);
        this.destroyPreviousPlayersScores();
    
        this.paintSplatOnCoordinates(this.grid, data.paintPosition[0], data.paintPosition[1], splatColor);
        this.paintScores();
        this.canFire = true;
    },
     /**
     * No updation of score for each target miss.
     */ 
    onPaintMissed() {
        let bar = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height/6, 0x000000, 0.2);
        bar.setOrigin(0.5);

        let text = this.add.text(this.scale.width/2, this.scale.height/2, "Missed!", {
            font: "bold 40px Arial", fill: "#c0392b"
        }); 
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setOrigin(0.5);

        setTimeout(() => {
            text.destroy();
            bar.destroy();
            this.canFire = true;
        }, 800);
    },
    
    /**
     * Once the game play time is over the server loads the leaderboard screen.
     * @param  {} data
     */
    onGameEnd(data) {
        game.scene.stop("game");
        clearInterval(this.previousTimerTextGame);
        game.scene.start("leaderboard", data);
        socket.off();
    },
    /**
     *Update the score of each player on the game playing screen.
     * @param  {} playerUpdate
     */
    updatePlayerScore(playerUpdate) {
        for (const player of this.players) {
            if (player.color == playerUpdate.color) {
                player.score = playerUpdate.score;
                return;
            }
        }
    },

    destroyPreviousPlayersScores() {
        for (const onScreenPlayerScore of this.onScreenPlayerScores) {
            onScreenPlayerScore.destroy();
        }
    },
    /**
     * After the end of each game playing seesion the previous player are deleted.
     * @param  {} grid
     * @param  {} row
     * @param  {} col
     * @param  {} splatColor
     */
    paintSplatOnCoordinates(grid, row, col, splatColor) {
        const cellStepX = (grid.scaledWidth - GRID_OFFSET)/COLUMNS;
        const cellStepY = (grid.scaledHeight - GRID_OFFSET)/ROWS;
    
        const splatX = (grid.x - (grid.scaledWidth/2) + GRID_OFFSET/2) + (cellStepX * (0.5 + col));
        const splatY = (grid.y - (grid.scaledHeight/2) + GRID_OFFSET/2) + (cellStepY * (0.5 + row));
    
        let splat = this.add.image(splatX, splatY, 'splat_' + splatColor.substring(2));
        splat.setTint(splatColor);
        splat.setScale(0.05 * (config.width/splat.width) * (3.2/COLUMNS));
    
        this.gridContainer.add(splat);
    },
    paintPlayers() {
        for (let i in this.players) {
            //Function call made to paint player color.
            this.paintPlayerOnScreen(this.players[i], i);
        }
    },
    /**
     * Differentiating player based on the different colors assigned to them.
     * @param  {} player
     * @param  {} index
     */
    paintPlayerOnScreen(player, index) {
        const xColor = (0.09 * config.width) + (PLAYER_COLOR_SPACING * index * config.width);
        const yColor = 0.105 * config.height;
    
        const textColor = player.color.substring(1);
        box = this.add.rectangle(xColor, yColor, 500, 500, "0x" + textColor);
        box.setScale(config.box_scale * config.width/box.width);
        box.setStrokeStyle(20, 0x000000);
    },
    /**
     * Paint player score on screen.
     * @param  {} player
     * @param  {} index
     */
    paintPlayerScoreOnScreen(player, index) {
        const xColor = (0.09 * config.width) + (PLAYER_COLOR_SPACING * index * config.width);
        const yColor = 0.105 * config.height;

        const xScore = xColor + OFFSET_SCORE_TEXT_X;
        const yScore = yColor - OFFSET_SCORE_TEXT_Y;
    
        const score = player.score;
    
        const playerScore = this.add.text(xScore, yScore, score, { color: 'black', fontFamily: 'Arial', fontSize: '25px '});
        this.onScreenPlayerScores.push(playerScore);
    },
    paintScores() {
        this.onScreenPlayerScores = []
        for (let i in this.players) {
            /**
             * function call made to paint score info.
             */
            this.paintPlayerScoreOnScreen(this.players[i], i);
        }
    },
    /**
     * diplaying updated time on screen.
     * @param  {} x
     * @param  {} y
     */
    updateTimerGame(x, y){
        if (this.previousTimerTextGame !== undefined) {
            this.previousTimerTextGame.destroy();
        }
        
        this.previousTimerTextGame = set_timer_on_screen(this.secondsRemaining, this, x, y);
        this.secondsRemaining = Math.max(0, this.secondsRemaining-1);
    }
});