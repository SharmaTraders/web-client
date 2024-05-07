import {toast} from "react-toastify";
import {Avatar} from "@mui/material";
import stringAvatar from "../../../utils/stringAvatar";
import {getCurrentTheme} from "../../themes/Theme";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

function BillingPartyDetailsInfoCard({party}) {

    if (!party) return <BillingPartyDetailsInfoCardSkeleton/>

    function getClassName() {
        if (party.balance === 0) return "bold"
        if (party.balance < 0) return "negative-balance bold"
        return "positive-balance bold"
    }

    function getStatus() {
        if (party.balance === 0) return "Settled"
        if (party.balance < 0) return "To Pay"
        return "To Recieve"
    }

    function onEdit() {
        toast.info(" Edit is not implemented yet", {
            toastId: "edit-not-implemented",
            autoClose: 5000
        })
    }


    return <div className={"bp-details-card"}>
        <div className={"bp-details-card-info"}>
            <div className={"bp-details-card-1"}>
                <Avatar
                    variant={"rounded"}
                    {...stringAvatar(party.name)}
                    sx={
                        {
                            width: "60px",
                            height: "60px",
                            backgroundColor: getCurrentTheme().palette.primary.light
                        }}/>

                <div className={"bp-details-card-avatar"}>
                    <div className={"bold"}> {party.name}</div>
                    <div className={"secondary-text"}>
                        <PhoneIcon sx={{fontSize: "0.9rem"}}/>
                        {party.phoneNumber || "Phone not set"}
                    </div>
                    <div className={"secondary-text"}>
                        <EmailIcon sx={{fontSize: "0.9rem"}}/>
                        {party.email || "Email not set"}
                    </div>
                </div>
            </div>

            <div className={"bp-details-card-2"}>
                <div className={getClassName()}>
                    Rs. {party.balance < 0 ? -1 * party.balance : party.balance}
                </div>
                <div className={"secondary-text " + getClassName()}>
                    {getStatus()}
                </div>
                <div className={"secondary-text"}>
                    <PlaceIcon sx={{fontSize: "0.9rem"}}/>
                    {party.address}
                </div>
            </div>
        </div>

        <div className={"bp-details-card-buttons"}>
            <Button variant="contained"
                    onClick={onEdit}
                    size={"small"}
                    color="primary"
                    startIcon={<EditIcon/>}>
                Edit
            </Button>

        </div>
    </div>

}


function BillingPartyDetailsInfoCardSkeleton() {
    return <div className={"bp-details-card"}>
        <div className={"bp-details-card-info"}>
            <div className={"bp-details-card-1"}>
                <Skeleton animation="wave" variant="rounded" width={40} height={40}/>
                <div className={"bp-details-card-avatar"}>
                    <Skeleton animation="wave" variant="rounded" width={100} height={10}/>

                    <Skeleton animation="wave" variant="rounded" width={100} height={10}/>

                    <Skeleton animation="wave" variant="rounded" width={100} height={10}/>

                </div>
            </div>

            <div className={"bp-details-card-2"}>
                <Skeleton animation="wave" variant="rounded" width={100} height={10}/>

                <Skeleton animation="wave" variant="rounded" width={100} height={10}/>

                <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
            </div>
        </div>

        <div className={"bp-details-card-buttons"}>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>

        </div>
    </div>
}

export default BillingPartyDetailsInfoCard;