import {baseApi} from "./setup";

const itemApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addItem: builder.mutation({
                query: ({email, password}) => ({
                    url: 'auth/login/admin',
                    method: 'POST',
                    body: {
                        email,
                        password
                    }
                }),
            }),
        })
    });

export const {useAddItemMutation} = itemApi;