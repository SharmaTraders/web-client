import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedItem,
    setSelectedItem,
} from "../../../redux/features/state/itemState";
import {useGetItemsQuery} from "../../../redux/features/api/itemApi";
import {Avatar, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import stringAvatar from "../../../utils/stringAvatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';


function ItemList() {
    const [sort, setSort] = useState("");
    const dispatch = useDispatch()
    const selectedItem = useSelector(selectSelectedItem)
    const {data, isLoading, error} = useGetItemsQuery();
    const [searchQuery, setSearchQuery] = useState("");

    if (isLoading) {
        const mockSkeletonsAmount = 5;
        return Array.from({length: mockSkeletonsAmount}, (_, index) => (
            <ItemCardSkeleton key={index}/>
        ));
    }

    if (error) {
        return <div> Something went wrong </div>
    }

    let items = data.items; // Clone items to a new array for manipulation

    if (items.length === 0) {
        return <div>No items found. You can add a new item by clicking the Add Item button above.</div>
    }

    if (items.length > 0 && !selectedItem) {
        dispatch(setSelectedItem(data.items[0]));
    }

    function setSelected(item) {
        dispatch(setSelectedItem(item));
    }

    let itemsToShow = items;


    if (sort === "NameAsc") {
        items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "NameDesc") {
        items.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "AmountAsc") {
        items.sort((a, b) => a.amount - b.amount);
    } else if (sort === "AmountDesc") {
        items.sort((a, b) => b.amount - a.amount);
    }
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (searchQuery !== "") {
        itemsToShow = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    function getClassName(item) {
        if (!item) return "item-card";
        return item.id === selectedItem.id ? "item-card item-selected" : "item-card";
    }

    return <>
        <div className={"item-list-filter"}>
            <TextField
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                margin="dense"
                fullWidth
                size="small"
                label="Search"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                }}
            />

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
                    <MenuItem value="Latest">Latest</MenuItem>
                    <MenuItem value="NameAsc">Name (A - Z)</MenuItem>
                    <MenuItem value="NameDesc">Name (Z - A)</MenuItem>
                    <MenuItem value="AmountAsc">Balance (High - Low)
                    </MenuItem>
                    <MenuItem value="AmountDesc">Balance (Low - High)</MenuItem>
                </Select>
            </FormControl>
        </div>

        <div className={"item-list"}>
            {
                itemsToShow.map((item) =>
                    <div className={getClassName(item)}
                         onClick={() => setSelected(item)}>
                        <ItemCard key={item.id} item={item}/>
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
                {/*{item.quantity} kg*/}
                10 Kg
            </div>
            <div className={"item-balance"}>
                {/*Estimated Value: Rs. {item.estimatedValue}*/}
                Rs. 1000
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