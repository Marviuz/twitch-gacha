const { default: axios } = require('axios');

const $ = axios.create({ baseURL: 'https://www.animecharactersdatabase.com/' });

class AnimeApi {
  async getRandomFemaleID() {
    const response = await $.get('/r.php', { params: { f: true } });
    const url = new URL(response.request.res.responseUrl).searchParams;
    const params = new URLSearchParams(url);

    return params.get('id');
  };

  async getRandomMaleID() {
    const response = await $.get('/r.php', { params: { m: true } });
    const url = new URL(response.request.res.responseUrl).searchParams;
    const params = new URLSearchParams(url);

    return params.get('id');
  };

  async getRandomCharacterID() {
    const random = Math.round(Math.random());

    if (random) return this.getRandomFemaleID();
    return this.getRandomMaleID();
  };

  async getCharacter(id) {
    const response = await $.get(`/api_series_characters.php`, { params: { character_id: id } });

    return response.data;
  };
}

module.exports = AnimeApi;