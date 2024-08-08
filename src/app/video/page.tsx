'use client';

import { useState, useEffect } from 'react';

type Video = {
  id: number;
  file: string;
  description: string;
};

const addVideo = async (video: Video) => {
  const response = await fetch('/api/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(video),
  });

  if (!response.ok) {
    alert('Failed to add video');
  }
  else{
    alert("Video add successfully!!!");
  }
  return response.json();
};

const updateVideo = async (video: Video) => {
  const response = await fetch('/api/video', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(video),
  });

  if (!response.ok) {
    alert('Failed to update video');
  }
  else{
    alert("Video update successfully!!");
  }
  return response.json();
};

const deleteVideo = async (id: number) => {
  const response = await fetch('/api/video', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    alert('Failed to delete video');
  }
  else{
    alert("Video delete successfully!!");
  }
  return response.json();
};

export default function VideoCrud() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = async () => {
    const response = await fetch('/api/video');
    const data = await response.json();
    setVideos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error('File must not be null');
      return;
    }

    try {
      if (editId) {
        await updateVideo({ id: editId, file, description });
      } else {
        await addVideo({ id: parseInt(id), file, description });
      }
      setFile('');
      setDescription('');
      setId('');
      setEditId(null); // Reset editId
      fetchData(); // Refresh the video list
    } 
    catch (error) {
      alert('Error adding/updating video:');
    }
  };

  const handleEdit = (video: Video) => {
    setFile(video.file);
    setDescription(video.description);
    setEditId(video.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVideo(id);
      fetchData(); // Refresh the video list
    } 
    catch (error) {
      alert('Error deleting video:');
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
    <main className="flex min-h-screen flex-col items-center p-20">
      <h1 className="text-2xl font-light">Hello Vercel Database</h1>
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
            disabled={!!editId} // Disable ID input when editing
          />
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="file">
            File
          </label>
          <input
            id="file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-xl font-bold mb-2" htmlFor="description">
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
            {editId ? 'Update Video' : 'Add Video'}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap">
        {videos.map((video, index) => (
          <div key={index} className="mb-4 p-4 border-2 border-black bg-white rounded-md w-[300px] h-auto">
            <h3 className="text-lx text-black font-bold">{video.id}</h3>
            {video.file && (
              <video width={200} height={200} controls>
                <source src={video.file} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <p className="text-gray-700">{video.description}</p>
            <button
              onClick={() => handleEdit(video)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(video.id)}
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
