import { Component } from 'react';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService.getAllCharacters().then(this.onCharactersLoaded);
  }

  onCharactersLoaded = (charList) => {
    this.setState({ charList, loading: false, error: false });
  };

  onError = () => {
    this.state({ loading: false, error: true });
  };

  render() {
    const { charList, loading, error } = this.state;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || errorMessage) ? (
      <View charList={charList} onCharSelected={this.props.onCharSelected} />
    ) : null;

    return (
      <div className='char__list'>
        {spinner}
        {error}
        {content}
      </div>
    );
  }
}

const View = ({ charList, onCharSelected }) => {
  return (
    <>
      <ul className='char__grid'>
        {charList.map((item) => {
          const pathArr = item.thumbnail.split('/');
          const imgStyle =
            pathArr[pathArr.length - 1] === 'image_not_available.jpg'
              ? { objectFit: 'fill' }
              : null;

          return (
            <li className='char__item' key={item.id} onClick={() => onCharSelected(item.id)}>
              <img style={imgStyle} src={item.thumbnail} alt={item.name} />
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
