import {baseApi} from "./setup";

const expenseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getExpenseByCategory: builder.query({
            query: ({
                        categoryName,
                        pageNumber,
                        pageSize
                // The toLowerCase() is an hack rn, it doesnt work without it for some reason, but have no time to look into details
                    }) => `expenses?category=${categoryName.toLowerCase()}&pageNumber=${pageNumber}&pageSize=${pageSize}`,

            forceRefetch({currentArg, previousArg}) {
                return currentArg !== previousArg;
            },

            providesTags: (result, error, arg) => {
                return [{type: 'Expenses', id: arg.categoryName}];
            }
        }),

        registerExpense: builder.mutation({
            query: ({
                        billingPartyId,
                        date,
                        remarks,
                        amount,
                        categoryName,
                employeeId
                    }) => ({
                url: 'expenses',
                method: 'POST',
                body: {
                    billingPartyId,
                    date,
                    remarks,
                    amount,
                    category: categoryName,
                    employeeId
                }
            }),

            invalidatesTags: (result, error, arg) => [{
                type: "Expenses",
                id: arg.billingPartyId
            }, 'BillingParty', "Employee"]
        })
    })
});

export const {useGetExpenseByCategoryQuery, useRegisterExpenseMutation} = expenseApi;