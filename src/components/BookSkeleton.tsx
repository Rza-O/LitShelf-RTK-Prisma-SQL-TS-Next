import React from "react";

const BookSkeleton = () => {
   return (
      <div className="animate-pulse space-y-2 p-4 border rounded-lg shadow-md bg-gray-100">
         <div className="h-6 bg-gray-300 rounded w-3/4"></div>
         <div className="h-4 bg-gray-300 rounded w-1/2"></div>
         <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
   );
};

export default BookSkeleton;
