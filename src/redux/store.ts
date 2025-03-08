import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import formReducer from "./slices/formSlice";

export const store = configureStore({
	reducer: {
		book: bookReducer,
		form: formReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
