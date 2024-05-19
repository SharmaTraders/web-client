import {baseApi} from "./setup";

const incomeApi = baseApi.injectEndpoints({
        endpoints: (builder) => ({

            getIncomesByBillingParty: builder.query({
                query: ({
                            billingPartyId,
                            pageNumber,
                            pageSize
                        }) => `billing-party/${billingPartyId}/incomes?pageNumber=${pageNumber}&pageSize=${pageSize}`,

                forceRefetch({currentArg, previousArg}) {
                    return currentArg !== previousArg;
                },

                providesTags: (result, error, arg) => {
                    return [{type: 'Incomes', id: arg.billingPartyId}];
                }
            }),

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

                invalidatesTags: (result, error, arg) => [ {
                    type: "Incomes",
                    id: arg.billingPartyId
                },'Incomes', 'BillingParty']
            })
        })
    })
;

export const {useGetIncomesByBillingPartyQuery,useRegisterIncomeMutation} = incomeApi;