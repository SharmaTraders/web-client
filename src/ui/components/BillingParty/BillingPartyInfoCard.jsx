import {Avatar} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {useState} from "react";
import ManageBillingPartyComponent from "./ManageBillingPartyComponent";
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";

function BillingPartyDetailsInfoCard() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const party = useSelector(selectSelectedBillingParty);

    if (!party) return <div>
        Please select a billing party for info
    </div>

    function getClassName() {
        if (party.balance === 0) return "bold"
        if (party.balance < 0) return "error-color bold"
        return "primary-color bold"
    }

    function getStatus() {
        if (party.balance === 0) return "Settled"
        if (party.balance < 0) return "To Pay"
        return "To Recieve"
    }

    function onEdit() {
        setOpenEditModal(true);
    }

    function handleClose() {
        setOpenEditModal(false);
    }


    return <div className={"bp-details-card"}>
        <div className={"bp-details-card-info"}>
            <div className={"bp-details-card-1"}>
                <Avatar
                    sx={
                        {
                            width: "80px",
                            height: "80px",
                        }}
                    variant={"rounded"}>
                    {party.name.charAt(0)}
                </Avatar>


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
                    <div className={"secondary-text"}>
                        <LocalPoliceIcon sx={{fontSize: "0.9rem"}}/>
                        {party.vatNumber || "Vat Number not set"}
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
            {
                party.name.toLowerCase() !== "cash" &&
                <Button variant="contained"
                        onClick={onEdit}
                        size={"small"}
                        color="primary"
                        startIcon={<EditIcon/>}>
                    Edit
                </Button>
            }

            {
                openEditModal
                &&
                <ManageBillingPartyComponent open={openEditModal} handleClose={handleClose} mode={"edit"}
                                             billingParty={party}/>

            }
        </div>
    </div>

}

export default BillingPartyDetailsInfoCard;