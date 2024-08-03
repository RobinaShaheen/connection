'use client';

import { useState, useEffect } from 'react';

type Book = {
  id: number;
  name: string;
  price: number;
};

const addBook = async (book: Book) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to add book');
  }

  return response.json();
};

const updateBook = async (book: Book) => {
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to update book');
  }

  return response.json();
};

const deleteBook = async (id: number) => {
  const response = await fetch('/api/users', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }

  return response.json();
};

export default function book() {
  const [books, setBooks] = useState<Book[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [editid, setEditid] = useState<number | null>(null);

  const fetchData = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setBooks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editid) {
        await updateBook({ id: editid, name, price: parseFloat(price) });
      } else {
        await addBook({ id: parseInt(id), name, price: parseFloat(price) });
      }
      setName('');
      setPrice('');
      setId('');
      setEditid(null); // Reset editid
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error('Error adding/updating book:', error);
    }
  };

  const handleEdit = (book: Book) => {
    setName(book.name);
    setPrice(book.price.toString());
    setEditid(book.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <main id="body" className="flex min-h-screen flex-col items-center p-20 overflow-x-hidden overflow-y-auto">
      <h1 className='text-2xl font-light'>Hello Vercel Database</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="id">
            ID
          </label>
          <input
            id="id"
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={!!editid} // Disable ID input when editing
          />
          <label className="block  text-gray-500 text-xl font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block  text-gray-500 text-xl font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editid ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap desktop:flex-row laptop:flex-row tablet:flex-row tablet:justify-between mobile:flex-row watch:flex-row">
        {books.map((book, index) => (
          <div key={index} className="mb-4 p-4 border-2 border-black bg-white rounded-md desktop:w-[400px] desktop:h-auto laptop:w-[400px] laptop:h-auto laptop:ml-5 tablet:w-[300px] tablet:h-auto mobile:w-full mobile:h-auto watch:w-full watch h-auto">
            <h3 className="text-lx text-black font-bold">{book.id}</h3>
            <h2 className="text-lg  text-black font-bold">{book.name}</h2>
            <p className="text-gray-700">Price: ${book.price}</p>
            <button
              onClick={() => handleEdit(book)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
