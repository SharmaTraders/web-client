import React, {useState} from "react";
import "./BillingParty.css"
import AddIcon from '@mui/icons-material/Add';
import AddOrEditBillingPartyComponent from "../../components/BillingParty/AddOrEditBillingPartyComponent";
import Button from "@mui/material/Button";
import BillingPartyList from "../../components/BillingParty/BillingPartyList";
import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import BillingPartyDetailsInfoCard from "../../components/BillingParty/BillingPartyInfoCard";


function BillingPartiesPage() {
    const [openAddModal, setOpenAddModal] = useState(false);
    const selectedBillingParty = useSelector(selectSelectedBillingParty);


    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div className={"billing-party-page"}>
        <div className={"bp-header"}>
            <h3>
                All Parties
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size={"small"}
                    startIcon={<AddIcon/>}>
                Add Party
            </Button>
            <AddOrEditBillingPartyComponent open={openAddModal} handleClose={handleClose}/>
        </div>

        <div className={"bp-content"}>
            <div className={"bp-list"}>
                <BillingPartyList/>
            </div>
            <div className={"bp-details"}>
                <div className={"bp-details-info"}>
                    <BillingPartyDetailsInfoCard party={selectedBillingParty}/>

                </div>

                <div className={"bp-details-history"}>
                    <p>
                        Party transaction list is not implemented yet...
                    </p>
                </div>
            </div>
        </div>
    </div>
}




export default BillingPartiesPage;