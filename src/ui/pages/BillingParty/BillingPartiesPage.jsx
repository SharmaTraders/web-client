import React, {useState} from "react";
import "./BillingParty.css"
import AddIcon from '@mui/icons-material/Add';
import ManageBillingPartyComponent from "../../components/BillingParty/ManageBillingPartyComponent";
import Button from "@mui/material/Button";
import BillingPartyList from "../../components/BillingParty/BillingPartyList";
import BillingPartyDetailsInfoCard from "../../components/BillingParty/BillingPartyInfoCard";
import {isMobile} from "../../../utils/SystemInfo";


function BillingPartiesPage() {
    const [openAddModal, setOpenAddModal] = useState(false);


    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                All Parties
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size="small"
                    startIcon={<AddIcon/>}>
                Add Party
            </Button>
            {
                openAddModal &&
                <ManageBillingPartyComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
            }
        </div>

        <div className={"page-content"}>
            <div className={"page-list"}>
                <BillingPartyList/>
            </div>
            <div className={"page-details"}>
                <div className={"page-details-info"}>
                    <BillingPartyDetailsInfoCard/>

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