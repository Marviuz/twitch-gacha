const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const AnimeAPI = require('./anime-api');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const animeApi = new AnimeAPI();

const PORT = process.env.PORT || 3000;

app.get('/api/get-random-character', async (req, res) => {
  try {
    const type = req.query.type;
    const channel = req.query.channel;
    let characterId;

    if (type === 'w') characterId = await animeApi.getRandomFemaleID();
    else if (type === 'h') characterId = await animeApi.getRandomMaleID();
    else characterId = await animeApi.getRandomCharacterID();
    const character = await animeApi.getCharacter(characterId);

    io.emit(channel, character);

    // res.sendStatus(204); // Successful no body
    res.send(JSON.stringify(character));
  } catch (err) {
    res.sendStatus(500);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => console.log(`> Ready on localhost:${3000}`));