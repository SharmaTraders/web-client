import React, {useState} from "react";
import "./BillingParty.css"
import AddIcon from '@mui/icons-material/Add';
import ManageBillingPartyComponent from "../../components/BillingParty/ManageBillingPartyComponent";
import Button from "@mui/material/Button";
import BillingPartyList from "../../components/BillingParty/BillingPartyList";
import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import BillingPartyDetailsInfoCard from "../../components/BillingParty/BillingPartyInfoCard";
import {isMobile} from "../../../utils/SystemInfo";


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
            {
                openAddModal &&
                <ManageBillingPartyComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>

            }
        </div>

        <div className={"bp-content"}>
            <div className={"bp-list"}>
                <BillingPartyList/>
            </div>
            <div className={"bp-details"}>
                <div className={"bp-details-info"}>
                    <BillingPartyDetailsInfoCard party={selectedBillingParty}/>

                </div>

                {!isMobile() && (
                    <div className={"bp-details-history"}>
                        <p>
                            Party transaction list is not implemented yet...
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
}

export default BillingPartiesPage;