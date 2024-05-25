// employeeApi.js
import { baseApi } from "./setup";

const employeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addEmployee: builder.mutation({
            query: ({ name, address, phoneNumber, email, openingBalance, normalDailyWorkingMinute, salaryPerHour, overtimeSalaryPerHour }) => ({
                url: 'employee',
                method: 'POST',
                body: {
                    name,
                    address,
                    phoneNumber,
                    email,
                    openingBalance,
                    normalDailyWorkingMinute,
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

        updateSalary: builder.mutation({
            query: ({employeeId, startDate, salaryPerHour, overtimeSalaryPerHour }) => ({
                url: `employee/${employeeId}/salary`,
                method: 'PATCH',
                body: {
                    startDate,
                    salaryPerHour,
                    overtimeSalaryPerHour
                }
            }),
        })

    })
});

export const {
    useAddEmployeeMutation,
    useGetEmployeesQuery,
    useUpdateSalaryMutation
} = employeeApi;
