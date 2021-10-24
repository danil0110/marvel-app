import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _apiBase = 'https://gateway.marvel.com:443/v1/public';
  const _apiKey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`;
  const _baseCharactersOffset = 210;
  const _baseComicsOffset = 500;

  const getAllCharacters = async (offset = _baseCharactersOffset) => {
    const res = await request(`${_apiBase}/characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = _baseComicsOffset) => {
    const res = await request(`${_apiBase}/comics?limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: !char.description
        ? 'There is no description for this character.'
        : char.description.length > 210
        ? char.description.slice(0, 210) + '...'
        : char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      price: comics.prices[0].price !== 0 ? `$${comics.prices[0].price}` : 'NOT AVAILABLE',
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      url: comics.urls[0].url,
    };
  };

  return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics };
};

export default useMarvelService;
