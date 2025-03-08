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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data || "An unexpected error occurred"
				);
			} else {
				return rejectWithValue("Unknown error occurred");
			}
		}
	}
);

// add books(optimistic ui)
export const addBookAsync = createAsyncThunk(
	"book/addBookAsync",
	async (bookData: Partial<Book>, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/books", bookData, {
				headers: {
					"Content-Type": "application/json", // Ensure JSON content type
				},
			});
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			}
			return rejectWithValue("Failed to add book");
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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data || "An unexpected error occurred"
				);
			} else {
				return rejectWithValue("Unknown error occurred");
			}
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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data || "An unexpected error occurred"
				);
			} else {
				return rejectWithValue("Unknown error occurred");
			}
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
				const tempBook: Book = {
					...action.meta.arg,
					id: crypto.randomUUID(),
					title: action.meta.arg.title || "",
					description: action.meta.arg.description || "",
					price: action.meta.arg.price || 0,
					isbn: action.meta.arg.isbn || "",
					available: action.meta.arg.available || false,
					website: action.meta.arg.website || "",
					publishedAt: action.meta.arg.publishedAt || "",
					author: action.meta.arg.author || { id: "", name: "" },
					category: action.meta.arg.category || { id: "", name: "" },
					coverImage: action.meta.arg.coverImage || { id: "", url: "" }
				};
				state.books.unshift(tempBook);
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
