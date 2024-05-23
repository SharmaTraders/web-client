// employeeApi.js
import { baseApi } from "./setup";

const employeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addEmployee: builder.mutation({
            query: ({ name, address, phoneNumber, email, openingBalance, normalDailyWorkingHours, salaryPerHour, overtimeSalaryPerHour }) => ({
                url: 'employee',
                method: 'POST',
                body: {
                    name,
                    address,
                    phoneNumber,
                    email,
                    openingBalance,
                    normalDailyWorkingHours,
                    salaryPerHour,
                    overtimeSalaryPerHour
                }
            }),
            invalidatesTags: ['Employee']
        }),

        getEmployees: builder.query({
            query: () => `employees`,
            providesTags: ['Employee']
        }),

    })
});

export const {
    useAddEmployeeMutation,
    useGetEmployeesQuery,
} = employeeApi;
