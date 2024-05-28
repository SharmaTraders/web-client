import React, {useState} from "react";
import Button from "@mui/material/Button";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {BillingPartyTransactionsTableModal} from "./BillingPartyActivityComponent";

function BillingPartyActivityPhoneComponent(){
    const [openModal , setOpenModal] = useState(false);

    function onShowTransactions(){
        setOpenModal(true)
    }

    function handleClose(){
        setOpenModal(false);
    }

    return <>
        <Button variant="contained"
                onClick={onShowTransactions}
                size="small"
                color="secondary"
                startIcon={<ManageSearchIcon/>}
        >
            Recent Transactions
        </Button>

        {
            openModal
            &&
            <BillingPartyTransactionsTableModal open={openModal} handleClose={handleClose}/>

        }
    </>
}

export default BillingPartyActivityPhoneComponent;