require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const AnimeAPI = require('./anime-api');
const query = require('./database');

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'client')));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const animeApi = new AnimeAPI();
const PORT = process.env.PORT || 3000;

app.get('/api/get-random-character', async (req, res) => {
  const type = req.query.type.toLowerCase();
  const channel = req.query.channel.toLowerCase();
  const sender = req.query.sender.toLowerCase();

  let characterId;
  let character;

  try {
    if (type === 'w') characterId = await animeApi.getRandomFemaleID();
    else if (type === 'h') characterId = await animeApi.getRandomMaleID();
    else characterId = await animeApi.getRandomCharacterID();
    character = await animeApi.getCharacter(characterId);

    io.emit(channel, character);

    if (character.id === 106376 || character.name === 'Ganyu') {
      res.send(`You pulled ${character.name} but unfortunately ${character.name} only belongs to Marviuz LUL`);
    } else {
      query('INSERT INTO Pulls(TwitchID, CharacterID) VALUES (?, ?)', [sender, character.id])
        .then(() => {
          res.send(`Nice one @${sender}! You got ${character.name} from ${character.origin}! PogChamp`);
        })
        .catch(err => res.send(`An error occured!!! ${err.code}`));
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
      console.log(3);
      res.send(`Nice one @${sender}! You got ${character.name} from ${character.origin} again! PogChamp`);
    } else {
      res.send(`An error occured!!! ${err.code}`);
    }
  }
});

app.get('/api/count', async (req, res) => {
  const sender = req.query.sender.toLowerCase();

  try {
    const [[{ count }]] = await query('SELECT COUNT(*) count FROM Pulls WHERE TwitchID = ?', [sender]);
    res.send(`@${sender} pulled ${count} unique characters ${count > 0 ? 'PogChamp' : 'LUL'}`);
  } catch (err) {
    res.send(`@Marviuz AN ERROR OCCURED!!! ${err.message}`);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => console.log(`> Ready on localhost:${3000}`));