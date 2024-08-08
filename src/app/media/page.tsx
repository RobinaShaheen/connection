'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

type Product = {
  id: number;
  file: string;
  description: string;
};

const addMedia = async (product: Product) => {
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    alert('Failed to add product');
  }
  else{
    alert("Product add successfully!!");
  }
  return response.json();
};

const updateMedia = async (product: Product) => {
  const response = await fetch('/api/media', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    alert('Failed to update product');
  }
  else{
    alert("Product update successfully!!");
  }
  return response.json();
};

const deleteMedia = async (id: number) => {
  const response = await fetch('/api/media', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    alert('Failed to delete product');
  }
  else{
    alert("Delete Product successfully!!");
  }
  return response.json();
};

export default function ImageCrud() {
  const [product, setProduct] = useState<Product[]>([]);
  const [file, setFile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [editid, setEditid] = useState<number | null>(null);

  const fetchData = async () => {
    const response = await fetch('/api/media');
    const data = await response.json();
    setProduct(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error('File must not be null');
      return;
    }

    try {
      if (editid) {
        await updateMedia({ id: editid, file, description });
      } else {
        await addMedia({ id: parseInt(id), file, description });
      }
      setFile('');
      setDescription('');
      setId('');
      setEditid(null); // Reset editId
      fetchData(); // Refresh the product list
    } 
    catch (error) {
      alert('Error adding/updating product:');
    }
  };

  const handleEdit = (product: Product) => {
    setFile(product.file);
    setDescription(product.description);
    setEditid(product.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedia(id);
      fetchData(); // Refresh the book list
    } 
    catch (error) {
      alert('Error deleting product:');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
          <label className="block  text-gray-500 text-xl font-bold mb-2" htmlFor="file">
            File
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block  text-gray-500 text-xl font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editid ? 'Update Media' : 'Add Media'}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap">
        {product.map((_product, index) => (
          <div key={index} className="mb-4 p-4 border-2 border-black bg-white rounded-md w-[300px] h-auto">
            <h3 className="text-lx text-black font-bold">{_product.id}</h3>
            {_product.file && (
              <img width={200} height={200} src={_product.file} alt={_product.description} />
            )}
            <p className="text-gray-700">{_product.description}</p>
            <button
              onClick={() => handleEdit(_product)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(_product.id)}
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
