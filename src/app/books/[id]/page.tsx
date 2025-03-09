"use client";
import BookDetailsModal from '@/components/BookDetailsModal';
import BookSkeleton from '@/components/BookSkeleton';
import { fetchBookById } from '@/redux/slices/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BookDetailsPage = ({ params }: { params: { id: string } }) => {
   const dispatch = useDispatch<AppDispatch>();
   const router = useRouter();
   const { books, loading, error } = useSelector((state: RootState) => state.book)

   const book = books.find((b) => b.id === params.id)

   useEffect(() => {
      if (!book) {
         dispatch(fetchBookById(params.id));
      }
   }, [dispatch, params.id, book]);

   if (loading) return <BookSkeleton />
   if (error) return <p className='text-red-500'>{error}</p>
   if (!book) return <p>Book not found</p>


   return <BookDetailsModal book={book} onClose={() => router.push('/')} />
};

export default BookDetailsPage;