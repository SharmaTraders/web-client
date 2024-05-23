import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
    name: "employee",
    initialState: {
        selectedEmployee: null
    },
    reducers: {
        setSelectedEmployee: (state, action) => {
            state.selectedEmployee = action.payload;
        }
    }
});

export const {
    setSelectedEmployee
} = employeeSlice.actions;

export const selectSelectedEmployee = state => state.employee.selectedEmployee;

export default employeeSlice.reducer;
