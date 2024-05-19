import { baseApi } from "./setup";

const saleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        addSale: builder.mutation({
            query: ({
                        billingPartyId,
                        saleLines,
                        date,
                        remarks,
                        vatAmount,
                        transportFee,
                        receivedAmount,
                        invoiceNumber
                    }) => ({
                url: 'sale',
                method: 'POST',
                body: {
                    billingPartyId,
                    saleLines,
                    date,
                    remarks,
                    vatAmount,
                    transportFee,
                    receivedAmount,
                    invoiceNumber
                }
            }),

            invalidatesTags: ['Sales', 'BillingParty', 'Items']
        }),

        getSale: builder.query({
            query: () => "sale",
            providesTags: ['Sales'],
        })
    })
});

export const { useAddSaleMutation, useGetSaleMutation } = saleApi;