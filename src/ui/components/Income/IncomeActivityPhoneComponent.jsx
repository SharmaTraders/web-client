import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {IncomesTableModal} from "./IncomeActivityComponent";

function IncomeActivityPhoneComponent() {
    const [openModal, setOpenModal] = useState(false);

    function onShowHistory() {
        setOpenModal(true);
    }

    function handleClose() {
        setOpenModal(false);
    }

    return <>
        <Button variant="contained"
                onClick={onShowHistory}
                size="small"
                color="primary"
                startIcon={<ManageSearchIcon/>}
        >
            Income History
        </Button>

        {
            openModal
            &&
            <IncomesTableModal open={openModal} handleClose={handleClose}/>

        }
    </>
}

export default IncomeActivityPhoneComponent;