const Constants = require('../lib/constants');
const GameSupervisor = require('./GameSupervisor');

/**
 * Class providing a matchmaking system: groups players in lobbies and create games
 */
class Matchmaking {
    /** Available colors for players */
    static colors = Constants.DEFAULT_COLORS;

    /**
     * Create a new matchmaking system (a single Matchmaking instance is
     * sufficient for the lobbies to work
     * @param {*} io The Socket.io connection
     */
    constructor(io) {
        this.io = io;
        this.players = [];
        this.currTime = Constants.MAXIMUM_LOBBY_WAIT_TIME;
        this.timer = null;
    }

    /**
     * Initializes the timer of the matchmaking system.
     */
    initTimer() {
        this.timer = setInterval(() => {
            this.currTime--;
            if (this.currTime <= 0) {
                this.createGame();
                this.resetMatchmaking();
            }
        }, 1000);
    }

    /**
     * Resets matchmaking to create a new lobby (reset players and timer)
     */
    resetMatchmaking() {
        this.players = [];
        clearInterval(this.timer);
        this.currTime = Constants.MAXIMUM_LOBBY_WAIT_TIME;
    }

    /**
     * Adds a new player to the current matchmaking (i.e. lobby) being populated
     * @param {*} player Player to add to the lobby
     */
    addPlayer(player) {
        player.color = Matchmaking.colors[this.players.length];
        player.score = 0;
        this.players.push(player);

        if (this.players.length == 1) {
            this.initTimer();
        }

        // Send information about lobby to client
        let sendPlayers = []
        for (const p of this.players)
            sendPlayers.push(p.getObj());

        for (const player of this.players) {
            if (player.socket) {
                player.socket.emit('lobbyJoined', {
                    timeRemaining: this.currTime,
                    players: sendPlayers
                });
            }
        }

        // Ensure lobbyJoined has been received before gameStart
        setTimeout(() => {
            if (this.players.length == Constants.MAX_PLAYERS_PER_GAME) {
                this.createGame(false);
            }
        }, 1000);
    }

    /**
     * Creates a game with the players of the current lobby
     * @param {boolean} useAI If true, second player of the list will be replaced
     * by AI by the GameSupervisor (used in single player mode only)
     */
    createGame(useAI) {
        new GameSupervisor(this.io, this.players, useAI);
        this.resetMatchmaking();
    }
}

module.exports = Matchmaking;