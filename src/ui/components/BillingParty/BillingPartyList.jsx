import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedBillingParty,
    selectSelectedBillingPartyIndex, setSelectedBillingParty,
    setSelectedBillingPartyIndex
} from "../../../redux/features/state/billingPartyState";
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {Avatar, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import stringAvatar from "../../../utils/stringAvatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';


function BillingPartyList() {
    const [sort , setSort] = useState("");
    const dispatch = useDispatch()
    const selectedIndex = useSelector(selectSelectedBillingPartyIndex)
    const selectedBillingParty = useSelector(selectSelectedBillingParty)
    const {data, isLoading, error} = useGetBillingPartiesQuery();

    if (isLoading) {
        const mockSkeletonsAmount = 5;
        return Array.from({length: mockSkeletonsAmount}, (_, index) => (
            <BillingPartyCardSkeleton key={index}/>
        ));
    }

    const billingParties = data.billingParties;
    if (billingParties.length > 0) {
        if (!selectedBillingParty){
            dispatch(setSelectedBillingParty(billingParties[0]));
        }
    }

    if (error) {
        return <div> Something went wrong </div>
    }

    if (!data) return;

    if (billingParties.length === 0) {
        return <div>
            No billing parties found. You can add a new party by clicking the Add Party button above.
        </div>
    }

    function getClassName(index) {
        return index === selectedIndex ? "bp-card bp-selected" : "bp-card";
    }


    function setSelected(index) {
        dispatch(setSelectedBillingPartyIndex(index))
        dispatch(setSelectedBillingParty(billingParties[index]));
    }


    let billingPartiesToShow = billingParties;

    if (sort === "name"){
        billingPartiesToShow = billingPartiesToShow.sort((a,b) => a.name.localeCompare(b.name));
    }
    else if (sort === "balance desc"){
        billingPartiesToShow = billingPartiesToShow.sort((a,b) => b.balance- a.balance);
    }
    else if (sort === "balance asc"){
        billingPartiesToShow = billingPartiesToShow.sort((a,b) => a.balance -b.balance);
    }

    function handleChange(value){
        console.log("Changed to "+ value);
        billingPartiesToShow = billingParties.filter(
            party => party.name.toLowerCase().includes(value.toLowerCase())
        )

    }

    return <>
        <div className={"bp-list-filter"}>
            <TextField
                type = "Search"
                margin="dense"
                fullWidth
                size={"small"}
                onChange={(e) => {
                    handleChange(e.target.value);
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


            <FormControl sx={{ m: 1, minWidth: 140 , ml: -0.25, borderRight: "none"}} size="small">
                <InputLabel id="sort-label">Sort</InputLabel>

                <Select
                    labelId="sort-label"
                    label = "Sort"
                    value={sort}
                    onChange={(e) => {setSort(e.target.value)}}
                    IconComponent={SortIcon}
                >
                    <MenuItem value={""}>
                       <em> None</em>
                    </MenuItem>
                    <MenuItem value={"name"}>
                        Name
                    </MenuItem>
                    <MenuItem value={"balance desc"}>
                        Balance desc
                    </MenuItem>

                    <MenuItem value={"balance asc"}>
                        Balance asc
                    </MenuItem>

                </Select>
            </FormControl>
        </div>

        <div className={"bp-list"}>
            {
                billingPartiesToShow.map((billingParty, index) =>
                    <div className={getClassName(index)}
                         onClick={() => setSelected(index)}>
                        <BillingPartyCard key={billingParty.id}
                                          party={billingParty}
                                          onClick={() => setSelected(index)}
                                          isSelected={index === selectedIndex}/>
                    </div>
                )
            }
        </div>

    </>
}

function BillingPartyCard({party}) {

    function getClassName(){
        if (party.balance ===0) return ""
        if (party.balance < 0) return "negative-balance "
        return "positive-balance "
    }
    function getStatus(){
        if (party.balance ===0) return "Settled"
        if (party.balance < 0) return "To Pay"
        return "To Recieve"
    }
    return <>
        <div className={"bp-info"}>
            <Avatar
                variant={"circular"}
                {...stringAvatar(party.name)}/>
            <div> {party.name}</div>
        </div>

        <div className={"bp-balance"}>
            <div className={"bold "+ getClassName()}>
                Rs. {party.balance < 0 ? -party.balance : party.balance}
            </div>
            <div className={"secondary-text "+ getClassName()}>
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
