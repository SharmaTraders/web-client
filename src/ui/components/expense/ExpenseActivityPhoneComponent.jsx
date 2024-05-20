import React, {useState} from "react";
import Button from "@mui/material/Button";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {ExpenseTableModal} from "./ExpenseActivityComponent";

function ExpenseActivityPhoneComponent(){
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
            Expense History
        </Button>

        {
            openModal
            &&
            <ExpenseTableModal open={openModal} handleClose={handleClose}/>

        }
    </>

}
export default ExpenseActivityPhoneComponent;