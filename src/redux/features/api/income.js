import {baseApi} from "./setup";

const incomeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        registerIncome: builder.mutation({
            query: ({
                        billingPartyId,
                        date,
                        remarks,
                        amount,
                    }) => ({
                url: 'income',
                method: 'POST',
                body: {
                    billingPartyId,
                    date,
                    remarks,
                    amount
                }
            }),

            invalidatesTags: ['Incomes', 'BillingParty']
        })
    })
});

export const {useRegisterIncomeMutation} = incomeApi;