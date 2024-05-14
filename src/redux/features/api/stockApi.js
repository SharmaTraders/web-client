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

                // Only have one cache per item regardless of the pageNumber
                // // Merge incoming data for infinite pagination
                // merge: (currentCacheData, response) => {
                //     // Initialize an object to keep track of existing stocks by their ID
                //
                //     if (response.pageNumber === 1) return response;
                //     const existingStocksById = {};
                //
                //     // Populate existingStocksById with stocks from currentCacheData
                //     currentCacheData.stocks?.forEach(stock => {
                //         existingStocksById[stock.id] = true;
                //     });
                //
                //     // Filter out response.stocks that are not already in the cache
                //     const uniqueNewStocks = response.stocks?.filter(stock => !existingStocksById[stock.id]);
                //
                //     // Concatenate the unique new stocks with the existing stocks
                //     currentCacheData.stocks = [...(currentCacheData.stocks ?? []), ...uniqueNewStocks];
                //     currentCacheData.pageNumber = response.pageNumber;
                //     currentCacheData.totalPages = response.totalPages;
                //     currentCacheData.pageSize = response.pageSize;
                //     return currentCacheData;
                // },        serializeQueryArgs ({endpointName, queryArgs}) {
                //     const obj = {itemId: queryArgs.itemId}
                //     return endpointName + JSON.stringify(obj);
                // },
                //



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