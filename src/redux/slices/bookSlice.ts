import { Book } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookState {
	books: Book[];
}

const initialState: BookState = {
	books: [],
};

const bookSlice = createSlice({
	name: "book",
	initialState,
	reducers: {
		// action to add book
		addBook: (state, action: PayloadAction<Book>) => {
			state.books.unshift(action.payload);
		},

		// action to delete a book
		deleteBook: (state, action: PayloadAction<string>) => {
			state.books = state.books.filter((book) => book.id !== action.payload);
		},

		// Action to update a book
		updateBook: (state, action: PayloadAction<Book>) => {
			const index = state.books.findIndex(
				(book) => book.id === action.payload.id
			);
			if (index !== -1) {
				state.books[index] = action.payload;
			}
		},
	},
});


export const { addBook, deleteBook, updateBook } = bookSlice.actions
export default bookSlice.reducer;