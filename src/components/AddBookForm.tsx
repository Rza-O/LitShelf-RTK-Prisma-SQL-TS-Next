"use client";

import { FormState } from "@/app/types";
import { addBookAsync } from "@/redux/slices/bookSlice";
import { resetForm, updateField } from "@/redux/slices/formSlice";
import { RootState, store } from "@/redux/store";
import { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddBookForm = () => {
   const dispatch = useDispatch<typeof store.dispatch>();
   const formData = useSelector((state: RootState) => state.form);

   const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;

      // Convert `price` to number if the field is `price`
      const fieldValue = name === "price" ? Number(value) || 0 : value;

      dispatch(updateField({ field: name as keyof FormState, value: fieldValue }));
   };

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      const bookData = {
         title: formData.title,
         description: formData.description,
         price: Number(formData.price), // Ensure price is a number
         isbn: formData.isbn,
         website: formData.website,
         author: { id: crypto.randomUUID(), name: formData.authorName },
         category: { id: crypto.randomUUID(), name: formData.categoryName },
         coverUrl: formData.coverUrl,
         publishedAt: new Date().toISOString(),
      };

      console.log("Sending bookData:", bookData); // ✅ Add this for debugging

      try {
         await dispatch(addBookAsync(bookData)).unwrap();
         dispatch(resetForm()); // Clear the form after success
      } catch (error) {
         console.error("Error adding book:", error);
      }
   };


   return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-300 rounded-md">
         <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
         />
         <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
         />
         <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
         />
         <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            className="w-full p-2 border rounded"
            required
         />
         <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full p-2 border rounded"
            required
         />
         <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full p-2 border rounded"
            required
         />
         <input
            type="url"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="Cover Image URL"
            className="w-full p-2 border rounded"
            required
         />

         <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
         >
            Add Book
         </button>
      </form>
   );
};

export default AddBookForm;
