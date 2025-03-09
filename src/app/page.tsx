import BookForm from "@/components/AddBookForm";
import axios from "axios";

export default async function Home() {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books`
  );

  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //     <h2>LitShelf Your Book Management Services</h2>
    //     <p>{JSON.stringify(data)}</p>
    //     <BookForm />
    //   </main>
    // </div>
    <div className="flex flex-col items-center justify-center  p-8 font-[family-name:var(--font-geist-sans)]">
      <h2>LitShelf Your Book Management Services</h2>
      <div className="flex gap-8 items-center justify-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <BookForm />
      </div>
    </div>
  );
}
