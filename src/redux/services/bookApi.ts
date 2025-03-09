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
