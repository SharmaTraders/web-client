import {baseApi} from "./setup";

const purchaseApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            addPurchase: builder.mutation({
                query: ({
                            purchase,
                        }) => ({
                    url: "purchase",
                    method: "POST",
                    body: purchase,
                }),
                invalidatesTags: ['Purchases'],
            }),

            getPurchases: builder.query({
                query: () => "purchase",
                providesTags: ['Purchases'],
            })
        })
    });

export const {useAddPurchaseMutation, useGetPurchasesQuery} = purchaseApi;