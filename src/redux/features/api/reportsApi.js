import {baseApi} from "./setup";

const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllTransactionsReport: builder.query({
            query: ({
                        dateFrom,
                        dateTo
                    }) => `reports/all-transactions?dateFrom=${dateFrom}&dateTo=${dateTo}`,

            // Always refetch the data because this is the report...
            forceRefetch: ({currentArg, previousArg}) => true,
        })
    })

});

export const {useGetAllTransactionsReportQuery} = reportsApi;