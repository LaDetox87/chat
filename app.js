const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const player = require('play-sound')();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', socket.pseudo1 + " a quitté le chat gros nul !");
      });
    socket.on('pseudo', (pseudo) => {
        const soundFilePath = "./discordsound.mp3";
        player.play(soundFilePath, (err) => {
          if (err) {
              console.error(`Impossible de jouer le son: ${err}`);
          } else {
              console.log('Son joué avec succès');
          }
      });
        socket.pseudo1 = pseudo;
        io.emit('chat message', socket.pseudo1 + " a rejoint le chat !");
    });
    socket.on('chat message', (msg) => {
        console.log(msg);
        if (msg == "kevin"){
          io.emit('chat message', `<img alt="erreur" src="https://th.bing.com/th/id/OIP.ILW_ev5UzinTqpk43M9cVAHaHK?rs=1&pid=ImgDetMain"></img>`);
        }else{
          io.emit('chat message', socket.pseudo1 + ": " + msg);
        }
        
    });
  });
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

