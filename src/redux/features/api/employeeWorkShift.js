import { baseApi } from "./setup";

const workShiftApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerWorkShift: builder.mutation({
            query: ({ id,startTime, endTime, date, breakInMinutes }) => ({
                url: `employees/${id}/work-shift`,
                method: 'POST',
                body: {
                    startTime,
                    endTime,
                    date,
                    breakInMinutes
                }
            }),
            invalidatesTags: ['WorkShift']
        }),

        getEmployeeWorkShifts: builder.query({
            query:
                ({employeeId, pageNumber, pageSize}) =>
                `employees/${employeeId}/work-shifts?pageNumber=${pageNumber}&pageSize=${pageSize}`,

            forceRefetch({currentArg, previousArg}) {
                return currentArg !== previousArg;
            },

            providesTags: ['WorkShift']
        })
    })
});

export const {
     useRegisterWorkShiftMutation,
    useGetEmployeeWorkShiftsQuery
} = workShiftApi;
