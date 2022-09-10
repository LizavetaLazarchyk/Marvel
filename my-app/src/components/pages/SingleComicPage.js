import "./singleComicPage.scss";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SingleComicPage = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const { loading, error, getComics, clearError } = useMarvelService();

  useEffect(() => {
    updateComics();
  }, [comicId]);

  const updateComics = () => {
    if (!comicId) {
      return;
    }
    clearError();
    getComics(comicId).then(onComicsLoaded);
  };

  const onComicsLoaded = (comic) => {
    setComic(comic);
  };

  const View = ({ comic }) => {
    const { title, description, pageCount, thumbnail, language, price } = comic;

    return (
      <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">{description}</p>
          <p className="single-comic__descr">{pageCount}</p>
          <p className="single-comic__descr">Language: {language}</p>
          <div className="single-comic__price">{price}</div>
        </div>
        <Link to="/comics" className="single-comic__back">
          Back to all
        </Link>
      </div>
    );
  };

  const renderingError = error ? <ErrorMessage /> : null;
  const renderingLoading = loading ? <Spinner /> : null;
  const renderingContent = !(error || loading || !comic) ? (
    <View comic={comic} />
  ) : null;

  return (
    <>
      {renderingError}
      {renderingLoading}
      {renderingContent}
    </>
  );
};

export default SingleComicPage;
