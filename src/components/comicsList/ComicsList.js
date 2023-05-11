import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';



const ComicsList = () => {
const [comicsList, setComicsList] = useState([]);
const [newComicsLoading, setNewComicsLoading] = useState(false)
const [offset, setOffset] = useState(0)    
const [comicsEnded, setComicsEnded] = useState(false)
const limit = 8;

const {loading, error, getAllComics} = useMarvelService();

useEffect(() => {
    onRequest(offset, limit, true)
}, [])

const onRequest = (offset, initial) => {
    initial ? setNewComicsLoading(false) : setNewComicsLoading(true)
    getAllComics(offset, limit)
    .then(onComicsListLoaded)
}
const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < limit) {
        ended = true;            
    }        
    setComicsList(comicsList => [...comicsList, ...newComicsList]);
    setNewComicsLoading(false)
    setOffset(offset + limit)
    setComicsEnded(comicsEnded => ended) 
    // console.log(comicsList)   
}

const createComicsItems = (comicsList) => {
    const items = comicsList.map((item, i) => {
        const {id, name, thumbnail, price} = item
        return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={name} className="comics__item-img"/>
                        <div className="comics__item-name">{name}</div>
                        <div className="comics__item-price">{price}$</div>
                    </Link>
                </li>
        )
    })
    return <ul className="comics__grid">{items}</ul>
}


    const elements = createComicsItems(comicsList)
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newComicsLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {elements}
            <button onClick={() => onRequest(offset, limit)} className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;