import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedBillingPartyIndex,
    setSelectedBillingPartyIndex
} from "../../../redux/features/state/billingPartyState";
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {toast} from "react-toastify";
import {Avatar} from "@mui/material";
import {getCurrentTheme} from "../../themes/Theme";
import React from "react";
import Skeleton from '@mui/material/Skeleton';
import {useNavigate} from "react-router-dom";


function BillingPartyList() {
    const dispatch = useDispatch()
    const selectedIndex = useSelector(selectSelectedBillingPartyIndex)
    const {data, isLoading, error} = useGetBillingPartiesQuery();
    const navigate = useNavigate();

    if (isLoading) {
        const mockSkeletonsAmount = 8;
        return Array.from({length: mockSkeletonsAmount}, (_, index) => (
            <BillingPartyCardSkeleton key={index}/>
        ));
    }

    if (error) {
        // if (error.status === 401) {
        //     toast.error("You need to login to view that page", {
        //         toastId: "loadingBillingParty",
        //         autoClose: 8000
        //     })
        //     navigate("/signin");
        //     return;
        // }
        // console.log(error);
        // toast.error(error.data, {
        //     toastId: "loadingBillingParty",
        //     autoClose: false
        // })
        return <div> Something went wrong </div>
    }

    if (!data) return;
    const billingParties = data.billingParties;

    if (billingParties.length === 0) {
        return <div>
            No billing parties found. You can add a new party by clicking the Add Party button above.
        </div>
    }

    function getClassName(index) {
        return index === selectedIndex ? "bp-card bp-selected" : "bp-card";
    }


    function setSelectedIndex(index) {
        dispatch(setSelectedBillingPartyIndex(index))
    }


    return <>
        {
            billingParties.map((billingParty, index) =>
                <div className={getClassName(index)}
                     onClick={() => setSelectedIndex(index)}>
                    <BillingPartyCard key={billingParty.id}
                                      billingParty={billingParty}
                                      onClick={() => setSelectedIndex(index)}
                                      isSelected={index === selectedIndex}/>
                </div>
            )
        }
    </>
}

function BillingPartyCard({billingParty, isSelected}) {
    return <>
        <div className={"bp-info"}>
            <Avatar
                variant={"circular"}
                {...stringAvatar(billingParty.name)}/>
            <div> {billingParty.name}</div>
        </div>

        <div className={"bp-balance"}>
            Rs. {billingParty.balance}
        </div>
    </>

}

function BillingPartyCardSkeleton() {
    return <>
        <div className={"bp-info"}>
            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
            <Skeleton animation="wave" variant="text" sx={{fontSize: getCurrentTheme().typography.fontSize}}/>
        </div>

        <div className={"bp-balance"}>
            <Skeleton animation="wave" variant="text" sx={{fontSize: getCurrentTheme().typography.fontSize}}/>
        </div>
    </>

}

function stringAvatar(name) {

    let initials;
    if (name.includes(' ')) {
        initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase();
    } else {
        initials = name.substring(0, 1).toUpperCase();
    }
    return {
        sx: {
            bgcolor: getCurrentTheme().palette.primary.light,
        },
        children: initials,
    };
}

export default BillingPartyList;
