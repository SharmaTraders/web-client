import React, {useState} from "react";
import Slide from "@mui/material/Slide";
import {useUpdateSalaryMutation} from "../../../redux/features/api/employee";
import {toast} from "react-toastify";
import {selectSelectedEmployee} from "../../../redux/features/state/employeeState";
import {useSelector} from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons/faRupeeSign";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function UpdateSalaryComponent({open, handleClose}) {
    const [updateSalary, {isLoading}] = useUpdateSalaryMutation();
    const selectedEmployee = useSelector(selectSelectedEmployee);

    const [salaryPerHour, setSalaryPerHour] = useState(0);
    const [salaryPerHourError, setSalaryPerHourError] = useState("");
    const [overtimeSalaryPerHour, setOvertimeSalaryPerHour] = useState(0);
    const [overtimeSalaryPerHourError, setOvertimeSalaryPerHourError] = useState("");

    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);
    const [dateError, setDateError] = useState('');

    if (isLoading) {
        toast.loading("Updating salary...", {
            toastId: "update-salary",
            autoClose: false
        });
    }

    function handleUpdateSalary() {
        if (!validateNonEmptyRequiredFields()) return;
        const {error} = updateSalary({
            employeeId: selectedEmployee.id,
            startDate: date,
            salaryPerHour,
            overtimeSalaryPerHour
        })
        if (error) handleError(error);
        else handleSuccess();

    }

    function handleSuccess() {
        toast.dismiss("update-salary");
        toast.success("Salary updated successfully", {
            toastId: "update-salary",
            autoClose: 7000
        });
        handleClose();
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;
        if (salaryPerHour === 0) {
            setSalaryPerHourError("Please enter salary per hour");
            isValid = false;
        }
        if (overtimeSalaryPerHour === 0) {
            setOvertimeSalaryPerHourError("Please enter overtime salary per hour");
            isValid = false;
        }
        if (date === "") {
            setDateError("Please enter date");
            isValid = false;
        }
        return isValid;
    }

    function handleError(error) {
        toast.dismiss("update-salary");

        if (error.status && error.status === 500) {
            toast.error("Server error, Please contact support.", {
                toastId: "update-salary",
                autoClose: 7000
            });
            return;
        }

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            console.log(errorMessage)
            toast.error(errorMessage, {
                toastId: "update-salary",
                autoClose: 7000
            });

            if (problemType.toLowerCase().includes("overtime")) {
                setOvertimeSalaryPerHourError(errorMessage);
            } else if (problemType.toLowerCase().includes("salary")) {
                setSalaryPerHour(errorMessage);
            } else if (problemType.toLowerCase().includes("date")) {
                setDateError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "update-salary",
                autoClose: 7000
            })
        }
    }

    function onDateChange({adDate}) {
        setDate(adDate);
        setDateError("");
    }

    return <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}>
        <DialogTitle>
            Update salary for {selectedEmployee.name}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details. Fields marked with * are mandatory
            </DialogContentText>

            <div style={{marginTop: 10}}> Starting from:  </div>
            <Calendar className={dateError ? "calendar error" : "calendar"}
                      theme="green"
                      language="en"
                      placeholder={"Select Date"}
                      onChange={onDateChange}/>

            <TextField
                type={"text"}
                margin="normal"
                value={salaryPerHour}
                error={Boolean(salaryPerHourError)}
                helperText={salaryPerHourError}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Regular expression to match float numbers
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Check if input value matches the regex
                    if (regex.test(inputValue)) {
                        setSalaryPerHour(parseFloat(inputValue) || 0);
                    }
                    setSalaryPerHourError("");
                }}
                fullWidth
                required
                label="Salary Per Hour"
                className={salaryPerHourError ? "error" : ""}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FontAwesomeIcon icon={faRupeeSign}/>
                        </InputAdornment>
                    )
                }}
            />

            <TextField
                type={"text"}
                margin="normal"
                value={overtimeSalaryPerHour}
                error={Boolean(overtimeSalaryPerHourError)}
                helperText={overtimeSalaryPerHourError}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Regular expression to match float numbers
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Check if input value matches the regex
                    if (regex.test(inputValue)) {
                        setOvertimeSalaryPerHour(parseFloat(inputValue) || 0);
                    }
                    setOvertimeSalaryPerHourError("");
                }}
                fullWidth
                required
                label="Overtime - Salary Per Hour"
                className={overtimeSalaryPerHourError ? "error" : ""}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FontAwesomeIcon icon={faRupeeSign}/>
                        </InputAdornment>
                    )
                }}
            />
        </DialogContent>

        <DialogActions>
            <Button variant="contained"
                    onClick={handleClose}
                    size="small"
                    color="error">
                Cancel
            </Button>
            <Button variant="contained"
                    onClick={handleUpdateSalary}
                    size="small"
                    color="primary">
                Update salary
            </Button>
        </DialogActions>
    </Dialog>

}

export default UpdateSalaryComponent;