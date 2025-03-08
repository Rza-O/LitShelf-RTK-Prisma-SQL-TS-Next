import BooksList from "@/components/BooksList";

export default async function Home() {


  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //     <div className="flex gap-8 p-8">
    //       {/* Left Side - Add Book Form (Placeholder for now) */}
    //       <div className="w-1/3">
    //         <div className="bg-white shadow-md rounded-lg p-4">
    //           <h2 className="text-xl font-bold mb-4">Add New Book</h2>
    //           <p>Form implementation goes here...</p>
    //         </div>
    //       </div>

    //       {/* Right Side - Book List Display */}
    //       <div className="flex-1">
    //         <h2 className="text-2xl font-bold mb-4">All Books</h2>
    //         <BooksList />
    //       </div>
    //     </div>
    //   </main>
    // </div>
    <div className="flex gap-8 p-8">
      {/* Left Side - Add Book Form (Placeholder for now) */}
      <div className="w-1/3">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Add New Book</h2>
          <p>Form implementation goes here...</p>
        </div>
      </div>

      {/* Right Side - Book List Display */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">All Books</h2>
        <BooksList />
      </div>
    </div>
  );
}
