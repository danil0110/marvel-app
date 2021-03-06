import { useState, useEffect, useRef, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

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

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [offset, setOffset] = useState(210);
  const [isEnd, setIsEnd] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    if (newItemsLoading && !isEnd) {
      onRequest();
    }
    // eslint-disable-next-line
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
    getAllCharacters(offset)
      .then(onCharactersLoaded)
      .then(() => setProcess('confirmed'))
      .finally(() => setNewItemsLoading(false));
  };

  const onCharactersLoaded = (newCharList) => {
    setInitialLoading(false);
    setCharList((charList) => [...charList, ...newCharList]);
    setOffset((offset) => offset + 9);
    setIsEnd(newCharList.length < 9 ? true : false);
  };

  const itemRefs = useRef([]);

  const onFocusItem = (id) => {
    itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
  };

  const renderItems = () => {
    const { onCharSelected } = props;

    return (
      <>
        <ul className='char__grid'>
          <TransitionGroup component={null}>
            {charList.map((item, i) => {
              let pathArr, imgStyle;
              if (item.thumbnail) {
                pathArr = item.thumbnail.split('/');
                imgStyle =
                  pathArr[pathArr.length - 1] === 'image_not_available.jpg'
                    ? { objectFit: 'fill' }
                    : null;
              }

              return (
                <CSSTransition timeout={300} classNames='char__item' mountOnEnter unmountOnExit>
                  <li
                    ref={(el) => (itemRefs.current[i] = el)}
                    tabIndex={0}
                    className='char__item'
                    // key={i} because MarvelAPI sometimes gives items with the same ID
                    key={i}
                    onClick={() => {
                      onCharSelected(item.id);
                      onFocusItem(i);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        onCharSelected(item.id);
                        onFocusItem(i);
                      }
                    }}
                  >
                    <img style={imgStyle} src={item.thumbnail} alt={item.name} />
                    <div className='char__name'>{item.name}</div>
                  </li>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </ul>
      </>
    );
  };

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(), newItemsLoading);
    // eslint-disable-next-line
  }, [process]);

  return (
    <div className='char__list'>
      {elements}
      {!charList.length ? null : (
        <button
          className='button button__main button__long'
          disabled={newItemsLoading}
          onClick={() => setNewItemsLoading(true)}
          style={{ display: isEnd ? 'none' : 'block' }}
        >
          <div className='inner'>load more</div>
        </button>
      )}
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
