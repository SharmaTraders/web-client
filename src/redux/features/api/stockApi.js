import {baseApi} from "./setup";

const stockApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addStock: builder.mutation({
                query: ({
                            itemId,
                            weight,
                            expectedValuePerKilo,
                            date,
                            remarks
                        }) => ({
                    url: `item/${itemId}/add-stock`,
                    method: "PATCH",
                    body: {
                        weight,
                        expectedValuePerKilo,
                        date,
                        remarks
                    },
                }),
                invalidatesTags: (result, error, arg) => [{type: 'Stock', id: arg.itemId}, 'Items'],
            }),
            reduceStock: builder.mutation({
                query: ({
                            itemId,
                            weight,
                            date,
                            remarks
                        }) => ({
                    url: `item/${itemId}/reduce-stock`,
                    method: "PATCH",
                    body: {
                        weight,
                        date,
                        remarks
                    },
                }),
                invalidatesTags: (result, error, arg) => [{type: 'Stock', id: arg.itemId}, 'Items'],
            }),

            getStocksByItem: builder.query({
                query: ({
                            itemId,
                            pageNumber,
                            pageSize
                        }) => `item/${itemId}/stocks?pageNumber=${pageNumber}&pageSize=${pageSize}`,


                // Refetch the data if the current page number is different from the previous page number
                forceRefetch({currentArg, previousArg}) {
                    return currentArg !== previousArg;
                },

                providesTags: (result, error, arg) => {
                    return [{type: 'Stock', id: arg.itemId}];
                }
            })

        })
    });

stockApi.endpoints.getStocksByItem.invalidatesTags = (result, error, arg) => [{type: 'Stock', id: arg.itemId, pageNumber: 1}];
export const {useAddStockMutation, useReduceStockMutation, useGetStocksByItemQuery} = stockApi;