import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedBillingParty,
    selectSelectedBillingPartyIndex, setSelectedBillingParty,
    setSelectedBillingPartyIndex
} from "../../../redux/features/state/billingPartyState";
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {Avatar} from "@mui/material";
import React from "react";
import Skeleton from '@mui/material/Skeleton';
import stringAvatar from "../../../utils/stringAvatar";


function BillingPartyList() {
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


    return <>
        {
            billingParties.map((billingParty, index) =>
                <div className={getClassName(index)}
                     onClick={() => setSelected(index)}>
                    <BillingPartyCard key={billingParty.id}
                                      party={billingParty}
                                      onClick={() => setSelected(index)}
                                      isSelected={index === selectedIndex}/>
                </div>
            )
        }
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
