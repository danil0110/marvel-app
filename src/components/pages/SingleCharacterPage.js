import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import useMarvelService from '../../services/MarvelService';
import './singleComicPage.scss';
import AppBanner from '../appBanner/AppBanner';

const SingleComicPage = () => {
  const { charId } = useParams();
  const [char, setChar] = useState(null);
  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const onCharLoaded = (char) => setChar(char);

  const updateChar = () => {
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail } = char;

  return (
    <>
      <AppBanner />
      <div className='single-comic'>
        <img src={thumbnail} alt={name} className='single-comic__img' />
        <div className='single-comic__info'>
          <h2 className='single-comic__name'>{name}</h2>
          <p className='single-comic__descr'>{description}</p>
        </div>
        <Link to='/' className='single-comic__back'>
          Back to the main page
        </Link>
      </div>
    </>
  );
};

export default SingleComicPage;
