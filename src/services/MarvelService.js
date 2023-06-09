import md5 from 'blueimp-md5';
import { useHttp } from '../hooks/http.hook';

const  useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();


  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = '1e4e9556af8311bfc23ac338780e0b14';
  const _baseOffset = 210
  const _baseLimit = 9

  const getHash = (timeStamp, apikey) => {
    return md5(
      timeStamp + '6d9c67430590de07aa8ea3ca340585613dd937a5' + apikey
    );
  };

  

  const getAllCharacters = async (offset = _baseOffset, limit = _baseLimit) => {
    const timeStamp = +new Date();
    const hash = getHash(timeStamp, _apiKey);
    const res = await request(
      `${_apiBase}characters?limit=${limit}&offset=${offset}?&ts=${timeStamp}&apikey=${_apiKey}&hash=${hash}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const timeStamp = +new Date();
    const hash = getHash(timeStamp, _apiKey);
    const res = await request(
      `${_apiBase}characters/${id}?&ts=${timeStamp}&apikey=${_apiKey}&hash=${hash}`
    );
    return _transformCharacter(res.data.results[0])
  };

  const getComic = async (id) => {
    const timeStamp = +new Date();
    const hash = getHash(timeStamp, _apiKey);
    const res = await request(
      `${_apiBase}comics/${id}?&ts=${timeStamp}&apikey=${_apiKey}&hash=${hash}`
    );
    return _transformComics(res.data.results[0]);
  };

  const getAllComics = async (offset = 0, limit = 8) => {
    const timeStamp = +new Date();
    const hash = getHash(timeStamp, _apiKey);
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=${limit}&limit=8&offset=${offset}&ts=${timeStamp}&apikey=${_apiKey}&hash=${hash}`
    );
    return res.data.results.map(_transformComics);
  };

  const _transformComics = (comics) => {
    // console.log(comics)
        
    return {
      id: comics.id,
      name: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",     
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      price: comics.prices[0].price,
      language: comics.textObjects[0]?.language || 'en-us...',
      href: comics.urls[0].url     
    }   
  }

  const _transformCharacter = (char) => {
    const descr = char.description.length === 0 ? 'There is no description for this character' : char.description.length > 190 ? char.description.slice(0,190) + '...' : char.description;
    return {
      id: char.id,
      name: char.name,
      descripion: descr,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }   
  }

  return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic}
}

export default useMarvelService;
