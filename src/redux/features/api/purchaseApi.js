import {baseApi} from "./setup";

const purchaseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        addPurchase: builder.mutation({
            query: ({
                        billingPartyId,
                        purchaseLines,
                        date,
                        remarks,
                        vatAmount,
                        transportFee,
                        paidAmount,
                        invoiceNumber
                    }) => ({
                url: 'purchase',
                method: 'POST',
                body: {
                    billingPartyId,
                    purchaseLines,
                    date,
                    remarks,
                    vatAmount,
                    transportFee,
                    paidAmount,
                    invoiceNumber
                }
            }),

            invalidatesTags: ['Purchases', 'BillingParty', 'Items']
        }),

        getPurchases: builder.query({
            query: ({
                        pageNumber,
                        pageSize
                    }) => `purchase?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            forceRefetch: ({currentArg, previousArg}) => currentArg !== previousArg,
            providesTags: (result, error, arg) => {
                return [{type: 'Purchases', pageNumber: arg.pageNumber}];
            }, invalidatesTags: ['Purchases']
        })
    })
});

export const {useAddPurchaseMutation, useGetPurchasesQuery} = purchaseApi;