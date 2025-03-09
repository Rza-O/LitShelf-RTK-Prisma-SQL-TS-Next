"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBookAsync } from "@/redux/slices/bookSlice";
import { Book } from "@/app/types";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

interface Props {
   book: Book;
   onClose: () => void;
}

const BookDetailsModal = ({ book, onClose }: Props) => {
   const dispatch = useDispatch<AppDispatch>();
   const [isEditable, setIsEditable] = useState(false);
   const [formData, setFormData] = useState<Book>({ ...book });
   const router = useRouter();

   // Toggle edit mode
   const toggleEditMode = () => {
      setIsEditable((prev) => !prev);
   };


   // Type guard to check if a value is an object
   const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null;

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name.includes(".")) {
         const [parent, child] = name.split(".");

         setFormData((prev) => {
            const parentValue = prev[parent as keyof Book];

            // Ensure only objects are spread
            if (isObject(parentValue)) {
               return {
                  ...prev,
                  [parent]: { ...parentValue, [child]: value },
               };
            }

            return prev;
         });
      } else {
         setFormData({ ...formData, [name]: value });
      }
   };

   // Handle save changes
   const handleSave = () => {
      dispatch(updateBookAsync(formData));
      toggleEditMode();
      router.push("/");
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white w-[600px] h-[600px] p-6 rounded-lg shadow-lg flex flex-col">
            {/* Header with Edit Icon */}
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-blue-800">Book Details</h2>
               <button
                  onClick={toggleEditMode}
                  className="text-blue-500 text-xl"
               >
                  {isEditable ? "❌" : "✏️"}
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               <form className="space-y-3">
                  {/* Standard Fields */}
                  {Object.entries(formData).map(([key, value]) => {
                     // Handle nested objects like author, category, and coverImage
                     if (typeof value === "object" && value !== null) {
                        return Object.entries(value).map(([nestedKey, nestedValue]) => (
                           <div key={`${key}.${nestedKey}`}>
                              <label className="block text-sm font-medium text-blue-950">
                                 {`${key[0].toUpperCase() + key.slice(1)} - ${nestedKey}`}
                              </label>
                              <input
                                 type="text"
                                 name={`${key}.${nestedKey}`}
                                 value={nestedValue?.toString() || ""}
                                 readOnly={!isEditable}
                                 onChange={handleChange}
                                 className={`w-full p-2 border rounded-lg text-black ${isEditable
                                    ? "border-blue-500"
                                    : "border-gray-300"
                                    }`}
                                 placeholder={`Enter ${nestedKey}`}
                              />
                           </div>
                        ));
                     }

                     // Regular Fields
                     return (
                        <div key={key}>
                           <label className="block text-sm font-medium text-blue-950">
                              {key[0].toUpperCase() + key.slice(1)}
                           </label>
                           <input
                              type={key === "price" ? "number" : "text"}
                              name={key}
                              value={value?.toString() || ""}
                              readOnly={!isEditable}
                              onChange={handleChange}
                              className={`w-full p-2 border rounded-lg text-black ${isEditable
                                 ? "border-blue-500"
                                 : "border-gray-300"
                                 }`}
                              placeholder={`Enter ${key}`}
                           />
                        </div>
                     );
                  })}

                  {/* Save Changes Button */}
                  {isEditable && (
                     <button
                        type="button"
                        onClick={handleSave}
                        className="w-full bg-green-500 text-white p-2 rounded-lg"
                     >
                        Save Changes
                     </button>
                  )}
               </form>
            </div>

            {/* Close Button */}
            <button
               onClick={onClose}
               className="w-full bg-gray-500 text-white p-2 rounded-lg mt-4"
            >
               Close
            </button>
         </div>
      </div>
   );
};

export default BookDetailsModal;
