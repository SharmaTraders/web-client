// employeeApi.js
import { baseApi } from "./setup";

const employeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addEmployee: builder.mutation({
            query: ({ name, address, phoneNumber, email, openingBalance, normalDailyWorkingMinute, salaryPerHour, overtimeSalaryPerHour }) => ({
                url: 'employees',
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

        getAllEmployees: builder.query({
            query: () => `employees`,
            providesTags: ['Employee']
        }),

        updateSalary: builder.mutation({
            query: ({employeeId, startDate, salaryPerHour, overtimeSalaryPerHour }) => ({
                url: `employees/${employeeId}/salary`,
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
    useGetAllEmployeesQuery,
    useUpdateSalaryMutation
} = employeeApi;
