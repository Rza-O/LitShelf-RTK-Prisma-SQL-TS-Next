"use client";
import { Book } from '@/app/types';
import { deleteBookAsync } from '@/redux/slices/bookSlice';
import { AppDispatch } from '@/redux/store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

interface BookCardProps {
   book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
   const dispatch = useDispatch<AppDispatch>();
   const router = useRouter();

   // handle deletion of a book
   const handleDelete = () => {
      if (confirm("Are you sure you want to delete this book?")) {
         dispatch(deleteBookAsync(book.id));
      }
   }

   const handleDetails = () => {
      router.push(`/?booksId=${book.id}`);
   }

   return (
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
         <div className="relative w-full h-48">
            <Image
               src={book.coverImage?.url || '/book-placeholder.png'}
               alt={book.title}
               layout="fill"
               objectFit="cover"
               className="rounded-t-lg"
            />
         </div>

         <h3 className="text-lg font-semibold">{book.title}</h3>
         <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
         <p className="text-sm text-gray-700">Author: {book.author.name}</p>
         <p className="text-sm font-bold text-blue-600">${book.price.toFixed(2)}</p>

         <div className="flex gap-2 mt-2">
            <button
               onClick={handleDetails}
               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
               Details
            </button>
            <button
               onClick={handleDelete}
               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
               Delete
            </button>
         </div>
      </div>
   );
};

export default BookCard;