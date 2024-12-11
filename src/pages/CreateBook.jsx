import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length === 0) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1] || null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookHistory, setBookHistory] = useState(new Stack()); // Use state to track stack changes
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = () => {
    const data = {
      title,
      author,
      publishYear,
    };

    // Save the current book data onto the stack by updating state
    setBookHistory((prevHistory) => {
      const newHistory = new Stack();
      // Copy the previous stack items into the new stack
      newHistory.items = [...prevHistory.items];
      newHistory.push(data);
      return newHistory;
    });

    setLoading(true);
    axios
      .post('http://localhost:8080/books', data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Created successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  const handleUndo = () => {
    // Pop the last entry from the stack and set the form state back to that book data
    const lastBook = bookHistory.pop();
    if (lastBook) {
      setTitle(lastBook.title);
      setAuthor(lastBook.author);
      setPublishYear(lastBook.publishYear);
      enqueueSnackbar('Reverted to the last book entry', { variant: 'info' });
    } else {
      enqueueSnackbar('No previous entry to revert to', { variant: 'warning' });
    }
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='number'
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <button
          className='p-2 bg-sky-300 m-8'
          onClick={handleSaveBook}
          disabled={loading}
        >
          Save
        </button>
        {/* Undo Button */}
        <button
          className='p-2 bg-sky-300 m-8'
          onClick={handleUndo}
          disabled={bookHistory.isEmpty()}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;
