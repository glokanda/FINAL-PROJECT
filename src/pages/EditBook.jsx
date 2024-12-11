import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBook = () => {
  const [bookDetails, setBookDetails] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:8080/books/${id}`)
      .then((response) => {
        const bookData = new Map([
          ['title', response.data.title],
          ['author', response.data.author],
          ['publishYear', response.data.publishYear],
        ]);
        setBookDetails(bookData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Unable to fetch book details. Please try again later.', { variant: 'error' });
        console.error(error);
      });
  }, [id]);

  const handleEditBook = () => {
    if (!bookDetails.get('title') || !bookDetails.get('author') || !bookDetails.get('publishYear')) {
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }

    const bookData = {
      title: bookDetails.get('title'),
      author: bookDetails.get('author'),
      publishYear: bookDetails.get('publishYear'),
    };

    setLoading(true);
    axios
      .put(`http://localhost:8080/books/${id}`, bookData)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Edited successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error while editing the book. Please try again.', { variant: 'error' });
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevState) => {
      const updatedMap = new Map(prevState);
      updatedMap.set(name, value);
      return updatedMap;
    });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Edit Book</h1>
      {loading && <Spinner />}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            name="title"
            value={bookDetails.get('title') || ''}
            onChange={handleInputChange}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            placeholder="Enter book title"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Author</label>
          <input
            type="text"
            name="author"
            value={bookDetails.get('author') || ''}
            onChange={handleInputChange}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            placeholder="Enter author's name"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Publish Year</label>
          <input
            type="number"
            name="publishYear"
            value={bookDetails.get('publishYear') || ''}
            onChange={handleInputChange}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            placeholder="Enter publish year"
          />
        </div>
        <button 
          className="p-2 bg-sky-300 m-8"
          onClick={handleEditBook}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBook;
