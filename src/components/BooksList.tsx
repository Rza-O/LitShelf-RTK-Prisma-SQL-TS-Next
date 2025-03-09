"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBooks } from "@/redux/slices/bookSlice";
import BookCard from "./BookCard";
import BooKCardSkeleton from "./BooKCardSkeleton";
import { useGetBooksQuery } from "@/redux/services/bookApi";

const BookList = () => {
   // const dispatch = useDispatch<AppDispatch>();
   // const { books, loading, error } = useSelector(
   //    (state: RootState) => state.book
   // );

   // useEffect(() => {
   //    dispatch(fetchBooks());
   // }, [dispatch]);


   const { data: books, error, isLoading } = useGetBooksQuery();



   if (isLoading) <BooKCardSkeleton />;
   if (error) {
      const errorMessage = 'status' in error ? error.status : error.message;
      return <p className="text-red-500">{errorMessage}</p>;
   }

   return (
      <div className="container mx-auto my-8">
         {isLoading ? (
            <BooKCardSkeleton />
         ) : (
            <div className="grid grid-cols-3 gap-4">
               {books && books.map((book) => (
                  <BookCard key={book.id} book={book} />
               ))}
            </div>
         )}
      </div>
   );
};

export default BookList;
