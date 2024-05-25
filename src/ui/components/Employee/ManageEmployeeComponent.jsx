import React, {useState} from "react";
import {toast} from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import {useAddEmployeeMutation} from "../../../redux/features/api/employee";
import PropTypes from "prop-types";
import {Grid, Slide} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ManageEmployeeComponent({ mode, open, handleClose }) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [openingBalance, setOpeningBalance] = useState(0);
    const [openingBalanceError, setOpeningBalanceError] = useState("");
    const [normalDailyWorkingHours, setNormalDailyWorkingHours] = useState("");
    const [normalDailyWorkingHoursError, setNormalDailyWorkingHoursError] = useState("");
    const [salaryPerHour, setSalaryPerHour] = useState(0);
    const [salaryPerHourError, setSalaryPerHourError] = useState("");
    const [overtimeSalaryPerHour, setOvertimeSalaryPerHour] = useState(0);
    const [overtimeSalaryPerHourError, setOvertimeSalaryPerHourError] = useState("");

    const [addEmployee, { isLoading: isCreateLoading }] = useAddEmployeeMutation();

    if (isCreateLoading) {
        toast.loading("Adding EmployeePage...", {
            toastId: "loading-employee-create",
            autoClose: false
        });
    }


    function validateNonEmptyRequiredFields() {
        let isValid = true;

        if (!name) {
            setNameError("Name is required");
            isValid = false;
        }

        if (!address) {
            setAddressError("Address is required");
            isValid = false;
        }

        if (!normalDailyWorkingHours) {
            setNormalDailyWorkingHoursError("Normal daily working hours is required");
            isValid = false;
        }

        if (!salaryPerHour) {
            setSalaryPerHourError("Salary per hour is required");
            isValid = false;
        }

        if (!overtimeSalaryPerHour) {
            setOvertimeSalaryPerHourError("Overtime salary per hour is required");
            isValid = false;
        }
        if (salaryPerHour < 0) {
            setSalaryPerHourError("Salary per hour cannot be negative");
            isValid = false;
        }
        if (overtimeSalaryPerHour < 0) {
            setOvertimeSalaryPerHourError("Overtime salary per hour cannot be negative");
            isValid = false;
        }

        return isValid;
    }

    async function onAddOrUpdateEmployee() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;
        const [hours, minutes] = normalDailyWorkingHours.split(':').map(Number);

        const body = {
            name,
            address,
            phoneNumber,
            email,
            openingBalance,
            normalDailyWorkingMinute: hours * 60 + minutes,
            salaryPerHour,
            overtimeSalaryPerHour
        };

        // TODO : Add Update EmployeePage Mutation
        // const action = mode === "add" ? addEmployee : updateEmployee;

        const { error } = await addEmployee(body);

        if (error) {
            handleError(error);
        } else {
            handleSuccess();
        }
    }
    function closeDialogue() {
        handleClose();
    }

    function handleSuccess() {
        toast.success("EmployeePage has been added.", {
            toastId: "employee"
        });
        // Close the dialogue
        toast.dismiss("loading-employee-create");
        closeDialogue();
    }

    function handleError(error) {
        toast.dismiss("loading-employee-create");

        if (error.status && error.status ===500){
            toast.error("Server error, Please contact support.", {
                toastId: "employee",
                autoClose: 7000
            });
            return;
        }


        if (error.data ) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            console.log(errorMessage)
            toast.error(errorMessage, {
                toastId: "employee",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "name") {
                setNameError(errorMessage);
            } else if (problemType.toLowerCase() === "address") {
                setAddressError(errorMessage);
            } else if (problemType.toLowerCase() === "phonenumber") {
                setPhoneNumberError(errorMessage);
            } else if (problemType.toLowerCase() === "email") {
                setEmailError(errorMessage);
            } else if (problemType.toLowerCase() === "salaryperhr") {
                setSalaryPerHourError(errorMessage);
            } else if (problemType.toLowerCase() === "overtimesalaryperhr") {
                setOvertimeSalaryPerHourError(errorMessage);
            } else if (problemType.toLowerCase() === "normaldailyworkinghours") {
                setNormalDailyWorkingHoursError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "employee",
                autoClose: 7000
            })
        }
    }

    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>{mode === "add" ? "Add New EmployeePage" : "Edit EmployeePage"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill in the following details. Fields marked with * are mandatory.
                </DialogContentText>
                <TextField
                    margin="normal"
                    label="EmployeePage Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setNameError("");
                    }}
                    required
                    fullWidth
                    error={Boolean(nameError)}
                    helperText={nameError}
                    className={nameError ? "error" : ""}
                />

                <Grid container spacing={2} >
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            margin="normal"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError("");
                            }}
                            fullWidth
                            error={Boolean(emailError)}
                            helperText={emailError}
                            className={emailError ? "error" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            label="Address"
                            value={address}
                            onChange={(e) => {
                                setAddressError("")
                                setAddress(e.target.value);
                            }}
                            fullWidth
                            required
                            error={Boolean(addressError)}
                            helperText={addressError}
                            className={addressError ? "error" : ""}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={7} alignItems={"start"}>
                        <TextField
                            margin="dense"
                            type={"tel"}
                            value={phoneNumber}
                            error={Boolean(phoneNumberError)}
                            helperText={phoneNumberError}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                const regex = /^\d*\.?\d*$/;
                                // Check if input value matches the regex
                                if (regex.test(inputValue)) {
                                    setPhoneNumber(inputValue);
                                }
                                setPhoneNumberError(null);

                            }
                            }
                            required={false}
                            fullWidth
                            className={phoneNumberError ? "error" : ""}

                            label="Phone Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                        <TextField
                            margin="dense"
                            label="Daily Working Hours"
                            value={normalDailyWorkingHours}
                            onChange={(e) => {
                                setNormalDailyWorkingHours(e.target.value)
                                setNormalDailyWorkingHoursError("");
                            }}
                            fullWidth
                            required
                            type={"time"}
                            error={Boolean(normalDailyWorkingHoursError)}
                            helperText={normalDailyWorkingHoursError}
                            className={normalDailyWorkingHoursError ? "error" : ""}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            margin="normal"
                            label="Opening Balance"
                            type="text"
                            value={openingBalance}
                            onChange={(e) => {
                                const regex = /^\d*\.?\d{0,2}$/;
                                const value = e.target.value;
                                if (value === "" || regex.test(value)) {
                                    setOpeningBalance(value);
                                    setOpeningBalanceError("");
                                }
                            }}
                            fullWidth
                            error={Boolean(openingBalanceError)}
                            helperText={openingBalanceError}
                            className={openingBalanceError ? "error" : ""}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            margin="normal"
                            label="Salary per Hour"
                            type="text"
                            value={salaryPerHour}
                            onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^\d*\.?\d{0,2}$/;
                                if (value === "" || regex.test(value)) {
                                    setSalaryPerHour(value);
                                    setSalaryPerHourError("");
                                }
                            }}
                            fullWidth
                            required
                            error={Boolean(salaryPerHourError)}
                            helperText={salaryPerHourError}
                            className={salaryPerHourError ? "error" : ""}
                        />

                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            margin="normal"
                            label="Overtime Salary per Hour"
                            type="text"
                            value={overtimeSalaryPerHour}
                            onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^\d*\.?\d{0,2}$/;
                                if (value === "" || regex.test(value)) {
                                    setOvertimeSalaryPerHour(value);
                                    setOvertimeSalaryPerHourError("");
                                }
                            }}
                            fullWidth
                            required
                            error={Boolean(overtimeSalaryPerHourError)}
                            helperText={overtimeSalaryPerHourError}
                            className={overtimeSalaryPerHourError ? "error" : ""}
                        />

                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button variant = "contained" onClick={handleClose} color="error">Cancel</Button>
                <Button variant = "contained" onClick={onAddOrUpdateEmployee} endIcon={mode === "add" ? <AddIcon /> : <SaveIcon />}>
                    {mode === "add" ? "Add" : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ManageEmployeeComponent.propTypes = {
    mode: PropTypes.oneOf(['edit', 'add']).isRequired,
    employee: PropTypes.object,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default ManageEmployeeComponent;
