const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const AnimeAPI = require('./anime-api');

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'client')));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const animeApi = new AnimeAPI();
const PORT = process.env.PORT || 3000;

app.get('/api/get-random-character', async (req, res) => {
  try {
    const type = req.query.type.toLowerCase();
    const channel = req.query.channel.toLowerCase();
    const sender = req.query.sender.toLowerCase();

    let characterId;

    if (type === 'w') characterId = await animeApi.getRandomFemaleID();
    else if (type === 'h') characterId = await animeApi.getRandomMaleID();
    else characterId = await animeApi.getRandomCharacterID();
    const character = await animeApi.getCharacter(characterId);

    io.emit(channel, character);

    // res.sendStatus(204); // Successful no body
    if (character.id === 106376 || character.name === 'Ganyu') {
      res.send(`You pulled ${character.name} but unfortunately ${character.name} only loves Marviuz LUL in this channel at least`);
    } else {
      res.send(`Nice one @${sender}! You got ${character.name} from ${character.origin} PogChamp`);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => console.log(`> Ready on localhost:${3000}`));