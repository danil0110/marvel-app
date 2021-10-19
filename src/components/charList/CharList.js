import { Component } from 'react';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService.getAllCharacters().then(this.onCharactersLoaded);
  }

  onCharactersLoaded = (charList) => {
    this.setState({ charList, loading: false });
  };

  render() {
    const { charList, loading } = this.state;
    const content = loading ? <Spinner /> : <View charList={charList} />;

    return <div className='char__list'>{content}</div>;
  }
}

const View = ({ charList }) => {
  return (
    <>
      <ul className='char__grid'>
        {charList.map((item) => {
          const pathArr = item.thumbnail.split('/');
          const style =
            pathArr[pathArr.length - 1] === 'image_not_available.jpg'
              ? { objectFit: 'fill' }
              : null;

          return (
            <li className='char__item' key={item.id}>
              <img style={style} src={item.thumbnail} alt={item.name} />
              <div className='char__name'>{item.name}</div>
            </li>
          );
        })}
      </ul>
      <button className='button button__main button__long'>
        <div className='inner'>load more</div>
      </button>
    </>
  );
};

export default CharList;
