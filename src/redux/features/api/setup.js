import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const apiAddress = "http://localhost:5144/";

const baseQuery = fetchBaseQuery({
    baseUrl: apiAddress,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.jwtToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const baseApi = createApi({
    baseQuery: baseQuery,
    keepUnusedDataFor: 60*60, // 1 hour
    endpoints : () => ({}),
});