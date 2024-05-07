import { createSlice } from '@reduxjs/toolkit';
function defineItemSlice() {
    return createSlice({
        name: "item",
        initialState: {
            selectedItemIndex: 0,
            selectedItem: null
        },
        reducers: {
            setSelectedItemIndex: function (state, action) {
                state.selectedItemIndex = action.payload;
            },
            setSelectedItem: function (state, action) {
                state.selectedItem = action.payload;
            }
        }
    });
}

const itemSlice = defineItemSlice();

export const { setSelectedItemIndex, setSelectedItem } = itemSlice.actions;
export const selectSelectedItemIndex = state => state.item.selectedItemIndex;
export const selectSelectedItem = state => state.item.selectedItem;
export default itemSlice.reducer;
