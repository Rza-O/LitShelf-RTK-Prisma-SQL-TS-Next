"use client";

import { Book } from "@/app/types";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { deleteBookAsync } from "@/redux/slices/bookSlice";
import { AppDispatch } from "@/redux/store";


interface Props {
   book: Book;
}

const BookCard = ({ book }: Props) => {
   const dispatch = useDispatch<AppDispatch>();
   const router = useRouter();

   const handleDetailsClick = () => {
      router.push(`/books/${book.id}`);
   };

   const handleDeleteClick = () => {
      dispatch(deleteBookAsync(book.id));
   };

   return (
      <div className="p-4 border rounded-lg shadow-md space-y-3 flex flex-col">
         {/* Book Cover */}
         <img
            src={book.coverImage?.url || "/placeholder.jpg"}
            alt={book?.title}
            className="w-full h-40 object-cover rounded"
         />

         {/* Book Details */}
         <h3 className="font-bold">{book?.title}</h3>
         <p><strong>ISBN:</strong> {book?.isbn}</p>
         <p><strong>Author:</strong> {book.author.name}</p>
         <p><strong>Price:</strong> ${book?.price}</p>

         {/* Buttons */}
         <div className="flex gap-4 mt-auto">
            <button
               onClick={handleDetailsClick}
               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
               Details
            </button>

            <button
               onClick={handleDeleteClick}
               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
               Delete
            </button>
         </div>
      </div>
   );
};

export default BookCard;
