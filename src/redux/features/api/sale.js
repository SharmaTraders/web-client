import {baseApi} from "./setup";

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
            query: ({
                        pageNumber,
                        pageSize
                    }) => `sale?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            forceRefetch: ({currentArg, previousArg}) => currentArg !== previousArg,
            providesTags: (result, error, arg) => {
                return [{type: 'Sales', pageNumber: arg.pageNumber}];
            }
        })
    })
});

export const {useAddSaleMutation, useGetSaleQuery} = saleApi;