import {baseApi} from "./setup";

const itemApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addItem: builder.mutation({
                query: ({
                    name,
                    stockWeight,
                    estimatedPricePerKilo
                }) => ({
                    url: "item",
                    method: "POST",
                    body: {
                        name,
                        stockWeight,
                        estimatedPricePerKilo
                    },
                }),
                invalidatesTags: ['Items'],
            }),

            getItems: builder.query({
                query: () => "item",
                providesTags: ['Items'],
            }),

            updateItem: builder.mutation({
                query: ({
                    itemId,
                    itemName,
                }) => ({
                    url: `item/${itemId}`,
                    method: "PUT",
                    body: {
                        name: itemName,
                    },
                }),
                invalidatesTags: ['Items'],
            })
        })
    });

export const {useAddItemMutation, useGetItemsQuery, useUpdateItemMutation} = itemApi;