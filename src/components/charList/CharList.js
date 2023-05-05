import { useState, useEffect, useRef } from 'react';
import './charList.scss';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const CharList = (props) =>  {

    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(1)
    const [limit, setLimit] = useState(9)
    const [charEnded, setCharEnded] = useState(false)

    

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = (offset, limit) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset, limit)
        .then(onCharListLoaded)
        .catch(onError)
    }
    
    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;            
        }        
        setCharList(charList => [...charList, ...newCharList])
        setLoading(loading => false)
        setError(error => false)
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + limit)
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        setError(true);
        setLoading(false)
    }


    const itemRefs = useRef([]);

    

    const focusOnItem = (id) => {       
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function CreateCharListItems(charList) {
        const elements = charList.map((item, i) => {
            const {id, name, thumbnail} = item;
    
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
    
            return (
                <li key={id}
                    className="char__item"
                    tabIndex={0}
                    ref={(el) => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(id)
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}
                    >
                    <img style={imgStyle} src={thumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
    
        return <ul className="char__grid">{elements}</ul>
    }
    
        
        const elements = CreateCharListItems(charList)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? elements : null


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset, limit)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    
}



export default CharList;