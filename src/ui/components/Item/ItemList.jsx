import { useDispatch, useSelector } from "react-redux";
import {
    selectSelectedItem,
    selectSelectedItemIndex,
    setSelectedItem,
    setSelectedItemIndex
} from "../../../redux/features/state/itemState";
import { useGetItemsQuery } from "../../../redux/features/api/itemApi";
import { Avatar, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import stringAvatar from "../../../utils/stringAvatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';


function ItemList() {
    const [sort, setSort] = useState("");
    const dispatch = useDispatch()
    const selectedIndex = useSelector(selectSelectedItemIndex)
    const selectedItem = useSelector(selectSelectedItem)
    const {data, isLoading, error} = useGetItemsQuery();

    if (isLoading) {
        const mockSkeletonsAmount = 5;
        return Array.from({length: mockSkeletonsAmount}, (_, index) => (
            <ItemCardSkeleton key={index}/>
        ));
    }

    const items = data?.items || [];

    if (items.length > 0 && !selectedItem) {
        dispatch(setSelectedItem(items[0]));
    }

    if (error) {
        return <div> Something went wrong </div>
    }

    if (items.length === 0) {
        return <div>No items found. You can add a new item by clicking the Add Item button above.</div>
    }

    function setSelected(index) {
        dispatch(setSelectedItemIndex(index))
        dispatch(setSelectedItem(items[index]));
    }

    let itemsToShow = items;

    if (sort === "name") {
        itemsToShow = itemsToShow.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "quantity desc") {
        itemsToShow = itemsToShow.sort((a, b) => b.quantity - a.quantity);
    } else if (sort === "quantity asc") {
        itemsToShow = itemsToShow.sort((a, b) => a.quantity - b.quantity);
    }

    function handleChange(value) {
        console.log("Changed to " + value);
        itemsToShow = items.filter(
            item => item.name.toLowerCase().includes(value.toLowerCase())
        )
    }

    return <>
        <div className={"item-list-filter"}>
            <TextField
                type="search"
                margin="dense"
                fullWidth
                size={"small"}
                onChange={(e) => handleChange(e.target.value)}
                label="Search"
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>,
                }}/>

            <FormControl sx={{ m: 1, minWidth: 140, ml: -0.25, borderRight: "none" }} size="small">
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                    labelId="sort-label"
                    label="Sort"
                    value={sort}
                    onChange={(e) => {setSort(e.target.value)}}
                    IconComponent={SortIcon}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="quantity desc">Quantity Desc</MenuItem>
                    <MenuItem value="quantity asc">Quantity Asc</MenuItem>
                </Select>
            </FormControl>
        </div>

        <div className={"item-list"}>
            {
                itemsToShow.map((item, index) =>
                    <div onClick={() => setSelected(index)} key={item.id} className={selectedIndex === index ? "item-card item-selected" : "item-card"}>
                        <ItemCard
                            item={item}
                            isSelected={index === selectedIndex}
                        />
                    </div>
                )
            }
        </div>
    </>
}

function ItemCard({item}) {
    return <>
        <div className={"item-info"}>
            <Avatar
                variant={"circular"}
                {...stringAvatar(item.name)}/>
            <div> {item.name}</div>
        </div>

        <div className={"item-details-card-2"}>
            <div className={"item-balance"}>
                {/*Quantity: {item.quantity}*/}
                Quantity: 10
            </div>
            <div className={"item-balance"}>
                {/*Estimated Value: Rs. {item.estimatedValue}*/}
                Estimated Value: Rs. 1000
            </div>
        </div>
    </>
}

function ItemCardSkeleton() {
    return <>
        <div className={"item-info"}>
            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
            <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
        </div>

        <div className={"item-details"}>
            <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
            <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
        </div>
    </>
}

export default ItemList;