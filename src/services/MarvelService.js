import md5 from 'blueimp-md5';

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = '6a44f7c28766c03b37de408a7d605f26';
  _baseOffset = 210
  _baseLimit = 9

  getHash = (timeStamp, apikey) => {
    return md5(
      timeStamp + '2154bb8e0e7d81078f146c75e0f51bb433c116b3' + apikey
    );
  };

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset, limit = this._baseLimit) => {
    const timeStamp = +new Date();
    const hash = this.getHash(timeStamp, this._apiKey);
    const res = await this.getResource(
      `${this._apiBase}characters?limit=${limit}&offset=${offset}?&ts=${timeStamp}&apikey=${this._apiKey}&hash=${hash}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const timeStamp = +new Date();
    const hash = this.getHash(timeStamp, this._apiKey);
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?&ts=${timeStamp}&apikey=${this._apiKey}&hash=${hash}`
    );
    return this._transformCharacter(res.data.results[0])
  };

  _transformCharacter = (char) => {
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
}

export default MarvelService;
