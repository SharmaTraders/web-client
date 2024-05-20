import {baseApi} from "./setup";

const expenseCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder ) => ({
        getAllCategories: builder.query({
            query: () =>"expense-category",
            provideTags: ["ExpenseCategory"]
        }),

        addCategory: builder.mutation({
            query: (categoryName) => ({
                url: "expense-category",
                method: "POST",
                body: {name: categoryName}
            }),
            invalidatesTags: ["ExpenseCategory"]
        }),

    })
});

export const {useGetAllCategoriesQuery, useAddCategoryMutation} = expenseCategoryApi;