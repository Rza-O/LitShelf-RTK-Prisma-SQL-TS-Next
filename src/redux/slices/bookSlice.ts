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

// fetch by book Id
export const fetchBookById = createAsyncThunk(
	"books/fetchBookById",
	async (id: string, { rejectWithValue }) => {
		try {
			const { data } = await axios.get<Book>(
				`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`
			);
			return data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to fetch book");
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
				description: "No description provided",
				price: Number(book.price),
				isbn: book.isbn,
				available: true,
				authorName: book.author,
				categoryName: "General",
				coverUrl: book.coverImage || undefined,
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
export const updateBookAsync = createAsyncThunk<
	Book,
	Book,
	{ rejectValue: string }
>("books/updateBookAsync", async (book, { rejectWithValue }) => {
	try {
		const formattedBook = {
			title: book.title,
			description: book.description || "No description provided",
			price: Number(book.price),
			isbn: book.isbn,
			available: book.available,
			authorName: book.author?.name,
			categoryName: book.category?.name,
			coverUrl: book.coverImage?.url,
		};

		const { data } = await axios.put<Book>(
			`${process.env.NEXT_PUBLIC_API_URL}/api/books/${book.id}`,
			formattedBook,
			{ headers: { "Content-Type": "application/json" } }
		);

		return data;
	} catch (error: any) {
		const errorMessage =
			typeof error.response?.data === "object"
				? JSON.stringify(error.response.data)
				: error.response?.data || "Failed to update book";

		return rejectWithValue(errorMessage);
	}
});

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
			// fetch single book by id
			.addCase(fetchBookById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchBookById.fulfilled, (state, action) => {
				state.loading = false;
				const existingBookIndex = state.books.findIndex(
					(book) => book.id === action.payload.id
				);
				if (existingBookIndex !== -1) {
					state.books[existingBookIndex] = action.payload;
				} else {
					state.books.push(action.payload);
				}
			})
			.addCase(fetchBookById.rejected, (state, action) => {
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
