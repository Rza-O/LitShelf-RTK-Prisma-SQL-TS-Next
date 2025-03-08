import { FormState } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FormState = {
	id: "",
	title: "",
	description: "",
	price: 0, // ✅ Ensure price starts as a number
	isbn: "",
	available: true,
	website: "",
	authorName: "",
	categoryName: "",
	coverUrl: "",
};

const formSlice = createSlice({
	name: "form",
	initialState,
	reducers: {
		updateField: <K extends keyof FormState>(
			state: FormState,
			action: PayloadAction<{ field: K; value: FormState[K] }>
		) => {
			state[action.payload.field] = action.payload.value;
		},
		resetForm: () => initialState,
	},
});

export const { updateField, resetForm } = formSlice.actions;
export default formSlice.reducer;
