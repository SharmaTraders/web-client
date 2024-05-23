import {baseApi} from "./setup";

const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTransactionsReport: builder.query({
            query: ({
                        dateFrom,
                        dateTo
                    }) => `reports/all-transactions?dateFrom=${dateFrom}&dateTo=${dateTo}`,

            // Always refetch the data because this is the report...
            forceRefetch: (params) => true,
        }),

        getStocksSummaryReport: builder.query({
            query: ({
                dateFrom,
                dateTo
            }) => `reports/stock-summary?fromDate=${dateFrom}&toDate=${dateTo}`,

            forceRefetch:(params) => true,
        }),

        getExpenseByCategoryReport: builder.query({
            query: ({
                dateFrom,
                dateTo
            }) => `reports/expense-by-category?dateFrom=${dateFrom}&dateTo=${dateTo}`,

            forceRefetch:(params) => true,

        })
    })

});

export const {useGetAllTransactionsReportQuery, useGetStocksSummaryReportQuery, useGetExpenseByCategoryReportQuery} = reportsApi;