import { baseApi } from "./setup";

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
            query: () => "purchase",
            providesTags: ['Purchases'],
        })
    })
});

export const { useAddPurchaseMutation, useGetPurchasesQuery } = purchaseApi;