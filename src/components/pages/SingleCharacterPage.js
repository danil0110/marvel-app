import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './singleCharacterPage.scss';

const SingleComicPage = () => {
  const { charId } = useParams();
  const [char, setChar] = useState(null);
  const { getCharacter, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line
  }, [charId]);

  const onCharLoaded = (char) => setChar(char);

  const updateChar = () => {
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  };

  return (
    <>
      <AppBanner />
      <div style={{ marginTop: '50px' }}>{setContent(process, View, char)}</div>
    </>
  );
};

const View = ({ data }) => {
  const { name, description, thumbnail } = data;

  return (
    <>
      <Helmet>
        <meta name='description' content={`${name} character details`} />
        <title>{name}</title>
      </Helmet>
      <div className='single-char'>
        <img src={thumbnail} alt={name} className='single-char__img' />
        <div className='single-char__info'>
          <h2 className='single-char__name'>{name}</h2>
          <p className='single-char__descr'>{description}</p>
        </div>
        <Link to='/' className='single-char__back'>
          Back to the main page
        </Link>
      </div>
    </>
  );
};

export default SingleComicPage;
