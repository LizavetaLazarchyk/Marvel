import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./comicsList.scss";
import Spinner from "../spinner/Spinner";
import useMarvelService from "../../services/MarvelService.js";
import ErrorMessage from "../errorMessage/ErrorMessage";

const ComicsList = () => {
    const [comicsArr, setComicsArr] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() =>{
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset).then(onLoaded);
    }

    const onLoaded = (newComicsArr) => {
        let ended = false;
        if(newComicsArr.length < 8){
            ended = true;
        }
        setComicsArr( comicsArr => [...comicsArr, ...newComicsArr]);
        setNewComicsLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }


    function createComicsList(arr) {
        const items = arr.map((item) => {
            
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img
                            src={item.thumbnail}
                            alt={item.description}
                            className="comics__item-img"
                        />
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });

        return (
                <ul className="comics__grid">
                    {items}
                </ul>
        );
    }

    const items = createComicsList(comicsArr);

    const renderingError = error ? <ErrorMessage/> : null;
    const renderingLoading = loading && !newComicsLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {renderingError}
            {renderingLoading}
            {items}
            <button className="button button__main button__long"
            disabled={newComicsLoading}
            onClick={() => onRequest(offset)}
            style={{'display': comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

export default ComicsList;
