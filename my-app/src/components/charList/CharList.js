import { useState, useEffect, useRef } from "react";
import propTypes from "prop-types";
import "./charList.scss";
import Spinner from "../spinner/Spinner";
import useMarvelService from "../../services/MarvelService.js";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharList = (props) => {
  const [itemsArr, setItemsArr] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset).then(onLoaded);
  };

  const onLoaded = (newItemsArr) => {
    let ended = false;
    if (newItemsArr.length < 9) {
      ended = true;
    }
    setItemsArr((itemsArr) => [...itemsArr, ...newItemsArr]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (index) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[index].classList.add("char__item_selected");
  };

  function createCharList(arr) {
    const items = arr.map((item, index) => {
      let charItemClassName = "char__item";
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        charItemClassName = "char__item char__item__default";
      }

      return (
        <li
          ref={(el) => (itemRefs.current[index] = el)}
          tabIndex={0}
          className={charItemClassName}
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(index);
          }}
        >
          <img src={item.thumbnail} alt={item.name} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  const items = createCharList(itemsArr);

  const renderingError = error ? <ErrorMessage /> : null;
  const renderingLoading = loading && !newItemLoading ? <Spinner /> : null;
  return (
    <div className="char__list">
      {renderingError}
      {renderingLoading}
      {items}
      <button
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{ display: charEnded ? "none" : "block" }}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: propTypes.func.isRequired,
};

export default CharList;
