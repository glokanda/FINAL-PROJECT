import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import BinarySearchTree from '../utils/BinarySearchTree';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [bst, setBst] = useState(new BinarySearchTree());  // Initial state is a new BST instance
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/books/${id}`)
      .then((response) => {
        const fetchedBook = response.data;
        setBook(fetchedBook);

        // Create a new BST instance and insert the new book's ID into the tree
        setBst((prevBst) => {
          const newBst = new BinarySearchTree();
          // Copy all previous items from the old BST (if any)
          prevBst.inorderTraversal().forEach((item) => newBst.insert(item));
          newBst.insert(fetchedBook._id); // Insert the new book ID
          return newBst;
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);  // `id` dependency ensures the effect runs when the `id` changes

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{book._id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Title</span>
            <span>{book.title}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Author</span>
            <span>{book.author}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Publish Year</span>
            <span>{book.publishYear}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Create Time</span>
            <span>{new Date(book.createdAt).toString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{new Date(book.updatedAt).toString()}</span>
          </div>
        </div>
      )}

      {/* Binary Search Tree Traversal (Displaying Book IDs) */}
      <div>
        <h2 className='text-2xl mt-4'>BST Traversal (Book IDs)</h2>
        <ul>
          {bst.inorderTraversal().map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowBook;
