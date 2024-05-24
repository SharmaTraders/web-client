import React, {useState} from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {isMobile} from "../../../utils/SystemInfo";
import ManageEmployeeComponent from "../../components/Employee/ManageEmployeeComponent";
import EmployeeList from "../../components/Employee/EmployeeList";
import "./Employee.css";
import EmployeeDetailInfoCard from "../../components/Employee/EmployeeDetailInfoCard";
function Employee() {
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
                All Employee
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size="small"
                    startIcon={<AddIcon/>}>
                Add Employee
            </Button>
            {
                openAddModal &&
                <ManageEmployeeComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
            }
        </div>

        <div className={"page-content"}>
            <div className={"page-list"}>
                <EmployeeList/>
            </div>
            <div className={"page-details"}>
                <div className={"page-details-info"}>
                    <EmployeeDetailInfoCard/>

                </div>

                {!isMobile() && (
                    <div className={"employee-details-history"}>
                        <p>
                            Party transaction list is not implemented yet...
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
}

export default Employee;