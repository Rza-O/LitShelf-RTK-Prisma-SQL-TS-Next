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
