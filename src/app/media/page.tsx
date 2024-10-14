'use client';

import { useState, useEffect } from 'react';
import DownloadPDF from '../component/downloadPdf';

type Product = {
  date: Date;
  Party: string;
  Quality: string;
  Finishing: string;
  outDate: Date;
  Grayin: number;
  Grayout: number;
  bill: string;
};

const addProduct = async (product: Product) => {
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    alert('Failed to add product');
  } else {
    alert('Product added successfully!');
  }
  return response.json();
};

const updateProduct = async (product: Product) => {
  const response = await fetch('/api/media', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    alert('Failed to update product');
  } else {
    alert('Product updated successfully!');
  }
  return response.json();
};

const deleteProduct = async (date: Date) => {
  const response = await fetch('/api/media', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
  });

  if (!response.ok) {
    alert('Failed to delete product');
  } else {
    alert('Product deleted successfully!');
  }
  return response.json();
};

export default function ProductStock() {
  const [product, setProduct] = useState<Product[]>([]);
  const [date, setDate] = useState<string>('');
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [Party, setParty] = useState<string>('');
  const [Quality, setQuality] = useState<string>('');
  const [Finishing, setFinishing] = useState<string>('');
  const [outDate, setOutDate] = useState<string>('');
  const [Grayin, setGrayin] = useState<string>('');
  const [Grayout, setGrayout] = useState<string>('');
  const [bill, setBill] = useState<string>('');

  const fetchData = async () => {
    const response = await fetch('/api/media');
    const data = await response.json();
    setProduct(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData: Product = {
        date: editDate || new Date(date),
        Party,
        Quality,
        Finishing,
        outDate: new Date(outDate),
        Grayin: parseInt(Grayin),
        Grayout: parseInt(Grayout),
        bill,
      };

      if (editDate) {
        await updateProduct(productData);
      } else {
        await addProduct(productData);
      }

      // Clear form after submission
      setParty('');
      setQuality('');
      setFinishing('');
      setOutDate('');
      setGrayin('');
      setGrayout('');
      setBill('');
      setDate('');
      setEditDate(null);
      fetchData(); // Refresh product list
    } catch (error) {
      alert('Error adding/updating product');
    }
  };

  const handleEdit = (product: Product) => {
    setParty(product.Party);
    setQuality(product.Quality);
    setFinishing(product.Finishing);
    if (product.outDate) {
      setOutDate(new Date(product.outDate).toISOString().split('T')[0]); // Set date as YYYY-MM-DD
    } else {
      setOutDate(''); // Fallback to an empty string if outDate is not defined
    }
    // setOutDate(product.outDate.toISOString().split('T')[0]); // Set date as YYYY-MM-DD
    if (product.Grayin !== undefined && product.Grayin !== null) {
      setGrayin(product.Grayin.toString());
    } else {
      setGrayin(''); // Fallback to an empty string if Grayin is not defined
    }
  
    // Safely handle Grayout
    if (product.Grayout !== undefined && product.Grayout !== null) {
      setGrayout(product.Grayout.toString());
    } else {
      setGrayout(''); // Fallback to an empty string if Grayout is not defined
    }
    setBill(product.bill);
    setEditDate(product.date);
  };

  const handleDelete = async (date: Date) => {
    try {
      await deleteProduct(date);
      fetchData(); // Refresh product list
    } catch (error) {
      alert('Error deleting product');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-20 overflow-x-hidden overflow-y-auto">
      <h1 className="text-2xl font-light">Hello Vercel Database</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="Date">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={!!editDate} // Disable Date input when editing
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="party">
            Party
          </label>
          <input
            type="text"
            value={Party}
            onChange={(e) => setParty(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="quality">
            Quality
          </label>
          <input
            type="text"
            value={Quality}
            onChange={(e) => setQuality(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="finishing">
            Finishing
          </label>
          <input
            type="text"
            value={Finishing}
            onChange={(e) => setFinishing(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="outDate">
            Out Date
          </label>
          <input
            type="date"
            value={outDate}
            onChange={(e) => setOutDate(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="grayin">
            Grayin
          </label>
          <input
            type="number"
            value={Grayin}
            onChange={(e) => setGrayin(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="grayout">
            Grayout
          </label>
          <input
            type="number"
            value={Grayout}
            onChange={(e) => setGrayout(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="bill">
            Bill
          </label>
          <input
            type="text"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editDate ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
        py-2 px-24 rounded focus:outline-none focus:shadow-outline mt-10" onClick={DownloadPDF}>
        Fetch data
      </button>
    </main>
  );
}
