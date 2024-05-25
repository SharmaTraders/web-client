import {selectSelectedEmployee} from "../../../redux/features/state/employeeState";
import {useSelector} from "react-redux";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import React, {useState} from "react";
import RegisterEmployeeWorkShift from "./RegisterEmployeeWorkShift";

function EmployeeWorkShiftComponent(){
    const [openModal, setOpenModal] = useState(false);

    function handleClose(){
        setOpenModal(false);
    }

    function handleOpen(){
        setOpenModal(true);
    }

    const selectedEmployee = useSelector(selectSelectedEmployee)
    if (!selectedEmployee) return <div className={"item-activity"}> Please select an employee to view work shifts</div>

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Work Shifts
            </div>
        </div>

        <div className={"item-activity-buttons"}>
            <Button
                variant = "contained"
                color = "primary"
                size = "small"
                onClick = {handleOpen}
                startIcon={<AddIcon/>}>

                Register WorkShift
            </Button>
            {
                openModal
                &&
                <RegisterEmployeeWorkShift mode={"add"} handleWorkShiftClose={handleClose} open={openModal}/>
            }
        </div>

        <div className={"item-activity-content"}>
            <div>
                History will be here
            </div>
        </div>
    </div>

}

export default EmployeeWorkShiftComponent;