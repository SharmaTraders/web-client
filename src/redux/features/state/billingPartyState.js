import {createSlice} from "@reduxjs/toolkit";


const billingPartySlice = createSlice({
    name: "billingParty",
    initialState: {
        selectedBillingParty: null
    },
    reducers: {
        setSelectedBillingParty: function (state, action) {
            state.selectedBillingParty = action.payload;
        }
    }
});

export const {
    setSelectedBillingParty} = billingPartySlice.actions;
export const selectSelectedBillingParty = state => state.billingParty.selectedBillingParty;
export default billingPartySlice.reducer;