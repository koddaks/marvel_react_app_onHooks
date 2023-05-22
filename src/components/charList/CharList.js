import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './charList.scss';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const CharList = (props) =>  {

    const [charList, setCharList] = useState([])   
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)    
    const [charEnded, setCharEnded] = useState(false)
    const limit = 9;

    

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, limit, true)
    }, [])

    const onRequest = (offset, limit, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)        
        getAllCharacters(offset, limit)
        .then(onCharListLoaded)        
    }
    
    

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;            
        }        
        setCharList(charList => [...charList, ...newCharList])       
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + limit)
        setCharEnded(charEnded => ended)
    }

    // console.log('charList!')


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
                <CSSTransition key={id} timeout={500} classNames='char__item'>
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
                </CSSTransition>
            )
        })
    
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
    }
    
        
        const elements = CreateCharListItems(charList)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;
        


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {elements}
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