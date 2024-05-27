import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedCategory, setSelectedCategory} from "../../../redux/features/state/expenseCategoryState";
import {useGetAllCategoriesQuery} from "../../../redux/features/api/expenseCategoryApi";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import Avatar from "@mui/material/Avatar";

function ExpenseCategoryList() {
    const [sort, setSort] = useState("name asc");
    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch();
    const selectedCategory = useSelector(selectSelectedCategory);

    const {data, isLoading, error} = useGetAllCategoriesQuery();

    if (isLoading) {
        const mockSkeletonCount = 5;
        return Array.from({length: mockSkeletonCount}, (_, index) => (
            <CategoryCardSkeleton key={index}/>
        ));
    }

    if (error) {
        return <div> Something went wrong...</div>
    }

    const categories = data?.categories || [];

    if (categories.length === 0) {
        return <div>
            No categories found. You can add a new category by clicking the Add Category button above.
        </div>
    }


    function getClassName(billingParty) {
        if (!selectedCategory) return "bp-card";
        return selectedCategory === billingParty ? "bp-card bp-selected" : "bp-card";
    }

    const billingPartyCategory = categories.filter(category => category.toLowerCase() === "billing party");
    const salaryCategory = categories.filter(category => category.toLowerCase() === "salary")
    const others = categories.filter(category => category.toLowerCase() !== "billing party" &&
        category.toLowerCase() !== "salary");

    let categoriesToShow = [...others];

    if (sort === "name asc") {
        categoriesToShow = categoriesToShow.sort((a, b) => a.localeCompare(b));

    } else if (sort === "name desc") {
        categoriesToShow = categoriesToShow.sort((a, b) => b.localeCompare(a));

    }

    if (searchString) {
        categoriesToShow = categoriesToShow.filter(category => category.toLowerCase().includes(searchString.toLowerCase()));
    }

    categoriesToShow = [...billingPartyCategory, ...salaryCategory, ...categoriesToShow];

    function setSelected(category) {
        dispatch(setSelectedCategory(category));
    }

    return <>
        <div className={"bp-list-filter"}>
            <TextField
                type="Search"
                margin="dense"
                fullWidth
                size={"small"}
                onChange={(e) => {
                    setSearchString(e.target.value)
                }
                }
                required
                label="Search"
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>,
                }}/>

            <FormControl sx={{m: 1, minWidth: 140, ml: -0.25, borderRight: "none"}} size="small">
                <InputLabel id="sort-label">Sort</InputLabel>

                <Select
                    labelId="sort-label"
                    label="Sort"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value)
                    }}
                    IconComponent={SortIcon}
                >
                    <MenuItem value={"name asc"} selected>
                        Name (A - Z)
                    </MenuItem>

                    <MenuItem value={"name desc"}>
                        Name (Z - A)
                    </MenuItem>

                </Select>
            </FormControl>
        </div>

        <div className="page-list">
            {categoriesToShow.map((category, index) => (
                <div key={index} className={getClassName(category)} onClick={() => setSelected(category)}>
                    <div className={"item-info"}>
                        <CategoryCard category={category}/>
                    </div>
                </div>
            ))}
        </div>

    </>
}

function CategoryCard({category}) {
    return <>
        <div className={"item-info"}>
            <Avatar variant="circular">
                {category.charAt(0)}
            </Avatar>
            <div>
                {category}
            </div>

        </div>

    </>
}

function CategoryCardSkeleton() {
    return <>
        <div className={"item-info"}>
            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
        </div>
    </>

}

export default ExpenseCategoryList;