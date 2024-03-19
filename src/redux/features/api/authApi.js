import {baseApi} from "./setup";

const authApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            login: builder.mutation({
                query: ({email, password}) => ({
                    url: 'auth/login/admin',
                    method: 'POST',
                    body: {
                        email,
                        password
                    }
                }),
            }),
            register: builder.mutation({
                query: ({email, password}) => ({
                    url: 'auth/register/admin',
                    method: 'POST',
                    body: {
                        email,
                        password
                    }
                })
            })
        })
    });

export const {useLoginMutation, useRegisterMutation} = authApi;