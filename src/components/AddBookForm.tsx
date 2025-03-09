"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBookAsync } from "@/redux/slices/bookSlice";
import { Book } from "@/app/types";

const BookForm = () => {
   const dispatch = useDispatch<AppDispatch>();

   // Form State
   const [formData, setFormData] = useState<{
      title: string;
      authorName: string;
      authorBio: string;
      isbn: string;
      price: number;
      coverImageUrl: string;
      description: string;
      categoryName: string;
   }>({
      title: "",
      authorName: "",
      authorBio: "",
      isbn: "",
      price: 0,
      coverImageUrl: "",
      description: "",
      categoryName: "",
   });

   const [errors, setErrors] = useState<string[]>([]);

   // Handle Input Change
   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: name === "price" ? Number(value) || "" : value,
      }));
   };

   // Handle Form Submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Basic Validation
      const missingFields = Object.entries(formData)
         .filter(([key, value]) => !value)
         .map(([key]) => key);

      if (missingFields.length) {
         setErrors(missingFields);
         return;
      }

      // Construct Correct Book Object
      const newBook: Book = {
         id: Date.now().toString(),
         title: formData.title,
         description: formData.description,
         price: formData.price,
         isbn: formData.isbn,
         available: true,
         website: null,
         publishedAt: new Date().toISOString(),
         author: {
            id: `author-${Date.now()}`,
            name: formData.authorName,
            bio: formData.authorBio,
         },
         category: {
            id: `category-${Date.now()}`,
            name: formData.categoryName,
         },
         coverImage: {
            id: `cover-${Date.now()}`,
            url: formData.coverImageUrl,
            bookId: Date.now().toString(),
         },
      };

      // Dispatch Async Action
      dispatch(addBookAsync(newBook));

      // Clear Form
      setFormData({
         title: "",
         authorName: "",
         authorBio: "",
         isbn: "",
         price: 0,
         coverImageUrl: "",
         description: "",
         categoryName: "",
      });

      setErrors([]);
   };

   // Utility: Highlight missing fields
   const isError = (field: keyof typeof formData) => errors.includes(field);

   return (
      <div className="max-w-md p-6 bg-white rounded-2xl shadow-md space-y-4">
         <h2 className="text-xl font-bold text-gray-800">Add a New Book</h2>

         {errors.length > 0 && (
            <div className="text-red-500 text-sm">
               Please fill the following fields: {errors.join(", ")}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-3">
            {Object.keys(formData).map((key) => (
               <div key={key}>
                  <label
                     htmlFor={key}
                     className={`block text-sm font-medium mb-1 ${isError(key as keyof typeof formData)
                           ? "text-red-500"
                           : "text-gray-700"
                        }`}
                  >
                     {key[0].toUpperCase() + key.slice(1)}
                  </label>

                  {key === "description" ? (
                     <textarea
                        id={key}
                        name={key}
                        value={formData[key as keyof typeof formData] || ""}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${isError(key as keyof typeof formData)
                              ? "border-red-500"
                              : "border-gray-300"
                           }`}
                        placeholder={`Enter ${key}`}
                     />
                  ) : (
                     <input
                        type={key === "price" ? "number" : "text"}
                        id={key}
                        name={key}
                        value={formData[key as keyof typeof formData] || ""}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${isError(key as keyof typeof formData)
                              ? "border-red-500"
                              : "border-gray-300"
                           }`}
                        placeholder={`Enter ${key}`}
                        step={key === "price" ? "0.01" : undefined}
                     />
                  )}

                  {isError(key as keyof typeof formData) && (
                     <p className="text-red-500 text-xs mt-1">
                        {key[0].toUpperCase() + key.slice(1)} is required.
                     </p>
                  )}
               </div>
            ))}

            <button
               type="submit"
               className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
               Add Book
            </button>
         </form>
      </div>
   );
};

export default BookForm;
