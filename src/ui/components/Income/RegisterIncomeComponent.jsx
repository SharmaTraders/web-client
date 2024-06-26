import React, {useState} from "react";
import {Slide} from "@mui/material";
import {useRegisterIncomeMutation} from "../../../redux/features/api/incomeApi";
import {toast} from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import {getBsToday} from "../../../utils/dateConverters";
import TextField from "@mui/material/TextField";
import BillingPartyAutocomplete from "../BillingParty/BillingPartyAutocomplete";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons/faRupeeSign";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function RegisterIncomeComponent({open, handleClose}) {
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate)
    const [dateError, setDateError] = useState("");

    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState("");

    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState("");

    const [selectedBillingParty, setSelectedBillingParty] = useState({});

    const [registerIncome, {isLoading}] = useRegisterIncomeMutation();


    if (isLoading) toast.loading("Registering income...", {
        toastId: "income-loading",
        autoClose: false

    });


    async function onRegisterIncomeClick() {
        if (!validateNonEmptyRequiredFields()) return;

        const {error} = await registerIncome({
            billingPartyId: selectedBillingParty.id,
            date,
            remarks,
            amount
        });

        if (error) handleError(error);
        else {
            toast.dismiss("income-loading");
            toast.success("Income registered successfully", {
                autoClose: 7000
            });
            handleClose();
        }
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;

        if (date === "") {
            setDateError("Date is required");
            isValid = false;
        }

        if (!amount) {
            setAmountError("Amount is required");
            isValid = false;
        }
        if (!selectedBillingParty || !selectedBillingParty.id) {
            toast.error("Please select a billing party");
            isValid = false;
        }

        return isValid;
    }

    function handleError(error) {
        toast.dismiss("income-loading");

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "income-error",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "amount") {
                setAmountError(errorMessage);
            }
            if (problemType.toLowerCase() === "date") {
                setDateError(errorMessage);
            }
            if (problemType.toLowerCase() === "remarks") {
                setRemarksError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "income-error",
                autoClose: 7000
            })
        }
    }

    function onDateChange({adDate}) {
        setDate(adDate);
        setDateError("")
    }

    function onSelectedParty(party) {
        setSelectedBillingParty(party);
    }

    return <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}>
        <DialogTitle>
            Register Income
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details to register an income.
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>

            <div className={"calendar-container"}>
                <Calendar className={dateError ? "calendar error" : "calendar"}
                          theme="green"
                          language="en"
                          maxDate={getBsToday()}
                          placeHolder={"Select Date"}
                          onChange={onDateChange}/>
            </div>


            <BillingPartyAutocomplete onChange={onSelectedParty}/>


            <TextField
                type={"text"}
                margin="normal"
                value={amount}
                error={Boolean(amountError)}
                helperText={amountError}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Regular expression to match float numbers
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Check if input value matches the regex
                    if (regex.test(inputValue)) {
                        setAmount(inputValue);
                    }
                    setAmountError(null);
                }}
                fullWidth
                required
                label="Amount"
                className={amountError ? "error" : ""}
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
                multiline
                fullWidth
                rows={4}
                label={"Remarks"}
                value={remarks}
                onChange={(e) => {
                    setRemarks(e.target.value);
                }}
                error={Boolean(remarksError)}
                helperText={remarksError}
                className={remarksError ? "error" : ""}
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}
                    variant="contained"
                    size="small"
                    color="error">Cancel
            </Button>

            <Button variant="contained"
                    onClick={onRegisterIncomeClick}
                    color="primary"
                    size="small"
                    startIcon={<AddIcon/>}>
                Add
            </Button>
        </DialogActions>
    </Dialog>
}

export default RegisterIncomeComponent;