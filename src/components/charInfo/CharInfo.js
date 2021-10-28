import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { getCharacter, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line
  }, [props.charId]);

  const onCharLoaded = (char) => setChar(char);

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }

    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  };

  return <div className='char__info'>{setContent(process, View, char)}</div>;
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;
  const pathArr = thumbnail.split('/');
  const imgStyle =
    pathArr[pathArr.length - 1] === 'image_not_available.jpg' ? { objectFit: 'fill' } : null;

  const buildComicsList = (comics) => {
    return (
      <ul className='char__comics-list'>
        {comics.map((item, i) => {
          return (
            <li className='char__comics-item' key={i}>
              {item.name}
            </li>
          );
        })}
      </ul>
    );
  };

  const noComicsText = !comics.length ? 'There are no comics with this character.' : null;
  const transformedComics = comics.slice(0, 10);

  return (
    <>
      <div className='char__basics'>
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a href={homepage} className='button button__main' target='_blank' rel='noreferrer'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary' target='_blank' rel='noreferrer'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>{description}</div>
      <div className='char__comics'>Comics:</div>
      {noComicsText}
      {buildComicsList(transformedComics)}
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
