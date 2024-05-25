import React, { useState } from "react";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Slide from '@mui/material/Slide';
import { useRegisterWorkShiftMutation } from "../../../redux/features/api/employeeWorkShift";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import { getBsToday } from "../../../utils/dateConverters";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PropTypes from "prop-types";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function RegisterEmployeeWorkShift({ mode, employee, open, handleWorkShiftClose }) {
    const [createTimeRecord, { isLoading: isCreateLoading }] = useRegisterWorkShiftMutation();

    const [startTime, setStartTime] = useState(null);
    const [startTimeError, setStartTimeError] = useState('');
    const [endTime, setEndTime] = useState(null);
    const [endTimeError, setEndTimeError] = useState('');
    const [breakInMinutes, setBreakInMinutes] = useState('');
    const [breakTimeError, setBreakTimeError] = useState('');
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);
    const [dateError, setDateError] = useState('');

    if (isCreateLoading) {
        toast.loading(mode === "add" ? "Adding time record..." : "Updating time record...", {
            toastId: "loading-timeRecord",
            autoClose: false
        });
    }

    const handleDateChange = ({ adDate }) => {
        setDate(adDate);
        setDateError("");
    };

    function validateNonEmptyRequiredFields() {
        let isValid = true;

        if (!date) {
            setDateError("Date is required");
            isValid = false;
        }

        if (!startTime) {
            setStartTimeError("Start time is required");
            isValid = false;
        }

        if (!endTime) {
            setEndTimeError("End time is required");
            isValid = false;
        }

        if (!breakInMinutes) {
            setBreakTimeError("Break time is required");
            isValid = false;
        }

        return isValid;
    }

    async function onRegister() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        const formatTime = (time) => {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        const body = {
            id: employee.id,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
            breakInMinutes: parseInt(breakInMinutes, 10),
            date,
        };

        let result;
        if (mode === "add") {
            result = await createTimeRecord(body);
        }

        if (result.error) {
            handleError(result.error);
        } else {
            handleSuccess();
        }
    }


    function handleError(error) {
        toast.dismiss("loading-timeRecord");

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

            if (problemType.toLowerCase() === "endtime") {
                setEndTimeError(errorMessage);
            } else if (problemType.toLowerCase() === "break") {
                setBreakTimeError(errorMessage);
            } else if (problemType.toLowerCase() === "date") {
                setDateError(errorMessage);
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

    function handleSuccess() {
        toast.dismiss("loading-timeRecord");
        toast.success("Time record has been saved.", {
            toastId: "timeRecord"
        });
        closeDialogue();
    }

    function closeDialogue() {
        handleWorkShiftClose();
    }

    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
        setStartTimeError('');
    };

    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
        setEndTimeError('');
    };

    return (
        <Dialog fullWidth open={open} TransitionComponent={Transition}>
            <DialogTitle>{mode === "add" ? "Register WorkShift" : "Edit WorkShift"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill in the following details to {mode} time record.
                    <br />
                    The fields marked with * are mandatory
                </DialogContentText>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Calendar
                                className={dateError ? "calendar error" : "calendar"}
                                theme="green"
                                language="en"
                                maxDate={getBsToday()}
                                placeholder={"Select Date"}
                                onChange={handleDateChange} />
                            {dateError && (
                                <Typography color="error" variant="body2">
                                    {dateError}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TimePicker
                                fullWidth
                                label="Start Time"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                ampm={false}  // Disable AM/PM format to use 24-hour format
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ width: '100%', gridColumn: 'span 4' }} />}
                                sx={{ width: '100%', gridColumn: 'span 4' }}
                            />
                            {startTimeError && (
                                <Typography color="error" variant="body2">
                                    {startTimeError}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                ampm={false}  // Disable AM/PM format to use 24-hour format
                                renderInput={(params) => <TextField {...params} />}
                                sx={{ width: '100%', gridColumn: 'span 4' }}
                            />
                            {endTimeError && (
                                <Typography color="error" variant="body2">
                                    {endTimeError}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Break Time (minutes)"
                                variant="outlined"
                                value={breakInMinutes}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Regex to allow only positive numbers with up to two decimal places
                                    const validValue = /^\d*\.?\d{0,2}$/.test(value);

                                    if (validValue || value === "") { // Allow empty string to clear the field
                                        setBreakInMinutes(value);
                                        setBreakTimeError("");
                                    }
                                }}
                                error={Boolean(breakTimeError)}
                                helperText={breakTimeError || "Enter a positive number with up to two decimal places"}
                                inputProps={{
                                    inputMode: 'decimal',  // Brings up the numeric keyboard on mobile devices
                                    pattern: "[0-9]*"  // Ensure the soft keyboard is numeric
                                }}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button variant = "contained" onClick={handleWorkShiftClose} color="error">Cancel</Button>
                <Button variant = "contained" onClick={onRegister}>{mode === "add" ? "Register" : "Save"}</Button>
            </DialogActions>
        </Dialog>
    );
}

RegisterEmployeeWorkShift.propTypes = {
    mode: PropTypes.oneOf(['edit', 'add']).isRequired,
    employee: PropTypes.object,
    open: PropTypes.bool.isRequired,
    handleWorkShiftClose: PropTypes.func.isRequired
};

export default RegisterEmployeeWorkShift;
