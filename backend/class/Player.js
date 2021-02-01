const GameSupervisor = require('./GameSupervisor');

/**
 * Class representing a player
 */
class Player {

    /**
     * Creates a new player
     * @param {string} nickname Nickname of the player
     * @param {*} socket Socket of the player (to communicate with him)
     */
    constructor (nickname, socket) {
        this.nickname = nickname;
        this.socket = socket;
        this.score = 0;
    }

    /**
     * Retrieves the object describing the player without his socket (prevents
     * infinite recursion in socket when sending events)
     * @return {Object} Player's object
     */
    getObj() {
        return {
            nickname: this.nickname,
            score: this.score,
            color: this.color
        }
    }

}

module.exports = Player;