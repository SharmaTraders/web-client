import {createSlice} from "@reduxjs/toolkit";


const categorySLice = createSlice({
    name: "expenseCategory",
    initialState: {
        selectedCategory: null
    },
    reducers: {
        setSelectedCategory: function (state, action) {
            state.selectedCategory = action.payload;
        }
    }
});

export const {
    setSelectedCategory} = categorySLice.actions;
export const selectSelectedCategory = state => state.category.selectedCategory;
export default categorySLice.reducer;