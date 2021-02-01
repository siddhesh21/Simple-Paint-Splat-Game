const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Player = require('./class/Player');
const Matchmaking = require('./class/Matchmaking');

const globalMatchmaking = new Matchmaking(io);
const singleMatchmaking = new Matchmaking(io);

io.on('connection', (socket) => {
  /**
   * When a player chosses to join a multiplayer game
   */
  socket.on('joinMultiplayer', (data) => {
    if (typeof data.nickname === "undefined" || data.nickname === "")
      return;
    
    const newPlayer = new Player(data.nickname, socket);
    globalMatchmaking.addPlayer(newPlayer);
  });

  /**
   * When a player chooses to join a single player game
   */
  socket.on('joinSingleplayer', (data) => {
    if (typeof data.nickname === "undefined" || data.nickname === "")
      return;
    
    const newPlayer = new Player(data.nickname, socket);
    const aiPlayer = new Player("OverfittedAI", null);

    // Slightly delay the appearance of AI in the single player lobby
    singleMatchmaking.addPlayer(newPlayer);
    setTimeout(() => {
      singleMatchmaking.addPlayer(aiPlayer);
      setTimeout(() => {
        singleMatchmaking.createGame(true);
      }, 2000);
    }, 1000);
  });
});

http.listen(3030, () => {
  console.log('listening on *:3030');
});
