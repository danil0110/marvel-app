import { Component } from 'react';

import './charInfo.scss';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false, error: false });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }

    this.onCharLoading();
    this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
  };

  render() {
    const { char, loading, error } = this.state;

    const skeleton = loading || error || char ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className='char__info'>
        {skeleton}
        {spinner}
        {errorMessage}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const pathArr = char.thumbnail.split('/');
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
            <a href={homepage} className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary'>
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

export default CharInfo;
