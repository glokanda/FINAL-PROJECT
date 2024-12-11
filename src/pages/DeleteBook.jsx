import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Queue implementation
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }
}

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [taskQueue] = useState(new Queue()); // Initialize the queue
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteBook = () => {
    taskQueue.enqueue(id); // Add the delete task to the queue
    processQueue();
  };

  const processQueue = () => {
    if (loading || taskQueue.isEmpty()) return; // Avoid processing if already loading or queue is empty

    setLoading(true);
    const bookId = taskQueue.dequeue();

    axios
      .delete(`http://localhost:8080/books/${bookId}`)
      .then(() => {
        enqueueSnackbar('Book Deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        enqueueSnackbar('Error occurred while deleting the book', { variant: 'error' });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        if (!taskQueue.isEmpty()) {
          processQueue(); // Process the next task in the queue
        }
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are You Sure You want to delete this book?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
          disabled={loading} // Disable button during loading
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
