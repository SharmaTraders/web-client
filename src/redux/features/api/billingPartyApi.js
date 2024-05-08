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
                query: () => `billingparty`,
                providesTags: ['BillingParty'],
            }),
            updateBillingParty: builder.mutation({
                query: ({
                            id,
                            name,
                            address,
                            phoneNumber,
                            email,
                            vatNumber
                        }) => ({
                    url: `billingparty/${id}`,
                    method: 'PUT',
                    body: {
                        name,
                        address,
                        phoneNumber,
                        email,
                        vatNumber
                    }
                }),
                invalidatesTags: ['BillingParty']
            })
        })
    });

export const {
    useCreateBillingPartyMutation,
    useGetBillingPartiesQuery,
    useUpdateBillingPartyMutation
} = billingPartyApi;