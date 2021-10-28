import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './searchChar.scss';

const setContent = (process, Component, data) => {
  switch (process) {
    case 'waiting':
      return null;
    case 'loading':
      return (
        <div className='wide'>
          <Spinner />
        </div>
      );
    case 'confirmed':
      return data ? (
        <Component data={data} />
      ) : (
        <div className='error wide'>The character was not found. Check the name and try again.</div>
      );
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};

const SearchChar = () => {
  const [char, setChar] = useState();
  const { loading, getCharacterByName, clearError, process, setProcess } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
    setProcess('confirmed');
  };

  const searchChar = async (name) => {
    clearError();
    setChar(null);
    const res = await getCharacterByName(name);
    onCharLoaded(res);
  };

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
          {setContent(
            process,
            () => (
              <>
                <div className='success'>There is! Visit {char.name} page?</div>
                <Link className='button button__secondary' to={`/characters/${char.id}`}>
                  <div className='inner'>Visit</div>
                </Link>
              </>
            ),
            char
          )}
          <ErrorMessage name='name' className='message error wide' component='div' />
        </div>
      </Form>
    </Formik>
  );
};

export default SearchChar;
