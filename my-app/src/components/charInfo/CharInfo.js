import { useState, useEffect } from "react";
import propTypes from "prop-types";
import useMarvelService from "../../services/MarvelService";
import "./charInfo.scss";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import { Link } from "react-router-dom";

const CharInfo = ({ charId }) => {
  const [char, setChar] = useState(null);
  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    if (!charId) {
      return;
    }
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const renderingError = error ? <ErrorMessage /> : null;
  const renderingLoading = loading ? <Spinner /> : null;
  const renderingContent = !(error || loading || !char) ? (
    <View char={char} />
  ) : null;

  return (
    <div className="char__info">
      {skeleton}
      {renderingError}
      {renderingLoading}
      {renderingContent}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  let imgClassName = "char__basics";
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgClassName = "char__basics char__basics__default";
  }

  return (
    <>
      <div className={imgClassName}>
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics with this character"}
        {comics.map((item, i) => {
          if (i > 9) {
            return null;
          }
          const comicId = item.resourceURI.split("/").pop();
          return (
            <Link to={`/comics/${comicId}`}>
              <li className="char__comics-item" key={i}>
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: propTypes.number.isRequired,
};

export default CharInfo;
