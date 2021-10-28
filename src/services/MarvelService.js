import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();
  const _apiBase = 'https://gateway.marvel.com:443/v1/public';
  const _apiKey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`;
  const _baseCharactersOffset = 210;
  const _baseComicsOffset = 100;

  const getAllCharacters = async (offset = _baseCharactersOffset) => {
    const res = await request(`${_apiBase}/characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}/characters?name=${name}&${_apiKey}`);
    if (res.data.count > 0) {
      return _transformCharacter(res.data.results[0]);
    }

    return null;
  };

  const getAllComics = async (offset = _baseComicsOffset) => {
    const res = await request(`${_apiBase}/comics?limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComic);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}/comics/${id}?&${_apiKey}`);
    return _transformComic(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: !char.description
        ? 'There is no description for this character.'
        : char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description ? comic.description : 'No description for this comic.',
      price: comic.prices[0].price
        ? comic.prices[0].price !== 0
          ? `$${comic.prices[0].price}`
          : 'NOT AVAILABLE'
        : 'NOT AVAILABLE',
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      pageCount: comic.pageCount ? comic.pageCount : 'No information about the number of pages.',
      language: comic.textObjects.language ? comic.textObjects.language : 'en-us.',
    };
  };

  return {
    clearError,
    process,
    setProcess,
    getAllCharacters,
    getCharacter,
    getCharacterByName,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
