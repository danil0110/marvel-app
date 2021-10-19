import { Component } from 'react';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    newItemsLoading: false,
    error: false,
    offset: 210,
    isEnd: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharactersLoading();
    this.marvelService.getAllCharacters(offset).then(this.onCharactersLoaded).catch(this.onError);
  };

  onCharactersLoading = () => {
    this.setState({ newItemsLoading: true });
  };

  onCharactersLoaded = (newCharList) => {
    this.setState(({ charList, offset }) => {
      return {
        charList: [...charList, ...newCharList],
        loading: false,
        newItemsLoading: false,
        error: false,
        offset: offset + 9,
        isEnd: newCharList.length < 9 ? true : false,
      };
    });
  };

  onError = () => {
    this.state({ loading: false, error: true });
  };

  renderItems = () => {
    const { charList, newItemsLoading, offset, isEnd } = this.state;
    const { onCharSelected } = this.props;

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
        <button
          className='button button__main button__long'
          disabled={newItemsLoading}
          onClick={() => this.onRequest(offset)}
          style={{ display: isEnd ? 'none' : 'block' }}
        >
          <div className='inner'>load more</div>
        </button>
      </>
    );
  };

  render() {
    const { loading, error } = this.state;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || errorMessage)
      ? // <View charList={charList} onCharSelected={this.props.onCharSelected} />
        this.renderItems()
      : null;

    return (
      <div className='char__list'>
        {spinner}
        {error}
        {content}
      </div>
    );
  }
}

// const View = ({ charList, onCharSelected }) => {
//   return (
//     <>
//       <ul className='char__grid'>
//         {charList.map((item) => {
//           const pathArr = item.thumbnail.split('/');
//           const imgStyle =
//             pathArr[pathArr.length - 1] === 'image_not_available.jpg'
//               ? { objectFit: 'fill' }
//               : null;

//           return (
//             <li className='char__item' key={item.id} onClick={() => onCharSelected(item.id)}>
//               <img style={imgStyle} src={item.thumbnail} alt={item.name} />
//               <div className='char__name'>{item.name}</div>
//             </li>
//           );
//         })}
//       </ul>
//       <button
//         className='button button__main button__long'
//         disabled={newItemsLoading}
//         onClick={() => this.onRequest(offset)}
//       >
//         <div className='inner'>load more</div>
//       </button>
//     </>
//   );
// };

export default CharList;
