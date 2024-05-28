import React, {useState} from "react";
import Button from "@mui/material/Button";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {WorkShiftsTableModal} from "./EmployeeWorkShiftComponent";

function EmployeeWorkShiftsPhoneComponent() {
    const [openModal, setOpenModal] = useState(false);

    function onShowShifts() {
        setOpenModal(true);
    }

    function handleClose() {
        setOpenModal(false);
    }

    return <>
        <Button variant="contained"
                onClick={onShowShifts}
                size="small"
                color="secondary"
                startIcon={<ManageSearchIcon/>}>
            Work Shifts
        </Button>

        {
            openModal
            &&
            <WorkShiftsTableModal open={openModal} handleClose={handleClose}/>

        }
    </>
}

export default EmployeeWorkShiftsPhoneComponent;