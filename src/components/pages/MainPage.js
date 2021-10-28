import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import { useState } from 'react';

import decoration from '../../resources/img/vision.png';
import SearchChar from '../searchChar/SearchChar';

const MainPage = () => {
  const [selectedChar, setChar] = useState(null);

  const onCharSelected = (id) => setChar(id);

  return (
    <>
      <ErrorBoundary>
        <RandomChar />
      </ErrorBoundary>
      <div className='char__content'>
        <ErrorBoundary>
          <CharList onCharSelected={onCharSelected} />
        </ErrorBoundary>
        <ErrorBoundary>
          <aside style={{ position: 'sticky', top: '25px' }}>
            <CharInfo charId={selectedChar} />
            <SearchChar />
          </aside>
        </ErrorBoundary>
      </div>
      <img className='bg-decoration' src={decoration} alt='vision' />
    </>
  );
};

export default MainPage;
