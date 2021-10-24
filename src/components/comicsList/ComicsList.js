import { useEffect, useState } from 'react';

import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import useMarvelService from '../../services/MarvelService';

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [offset, setOffset] = useState(500);
  const [isEnd, setIsEnd] = useState(false);

  const { error, getAllComics } = useMarvelService();

  useEffect(() => {
    if (newItemsLoading && !isEnd) {
      onRequest();
    }
  }, [newItemsLoading]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });

  const onScroll = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      setNewItemsLoading(true);
    }
  };

  const onRequest = () => {
    initialLoading ? setNewItemsLoading(false) : setNewItemsLoading(true);
    getAllComics(offset)
      .then(onComicsLoaded)
      .finally(() => setNewItemsLoading(false));
  };

  const onComicsLoaded = (newComicsList) => {
    console.log(newComicsList);
    setInitialLoading(false);
    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setOffset((offset) => offset + 8);
    setIsEnd(newComicsList.length < 8 ? true : false);
  };

  const renderItems = () => {
    return (
      <ul className='comics__grid'>
        {comicsList.map((item) => {
          const { id, title, price, thumbnail, url } = item;
          return (
            <li className='comics__item' key={id}>
              <a href={url}>
                <img src={thumbnail} alt={title} className='comics__item-img' />
                <div className='comics__item-name'>{title}</div>
                <div className='comics__item-price'>{price}</div>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const spinner = initialLoading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const items = renderItems();
  console.log('State list: ', comicsList);

  return (
    <div className='comics__list'>
      {spinner}
      {errorMessage}
      {items}
      {!comicsList.length ? null : (
        <button
          className='button button__main button__long'
          onClick={() => setNewItemsLoading(true)}
          disabled={newItemsLoading}
        >
          <div className='inner'>load more</div>
        </button>
      )}
    </div>
  );
};

export default ComicsList;
