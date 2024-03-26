import {baseApi} from "./setup";

const billingPartyApi = baseApi
    .injectEndpoints({
        endpoints: (builder) => ({
            createBillingParty: builder.mutation({
                query: ({
                            name,
                            address,
                            phoneNumber,
                            openingBalance,
                            email,
                            vatNumber
                        }) => ({
                    url: 'billingparty',
                    method: 'POST',
                    body: {
                        name,
                        address,
                        phoneNumber,
                        openingBalance,
                        email,
                        vatNumber
                    }
                }),
                invalidatesTags: ['BillingParty']
            }),

            getBillingParties: builder.query({
                query: () => "billingparty",
                providesTags: ['BillingParty'],
            })
        })
    });

export const {useCreateBillingPartyMutation, useGetBillingPartiesQuery} = billingPartyApi;