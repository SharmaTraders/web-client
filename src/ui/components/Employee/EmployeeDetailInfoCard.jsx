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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoneyBill} from "@fortawesome/free-solid-svg-icons/faMoneyBill";
import UpdateSalaryComponent from "./UpdateSalaryComponent";
import {isMobile} from "../../../utils/SystemInfo";
import EmployeeWorkShiftsPhoneComponent from "./EmployeeWorkShiftsPhoneComponent";

function EmployeeDetailInfoCard() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const employee = useSelector(selectSelectedEmployee);

    if (!employee) return <div>
        Please select a Employee for info
    </div>

    function getClassName() {
        if (employee.status.toString().toLowerCase() === "active") {
            return "primary-color";
        } else {
            return "error-color";
        }
    }

    function getBalanceClassName() {
        if (employee.balance === 0) return "bold"
        if (employee.balance < 0) return "primary-color bold"
        return "error-color bold"
    }

    function onEdit() {
        setOpenEditModal(true);
    }

    function handleEditClose() {
        setOpenEditModal(false);
    }

    function handleUpdateSalaryClose() {
        setOpenUpdateModal(false);
    }

    return <div className={"bp-details-card"}>
        <div className={"bp-details-card-info"}>
            <div className={"bp-details-card-1"}>
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

        <div className={"item-details-card-buttons"}>

            {
                isMobile() &&
                <EmployeeWorkShiftsPhoneComponent/>
            }


            <Button variant="contained"
                    onClick={onEdit}
                    size="small"
                    color="primary"
                    startIcon={<EditIcon/>}>
                Edit
            </Button>

            <Button variant="contained"
                    onClick={() => setOpenUpdateModal(true)}
                    size="small"
                    color="primary"
                    startIcon={<FontAwesomeIcon icon={faMoneyBill}/>}>
                Update Salary
            </Button>

            {
                openEditModal
                &&
                <ManageEmployeeComponent open={openEditModal} handleClose={handleEditClose} mode={"edit"}
                                         employee={employee}/>

            }

            {
                openUpdateModal
                &&
                <UpdateSalaryComponent open={openUpdateModal} handleClose={handleUpdateSalaryClose}/>
            }
        </div>
    </div>

}

export default EmployeeDetailInfoCard;