import { baseApi } from "./setup";

const timeRecordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerWorkShift: builder.mutation({
            query: ({ id,startTime, endTime, date, breakInMinutes }) => ({
                url: `employee/${id}/work-shift`,
                method: 'POST',
                body: {
                    startTime,
                    endTime,
                    date,
                    breakInMinutes
                }
            }),
            invalidatesTags: ['WorkShift', 'Employee']
        }),
    })
});

export const {
     useRegisterWorkShiftMutation
} = timeRecordApi;
