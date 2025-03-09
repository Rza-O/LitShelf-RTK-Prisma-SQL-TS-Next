### **Lit Shelf - Book Management System**

A Next.js 14 project with TypeScript, Prisma, RTK Query, and SQLite

---

## **📖 Project Overview**

**Lit Shelf** is a modern book management system built with cutting-edge technologies like **Next.js 14**, **TypeScript**, **Redux Toolkit (RTK Query)**, and **Prisma ORM**. This application enables users to perform CRUD operations on books, featuring a sleek UI with features like skeleton loaders, modals, and detailed book displays.

---

## **🗂️ Project Structure**

```
├───prisma
│   │   dev.db
│   │   schema.prisma
│   │   seed.ts
│   └───migrations
│       └───<timestamp>_init
│               migration.sql
│
├───public
│       book-placeholder.png
│
└───src
    ├───app
    │   ├───api
    │   │   └───books
    │   │       │   route.ts
    │   │       └───[id]
    │   │               route.ts
    │   │
    │   ├───books
    │   │   └───[id]
    │   │           page.tsx
    │   │
    │   └───fonts
    │           GeistMonoVF.woff
    │           GeistVF.woff
    │
    ├───components
    │       AddBookForm.tsx
    │       BookCard.tsx
    │       BookCardSkeleton.tsx
    │       BookDetailsModal.tsx
    │       BookSkeleton.tsx
    │       BooksList.tsx
    │
    ├───lib
    │       prisma.ts
    │
    └───redux
        │   Provider.tsx
        │   store.ts
        │
        ├───services
        │       bookApi.ts
        │
        └───slices
                bookSlice.ts
```

---

## **🛠️ Tech Stack**

-  **Next.js 14** – For server-side rendering (SSR) and static site generation (SSG).
-  **TypeScript** – Ensures type safety throughout the project.
-  **RTK Query** – For efficient data fetching and caching.
-  **Prisma ORM** – Database management and query building.
-  **SQLite** – Lightweight and embedded database.
-  **Tailwind CSS** – For streamlined UI development.

---

## **🚀 Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/lit-shelf.git
cd lit-shelf
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Setup Environment Variables**

Create a `.env` file in the root and add the following:

```
DATABASE_URL="file:./prisma/dev.db"
```

### **4. Run Database Migrations**

```bash
npx prisma db push
```

### **5. Seed the Database**

To populate sample book data, run:

```bash
npx prisma db seed
```

### **6. Generate Prisma Client**

```bash
npx prisma generate
```

### **7. Start the Development Server**

```bash
npm run dev
```

---

## **🧱 Key Features**

### ✅ **CRUD Operations**

-  **Add New Books**
-  **View Book Details**
-  **Edit Book Information**
-  **Delete Books**

### ✅ **Book Details Modal**

-  Displays book details with a read-only form.
-  Includes an **Edit Mode** with a toggleable **Save Changes** button.

### ✅ **Skeleton Loaders**

-  While data is loading, a clean UI skeleton ensures smooth visual feedback.

### ✅ **URL Persistence**

-  When a book’s modal is open, the URL updates to `/books/:id`, ensuring the modal remains on page refresh.

---

## **📂 Code Overview**

### **`bookApi.ts` (RTK Query Implementation)**

This file defines the data fetching logic for books.

```typescript
import { Book } from "@/app/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
	reducerPath: "bookApi",
	baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
	tagTypes: ["Books"],

	endpoints: (builder) => ({
		getBooks: builder.query<Book[], void>({
			query: () => "/books",
			providesTags: ["Books"],
		}),

		getBookById: builder.query<Book, string>({
			query: (id) => `/books/${id}`,
			providesTags: (result, error, id) => [{ type: "Books", id }],
		}),

		newBook: builder.mutation<Book, Partial<Book>>({
			query: (newBook) => ({
				url: "/books",
				method: "POST",
				body: newBook,
			}),
			invalidatesTags: ["Books"],
		}),

		upgradeBook: builder.mutation<Book, Book>({
			query: (updatedBook) => ({
				url: `/books/${updatedBook.id}`,
				method: "PUT",
				body: updatedBook,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Books", id }],
		}),

		removeBook: builder.mutation<{ success: boolean; id: string }, string>({
			query: (id) => ({
				url: `/books/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Books"],
		}),
	}),
});

export const {
	useRemoveBookMutation,
	useGetBookByIdQuery,
	useGetBooksQuery,
	useNewBookMutation,
	useUpgradeBookMutation,
} = bookApi;
```

### **Key Concepts in RTK Query**

-  **`createApi`**: Core RTK Query function to define endpoints.
-  **`fetchBaseQuery`**: Simplifies data fetching with minimal boilerplate.
-  **`providesTags` / `invalidatesTags`**: Enables automatic cache invalidation for improved performance.

---

### **`store.ts` (Redux Store Configuration)**

```typescript
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import { bookApi } from "./services/bookApi";

export const store = configureStore({
	reducer: {
		book: bookReducer,
		[bookApi.reducerPath]: bookApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(bookApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### **Key Concepts in Store Configuration**

-  **`configureStore`**: Assembles reducers and middlewares efficiently.
-  **`getDefaultMiddleware()`**: Ensures essential middleware like `thunk` and `serializableCheck` are included.
-  **`bookApi.middleware`**: Enables RTK Query to manage cache and auto-refetch logic.

---

## **💻 Usage Instructions**

### **Add a New Book**

1. Navigate to `/`.
2. Click **Add Book**.
3. Fill in the form and submit.

### **View or Edit Book Details**

1. Click the **Details** button on any book.
2. Toggle the **Edit** button to modify details.
3. Click **Save Changes** to submit updates.

### **Delete a Book**

1. Click the **Delete** button on a book card.
2. Confirm deletion to remove the book from the list.

---

## **📋 Best Practices**

✅ Use **RTK Query** for all data fetching logic.  
✅ Follow **Atomic Design Principles** for scalable UI components.  
✅ Implement **TypeScript types** for improved type safety.  
✅ Ensure **optimistic updates** to improve UI responsiveness.

---

## **🐞 Troubleshooting**

### **Prisma Client Issues**

-  Run `npx prisma generate` after changing your schema.

### **Database Errors**

-  `DATABASE_URL` It's hardcoded but you can create `DATABASE_URL` in `.env` is correctly set to `"file:./prisma/dev.db"`.

---
