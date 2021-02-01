const Constants = require('../lib/constants');

/**
 * Supervises a game from start to end.
 */
 class GameSupervisor {
    /**
     * ID of the game handled by the server.
     * Incremented on every GameSupervisor created.
     */
    static GameIdCounter = 1;

    /**
     * Creates a supervisor for a Paint-Splat! game
     * @param {*} io Socket.io connection
     * @param {*} players Array of players in this game
     * @param {boolean} useAI Use AI against first player (only for single player mode)
     */
    constructor(io, players, useAI) {
        this.io = io;
        this.gameId = GameSupervisor.GameIdCounter++;
        this.roomId = 'game-' + this.gameId;
        this.players = players;
        this.grid = [[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1]];
        this.currTime = Constants.DEFAULT_GAME_TIME;
        this.useAI = useAI;

        this.initTimer();
        this.initIoRoom();
        this.initPlayerSocketEvents();

        if (this.useAI)
            this.initAI();

        let sendPlayers = [];
        for (const p of this.players) {
            sendPlayers.push(p.getObj());
        }

        this.io.to(this.roomId).emit('gameStart', {
            timeRemaining: this.currTime,
            players: sendPlayers
        });
    }

    /**
     * Generates a random position of paint on the grid
     * @return {array} Paint position: array of shape [X, Y]
     */
    generateRandomPosition() {
        const randX = Math.floor(Math.random() * (this.grid.length))
        const randY = Math.floor(Math.random() * (this.grid[0].length))
        return [randX, randY];
    }

    /**
     * Initializes the AI for the game.
     * AI is only used in single player mode and is second player in the list.
     */
    initAI() {
        this.AIPlayer = this.players[1];

        this.AIInterval = setInterval(() => {
            const p = this.generateRandomPosition();
            this.onNewPaintEvent(this.AIPlayer, p);
        }, Constants.AI_DELAY);
    }

    /**
     * Initializes Socket.io room for players. Each player of the game will
     * join the same room to ease communication through sockets.
     */
    initIoRoom() {
        for (const player of this.players) {
            if (player.socket) player.socket.join(this.roomId);
        }
    }

    /**
     * Initializes the game timer.
     */
    initTimer() {
        this.timer = setInterval(() => {
            this.currTime--;
            if (this.currTime % 10 == 0) {
                this.grid.velocity *= 1.5;
            }

            if (this.currTime < 0) {
                this.endGame();
            }
        }, 1000);
    }

    /**
     * Initializes Socket.io (i.e. real-time) events for all players of the game
     */
    initPlayerSocketEvents() {
        for (const player of this.players) {
            if (!player.socket) continue;

            player.socket.on('drawPaint', (data) => {
                this.onNewPaintEvent(player, data.paintPosition);
            });
        }
    }

    /**
     * Handles new paint event from a player at a given position on the grid
     * @param {*} player Player who drawn the new paint
     * @param {*} paintPosition Position [X, Y] of the paint
     */
    onNewPaintEvent(player, paintPosition) {
        const p = paintPosition;
        
        if (p[0] < 0 || p[0] >= this.grid.length
            || p[1] < 0 || p[1] >= this.grid[0].length
            || this.grid[p[0]][p[1]] != -1) {
            if (player.socket) player.socket.emit('paintMissed');
            return;
        }

        this.grid[p[0]][p[1]] = player.color;
        player.score += Constants.SCORE_ON_SPLAT;

        this.io.to(this.roomId).emit('newPaint', {
            player: player.getObj(),
            paintPosition: p,
            timeRemaining: this.currTime
        });

        if (this.isGameboardFull())
            this.endGame();
    }

    /**
     * Checks if the gameboard is full (i.e. no more paints possible) or not
     * @return {boolean} True if the gameboard is full, false otherwise
     */
    isGameboardFull() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] == -1)
                    return false;
            }
        }
        return true;
    }

    /**
     * Ends the game: emit end Socket.io event to all players and disconnect
     * players from the Socket.io room.
     */
    endGame() {
        console.log("=== Game ended ===");
        clearInterval(this.timer);

        if (this.useAI)
            clearInterval(this.AIInterval);

        let sendPlayers = [];
        for (const p of this.players) {
            sendPlayers.push(p.getObj());
        }
        
        // Order players by score desc
        sendPlayers.sort((a, b) => (a.score > b.score) ? -1 : 1);

        this.io.to(this.roomId).emit('gameEnd', {
            players: sendPlayers
        });

        for (const player of this.players)
            if (player.socket) player.socket.leave(this.roomId);
    }
}

module.exports = GameSupervisor;