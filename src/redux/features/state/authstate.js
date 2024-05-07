import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        email: null,
        jwtToken: null,
        expirationTime : null
    },
    reducers: {
        setCredentials: function (state, action) {
            const { jwtToken, username } = action.payload;
            state.email = username;
            state.jwtToken = jwtToken;

            // Expiration time is set to 1 day
            state.expirationTime = Date.now() + 60 * 60 * 1000*24;
        },

        logOut: function (state) {
            state.email = null;
            state.jwtToken = null;
            state.expirationTime = null;
        },
    }
});
export const { setCredentials, logOut } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth && state.auth.jwtToken && state.auth.email && state.auth.expirationTime > Date.now();
export const selectEmail = (state) => state.auth.email;
export default authSlice.reducer;