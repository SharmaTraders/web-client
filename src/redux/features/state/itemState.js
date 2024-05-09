import { createSlice } from '@reduxjs/toolkit';

function defineItemSlice() {
    return createSlice({
        name: "item",
        initialState: {
            selectedItem: null
        },
        reducers: {
            setSelectedItem: (state, action) => {
                state.selectedItem = action.payload;
            }
        }
    });
}

const itemSlice = defineItemSlice();

export const { setSelectedItem } = itemSlice.actions;
export const selectSelectedItem = state => state.item.selectedItem;
export default itemSlice.reducer;
