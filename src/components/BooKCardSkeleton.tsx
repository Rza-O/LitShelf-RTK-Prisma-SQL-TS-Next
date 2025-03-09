"use client";

const BooKCardSkeleton = () => {
   return (
      <div className="grid grid-cols-3 gap-4">
         {Array.from({ length: 6 }).map((_, index) => (
            <div
               key={index}
               className="p-4 border rounded-lg shadow-md space-y-3 flex flex-col animate-pulse"
            >
               {/* Image Skeleton */}
               <div className="w-full h-40 bg-gray-300 rounded" />

               {/* Text Skeletons */}
               <div className="h-6 bg-gray-300 rounded w-3/4" />
               <div className="h-4 bg-gray-300 rounded w-1/2" />
               <div className="h-4 bg-gray-300 rounded w-2/3" />
               <div className="h-4 bg-gray-300 rounded w-1/4" />

               {/* Buttons Skeleton */}
               <div className="flex gap-4 mt-auto">
                  <div className="h-10 w-20 bg-gray-300 rounded" />
                  <div className="h-10 w-20 bg-gray-300 rounded" />
               </div>
            </div>
         ))}
      </div>
   );
};

export default BooKCardSkeleton;