import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  itemRefs = [];

  componentDidMount() {
    this.onRequest();
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onRequest = (offset) => {
    this.onCharactersLoading();
    this.marvelService.getAllCharacters(offset).then(this.onCharactersLoaded).catch(this.onError);
  };

  onScroll = (event) => {
    const { offset, newItemsLoading } = this.state;
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && !newItemsLoading) {
      this.onRequest(offset);
    }
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

  setItemRef = (ref) => {
    this.itemRefs.push(ref);
  };

  onFocusItem = (id) => {
    this.itemRefs.forEach((item) => item.classList.remove('char__item_selected'));
    this.itemRefs[id].classList.add('char__item_selected');
  };

  renderItems = () => {
    const { charList, newItemsLoading, offset, isEnd } = this.state;
    const { onCharSelected } = this.props;

    return (
      <>
        <ul className='char__grid'>
          {charList.map((item, i) => {
            const pathArr = item.thumbnail.split('/');
            const imgStyle =
              pathArr[pathArr.length - 1] === 'image_not_available.jpg'
                ? { objectFit: 'fill' }
                : null;

            return (
              <li
                ref={this.setItemRef}
                tabIndex={0}
                className='char__item'
                key={item.id}
                onClick={() => {
                  onCharSelected(item.id);
                  this.onFocusItem(i);
                }}
                onKeyPress={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    onCharSelected(item.id);
                    this.onFocusItem(i);
                  }
                }}
              >
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
    const content = !(loading || errorMessage) ? this.renderItems() : null;

    return (
      <div className='char__list'>
        {spinner}
        {error}
        {content}
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
