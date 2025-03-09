import { Book } from "@/app/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface BookState {
	books: Book[];
	loading: boolean;
	error: string | null;
}
const initialState: BookState = {
	books: [],
	loading: false,
	error: null,
};

// Async Thunk for server communication

// fetch books
export const fetchBooks = createAsyncThunk(
	"books/fetchBooks",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await axios.get<Book[]>(
				`${process.env.NEXT_PUBLIC_API_URL}/api/books`
			);
			return data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data);
		}
	}
);

// add books(optimistic ui)
export const addBookAsync = createAsyncThunk(
	"books/addBookAsync",
	async (book: Book, { rejectWithValue }) => {
		try {
			const formattedBook = {
				title: book.title,
				description: "No description provided", // Placeholder since your form lacks this field
				price: Number(book.price), // Convert price to number
				isbn: book.isbn,
				available: true, // Assuming all new books are available by default
				authorName: book.author,
				categoryName: "General", // Placeholder since your form lacks this field
				coverUrl: book.coverImage || undefined, // Optional field
			};
			const { data } = await axios.post<Book>(
				`${process.env.NEXT_PUBLIC_API_URL}/api/books`,
				formattedBook
			);
			return data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to add book");
		}
	}
);

// Delete a book (optimistic)
export const deleteBookAsync = createAsyncThunk(
	"books/deleteBookAsync",
	async (id: string, { rejectWithValue }) => {
		try {
			const { data } = await axios.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`
			);
			return data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to delete book"
			);
		}
	}
);

// update book optimistically
export const updateBookAsync = createAsyncThunk(
	"books/updateBookAsync",
	async (book: Book, { rejectWithValue }) => {
		try {
			const { data } = await axios.put<Book>(
				`${process.env.NEXT_PUBLIC_API_URL}/api/books/${book.id}`
			);
			return data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "failed to update book"
			);
		}
	}
);

// Redux slice with synchronous and Async reducers

const bookSlice = createSlice({
	name: "book",
	initialState,
	reducers: {
		// sync action to add book
		addBook: (state, action: PayloadAction<Book>) => {
			state.books.unshift(action.payload);
		},

		// sync action to delete a book
		deleteBook: (state, action: PayloadAction<string>) => {
			state.books = state.books.filter((book) => book.id !== action.payload);
		},

		// sync Action to update a book
		updateBook: (state, action: PayloadAction<Book>) => {
			const index = state.books.findIndex(
				(book) => book.id === action.payload.id
			);
			if (index !== -1) {
				state.books[index] = action.payload;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			// fetch Books
			.addCase(fetchBooks.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchBooks.fulfilled, (state, action) => {
				state.loading = false;
				state.books = action.payload;
			})
			.addCase(fetchBooks.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// Add books
			.addCase(addBookAsync.pending, (state, action) => {
				state.books.unshift(action.meta.arg);
			})
			.addCase(addBookAsync.rejected, (state, action) => {
				state.books = state.books.filter(
					(book) => book.id !== action.meta.arg.id
				);
				state.error = action.payload as string;
			})

			// Delete Book (Optimistic)
			.addCase(deleteBookAsync.pending, (state, action) => {
				state.books = state.books.filter(
					(book) => book.id !== action.meta.arg
				); // Remove immediately
			})
			.addCase(deleteBookAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Update Book (Optimistic)
			.addCase(updateBookAsync.pending, (state, action) => {
				const index = state.books.findIndex(
					(book) => book.id === action.meta.arg.id
				);
				if (index !== -1) {
					state.books[index] = action.meta.arg; // Update UI instantly
				}
			})
			.addCase(updateBookAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { addBook, deleteBook, updateBook } = bookSlice.actions;
export default bookSlice.reducer;
