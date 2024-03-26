import {createSlice} from "@reduxjs/toolkit";


const billingPartySlice = createSlice({
    name: "billingParty",
    initialState: {
        selectedBillingPartyIndex: 0
    },
    reducers: {
        setSelectedBillingPartyIndex: function (state, action) {
            state.selectedBillingPartyIndex = action.payload;
        }
    }
});

export const {setSelectedBillingPartyIndex} = billingPartySlice.actions;
export const selectSelectedBillingPartyIndex = state => state.billingParty.selectedBillingPartyIndex;
export default billingPartySlice.reducer;