import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query";

// Some random placeholder for now..
const remoteApi = "https://jsonplaceholder.typicode.com";

const baseQuery = fetchBaseQuery({
    baseUrl: remoteApi,
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