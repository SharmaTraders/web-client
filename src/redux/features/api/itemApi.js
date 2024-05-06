import {baseApi} from "./setup";

const itemApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addItem: builder.mutation({
                query: ({name}) => ({
                    url: 'item',
                    method: 'POST',
                    body: {
                        name
                    }
                }),
            }),

            getItems: builder.query({
                query: () => "item",
                providesTags: ['Items'],
            })
        })
    });

export const {useAddItemMutation, useGetItemsQuery} = itemApi;