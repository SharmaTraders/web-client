import {baseApi} from "./setup";

const itemApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addItem: builder.mutation({
                query: ({
                itemName,
                }) => ({
                    url: "item",
                    method: "POST",
                    body: {
                        name: itemName,
                    },
                }),
                invalidatesTags: ['Items'],
            }),

            getItems: builder.query({
                query: () => "item",
                providesTags: ['Items'],
            })
        })
    });

export const {useAddItemMutation, useGetItemsQuery} = itemApi;