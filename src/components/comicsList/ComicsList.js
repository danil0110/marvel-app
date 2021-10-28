import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case 'waiting':
      return <Spinner />;
    case 'loading':
      return newItemLoading ? <Component /> : <Spinner />;
    case 'confirmed':
      return <Component />;
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [offset, setOffset] = useState(100);
  const [isEnd, setIsEnd] = useState(false);

  const { getAllComics, process, setProcess } = useMarvelService();

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
      .then(() => setProcess('confirmed'))
      .finally(() => setNewItemsLoading(false));
  };

  const onComicsLoaded = (newComicsList) => {
    setInitialLoading(false);
    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setOffset((offset) => offset + 8);
    setIsEnd(newComicsList.length < 8 ? true : false);
  };

  const renderItems = () => {
    return (
      <ul className='comics__grid'>
        {comicsList.map((item, i) => {
          const { id, title, price, thumbnail } = item;
          return (
            // key={i} because MarvelAPI sometimes gives items with the same ID
            <li className='comics__item' key={i}>
              <Link to={`/comics/${id}`}>
                <img src={thumbnail} alt={title} className='comics__item-img' />
                <div className='comics__item-name'>{title}</div>
                <div className='comics__item-price'>{price}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='comics__list'>
      {setContent(process, () => renderItems(), newItemsLoading)}
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
