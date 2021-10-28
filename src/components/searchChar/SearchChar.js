import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import './searchChar.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

const SearchChar = () => {
  const [char, setChar] = useState();
  const [isInitial, setIsInitial] = useState(true);
  const { loading, error, getCharacterByName, clearError } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
    setIsInitial(false);
    console.log(char);
  };

  const searchChar = async (name) => {
    clearError();
    setChar(null);
    const res = await getCharacterByName(name);
    onCharLoaded(res);
  };

  const spinner = loading ? (
    <div className='wide'>
      <Spinner />
    </div>
  ) : null;

  return (
    <Formik
      initialValues={{
        name: '',
      }}
      validationSchema={yup.object({
        name: yup.string().required('This field is required!'),
      })}
      onSubmit={({ name }) => searchChar(name)}
    >
      <Form className='char-search'>
        <div className='form-caption'>Or find a character by name:</div>
        <div className='grid-wrapper'>
          <Field name='name' placeholder='Enter name' />
          <button type='submit' className='button button__main' disabled={loading}>
            <div className='inner'>find</div>
          </button>
          {spinner}
          {loading || isInitial ? null : !char ? (
            <div className='error wide'>
              The character was not found. Check the name and try again.
            </div>
          ) : (
            <>
              <div className='success'>There is! Visit {char.name} page?</div>
              <Link className='button button__secondary' to={`/characters/${char.id}`}>
                <div className='inner'>Visit</div>
              </Link>
            </>
          )}
          <ErrorMessage name='name' className='message error wide' component='div' />
        </div>
      </Form>
    </Formik>
  );
};

export default SearchChar;
