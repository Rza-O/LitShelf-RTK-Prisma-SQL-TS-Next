"use client";
import { fetchBooks } from '@/redux/slices/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookCard from './BookCard';

const BooksList = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { books, loading } = useSelector((state: RootState) => state.book);

   useEffect(() => {
      dispatch(fetchBooks());
   }, [dispatch]);

   // skeleton loader
   if (loading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, index) => (
               <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg p-4 h-56"
               />
            ))}
         </div>
      );
   }



   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {books.map((book) => (
            <BookCard key={book.id} book={book} />
         ))}
      </div>
   );
};

export default BooksList;