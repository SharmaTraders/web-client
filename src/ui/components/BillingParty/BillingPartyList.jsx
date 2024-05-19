import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedBillingParty, setSelectedBillingParty
} from "../../../redux/features/state/billingPartyState";
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {Avatar, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';


function BillingPartyList() {
    const [sort, setSort] = useState("");
    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch()
    const selectedBillingParty = useSelector(selectSelectedBillingParty)
    const {data, isLoading, error} = useGetBillingPartiesQuery();

    if (isLoading) {
        const mockSkeletonsAmount = 5;
        return Array.from({length: mockSkeletonsAmount}, (_, index) => (
            <BillingPartyCardSkeleton key={index}/>
        ));
    }
    if (error) {
        return <div> Something went wrong </div>
    }
    if (!data) return;

    const billingParties = data.parties || [];


    if (billingParties.length === 0) {
        return <div>
            No billing parties found. You can add a new party by clicking the Add Party button above.
        </div>
    }

    function getClassName(billingParty) {
        if (!selectedBillingParty) return "bp-card";
        return billingParty.id === selectedBillingParty.id ? "bp-card bp-selected" : "bp-card";
    }

    const cashParty = billingParties.filter(party => party.name.toLowerCase() === "cash");
    const otherParties = billingParties.filter(party => party.name.toLowerCase() !== "cash");

    let billingPartiesToShow = [...otherParties];

    if (sort === "name asc") {
        billingPartiesToShow = billingPartiesToShow.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sort === "name desc"){
        billingPartiesToShow = billingPartiesToShow.sort((a, b) => b.name.localeCompare(a.name));

    }
    else if (sort === "balance desc") {
        billingPartiesToShow = billingPartiesToShow.sort((a, b) => b.balance - a.balance);
    } else if (sort === "balance asc") {
        billingPartiesToShow = billingPartiesToShow.sort((a, b) => a.balance - b.balance);
    }
    if (searchString) {
        billingPartiesToShow = billingPartiesToShow.filter(
            party => party.name.toLowerCase().includes(searchString.toLowerCase())
        )
    }
    billingPartiesToShow = [...cashParty, ...billingPartiesToShow];


    function setSelected(billingParty) {
        dispatch(setSelectedBillingParty(billingParty));
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
                    <MenuItem value={"latest"}>
                        Latest
                    </MenuItem>
                    <MenuItem value={"name asc"}>
                        Name (A - Z)
                    </MenuItem>

                    <MenuItem value={"name desc"}>
                        Name (Z - A)
                    </MenuItem>

                    <MenuItem value={"balance desc"}>
                        Balance (High - Low)
                    </MenuItem>

                    <MenuItem value={"balance asc"}>
                        Balance (Low - High)
                    </MenuItem>

                </Select>
            </FormControl>
        </div>

        <div className={"page-list"}>
            {
                billingPartiesToShow.map((billingParty) =>
                    <div key={billingParty.id} className={getClassName(billingParty)}
                         onClick={() => setSelected(billingParty)}>
                        <BillingPartyCard
                                          party={billingParty}
                                          isSelected={selectedBillingParty && billingParty.id === selectedBillingParty.id}/>
                    </div>
                )
            }
        </div>

    </>
}

function BillingPartyCard({party}) {

    function getClassName() {
        if (party.balance === 0) return ""
        if (party.balance < 0) return "error-color "
        return "primary-color "
    }

    function getStatus() {
        if (party.balance === 0) return "Settled"
        if (party.balance < 0) return "To Pay"
        return "To Recieve"
    }

    return <>
        <div className={"bp-info"}>
            <Avatar
                variant={"circular"}
                >
                {party.name.charAt(0)}
            </Avatar>
            <div> {party.name}</div>
        </div>

        <div className={"bp-balance"}>
            <div className={"bold " + getClassName()}>
                Rs. {party.balance < 0 ? -party.balance : party.balance}
            </div>
            <div className={"secondary-text " + getClassName()}>
                {getStatus()}
            </div>
        </div>

    </>

}

function BillingPartyCardSkeleton() {
    return <>
        <div className={"bp-info"}>
            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
        </div>

        <div className={"bp-balance"}>
            <div>
                <Skeleton animation="wave" variant="rounded" width={40} height={10}/>

            </div>
            <div>
                <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
            </div>
        </div>
    </>

}


export default BillingPartyList;
