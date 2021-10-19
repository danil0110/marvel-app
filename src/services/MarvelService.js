class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public';
  _apiKey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`;

  getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Couldn't fetch the ${url}. Status: ${res.status}.`);
    }

    return await res.json();
  };

  getAllCharacters = () => {
    return this.getResource(`${this._apiBase}/characters?limit=9&offset=210&${this._apiKey}`);
  };

  getCharacter = (id) => {
    return this.getResource(`${this._apiBase}/characters/${id}?${this._apiKey}`);
  };
}

export default MarvelService;
