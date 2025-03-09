"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBooks } from "@/redux/slices/bookSlice";
import BookCard from "./BookCard";
import BooKCardSkeleton from "./BooKCardSkeleton";

const BookList = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { books, loading, error } = useSelector(
      (state: RootState) => state.book
   );

   useEffect(() => {
      dispatch(fetchBooks());
   }, [dispatch]);

   if (loading) <BooKCardSkeleton />;
   if (error) return <p className="text-red-500">{error}</p>;

   return (
      <div className="container mx-auto my-8">
         {loading ? (
            <BooKCardSkeleton />
         ) : (
            <div className="grid grid-cols-3 gap-4">
               {books.map((book) => (
                  <BookCard key={book.id} book={book} />
               ))}
            </div>
         )}
      </div>
   );
};

export default BookList;
