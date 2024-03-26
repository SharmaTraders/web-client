import {createSlice} from "@reduxjs/toolkit";


const billingPartySlice = createSlice({
    name: "billingParty",
    initialState: {
        selectedBillingPartyIndex: 0,
        selectedBillingParty: null
    },
    reducers: {
        setSelectedBillingPartyIndex: function (state, action) {
            state.selectedBillingPartyIndex = action.payload;
        },
        setSelectedBillingParty: function (state, action) {
            state.selectedBillingParty = action.payload;
        }
    }
});

export const {setSelectedBillingPartyIndex,
    setSelectedBillingParty} = billingPartySlice.actions;
export const selectSelectedBillingPartyIndex = state => state.billingParty.selectedBillingPartyIndex;
export const selectSelectedBillingParty = state => state.billingParty.selectedBillingParty;
export default billingPartySlice.reducer;