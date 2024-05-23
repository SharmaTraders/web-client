import {Avatar} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {useState} from "react";
import {useSelector} from "react-redux";
import {selectSelectedEmployee} from "../../../redux/features/state/employeeState";
import ManageEmployeeComponent from "./ManageEmployeeComponent";
import AddIcon from "@mui/icons-material/Add";
import RegisterEmployeeWorkShift from "./RegisterEmployeeWorkShift";

function EmployeeDetailInfoCard() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddTimeRecordModal, setOpenAddTimeRecordModal] = useState(false);

    const employee = useSelector(selectSelectedEmployee);

    if (!employee) return <div>
        Please select a Employee for info
    </div>

    function getClassName() {
        if (employee.status.toString().toLowerCase()=== "active") {
            return "primary-color";
        }
        else {
            return "error-color";
        }
    }

    function getBalanceClassName() {
        if(employee.balance === 0) return "bold"
        if(employee.balance < 0) return "primary-color bold"
        return "error-color bold"
    }

    function onEdit() {
        setOpenEditModal(true);
    }

    function handleClose() {
        setOpenEditModal(false);
    }

    function handleWorkShiftClose() {
        setOpenAddTimeRecordModal(false);
    }

    function onAddTimeRecord() {
        setOpenAddTimeRecordModal(true);
    }



    return <div className={"employee-details-card"}>
        <div className={"employee-details-card-info"}>
            <div className={"employee-details-card-1"}>
                <Avatar
                    sx={
                        {
                            width: "80px",
                            height: "80px",
                        }}
                    variant={"rounded"}>
                    {employee.name.charAt(0)}
                </Avatar>


                <div className={"bp-details-card-avatar"}>
                    <div className={`bold ${getClassName()} `}> {employee.name}</div>
                    <div className={"secondary-text"}>
                        <PhoneIcon sx={{fontSize: "0.9rem"}}/>
                        {employee.phoneNumber || "Phone not set"}
                    </div>
                    <div className={"secondary-text"}>
                        <EmailIcon sx={{fontSize: "0.9rem"}}/>
                        {employee.email || "Email not set"}
                    </div>
                </div>
            </div>

            <div className={"bp-details-card-2"}>
                <div className={`${getBalanceClassName()} `}>
                    {employee.balance < 0 ? -1 * employee.balance : employee.balance}
                </div>
                <div className={"secondary-text " + getBalanceClassName()}>
                    {employee.balance < 0 ? "To Receive" : (employee.balance > 0 ? "To Pay" : "Settled")}
                </div>
                <div className={"secondary-text"}>
                    <PlaceIcon sx={{fontSize: "0.9rem"}}/>
                    {employee.address}
                </div>
            </div>
        </div>


        <div className={"bp-details-card-buttons"}>
            {
                <Button variant="contained"
                        onClick={onAddTimeRecord}
                        size={"small"}
                        color="primary"
                        startIcon={<AddIcon/>}>
                    Register Work shift
                </Button>
            }

            {
                openAddTimeRecordModal
                &&
                <RegisterEmployeeWorkShift
                    mode={"add"}
                    open={openAddTimeRecordModal}
                    employee={employee}
                 handleWorkShiftClose={handleWorkShiftClose}/>

            }
        </div>


        <div className={"bp-details-card-buttons"}>

                <Button variant="contained"
                        onClick={onEdit}
                        size={"small"}
                        color="primary"
                        startIcon={<EditIcon/>}>
                    Edit Employee
                 </Button>

            {
                openEditModal
                &&
                <ManageEmployeeComponent open={openEditModal} handleClose={handleClose} mode={"edit"}
                                         employee={employee}/>

            }
        </div>

    </div>

}

export default EmployeeDetailInfoCard;