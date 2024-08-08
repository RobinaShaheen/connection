'use client';

import { useState, useEffect } from 'react';
import ImageCrud from './media/page';
import VideoCrud from "./video/page";
import BookCrud from './books/page';


// Define the book component
export default function Home() {
  const [showImageCrud, setShowImageCrud] = useState(false);
  const [showVideoCrud, setShowVideoCrud] = useState(false);
  const [showBookCrud, setShowBookCrud] = useState(false);

  return (
    <main id="body" className="flex min-h-screen flex-col p-10 desktop:overflow-x-hidden desktop:overflow-y-auto laptop:overflow-x-hidden laptop:overflow-y-auto tablet:overflow-x-hidden tablet:overflow-y-auto mobile:overflow-x-hidden mobile:overflow-y-auto watch:overflow-x-hidden watch:overflow-y-auto">
      <div className="">
        <button onClick={() => { setShowImageCrud(true); setShowVideoCrud(false); setShowBookCrud(false)}} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          {showImageCrud ? 'Hide Images Crud' : 'Show Images Crud'}
        </button>
        {showImageCrud && <ImageCrud />}
        
        <button onClick={() => { setShowVideoCrud(true); setShowImageCrud(false); setShowBookCrud(false)}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {showVideoCrud ? 'Hide Video Crud' : 'Show Video Crud'}
        </button>
        {showVideoCrud && <VideoCrud />}

        <button onClick={() => { setShowBookCrud(true); setShowImageCrud(false); setShowVideoCrud(false) }} className="bg-green-500 hover:bg-green-700 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {showBookCrud ? 'Hide Book Crud' : 'Show Book Crud'}
        </button>
        {showBookCrud && <BookCrud />}
      </div>
    </main>
  );
}
