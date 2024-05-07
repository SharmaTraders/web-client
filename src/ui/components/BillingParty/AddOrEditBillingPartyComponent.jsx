import React, {useState} from "react";
import {useCreateBillingPartyMutation} from "../../../redux/features/api/billingPartyApi";
import {toast} from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {FormControl, MenuItem, Select, Slide} from "@mui/material";
import "./AddBillingPartyComponent.css";
import AddIcon from "@mui/icons-material/Add";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddOrEditBillingPartyComponent({mode,billingParty, open, handleClose}) {

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);

    const [vatNumber, setVatNumber] = useState("");
    const [vatNumberError, setVatNumberError] = useState(null);

    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState("")
    const [phoneError, setPhoneError] = useState(null)

    const [openingBalance, setOpeningBalance] = useState("0")
    const [openingBalanceError, setOpeningBalanceError] = useState(null)

    const [toReceive, setToReceive] = useState(true);

    if (mode === "edit") {
        if (!billingParty) return;
        const {name, email, vatNumber, address, phoneNumber, openingBalance} = billingParty;
        setName(name);
        setEmail(email);
        setVatNumber(vatNumber);
        setAddress(address);
        setPhoneNumber(phoneNumber);
        setOpeningBalance(openingBalance);
    }

    const [createBillingParty, {isLoading}] = useCreateBillingPartyMutation();


    if (isLoading) {
        toast.loading("Adding billing party...", {
            toastId: "loading-billingParty",
            autoClose: false
        })
    } else {
        toast.dismiss("loading-billingParty");
    }


    async function onAddParty() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        let  balance = parseFloat(openingBalance);
        balance = toReceive ? balance : -balance;

        const body = {
            name,
            address,
            phoneNumber,
            openingBalance: balance,
            email,
            vatNumber
        }
        const {error} = await createBillingParty(body);

        if (error) handleError(error)
        else handleSuccess();
    }

    function handleError(error) {
        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "billing-party",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "name") {
                setNameError(errorMessage);
            } else if (problemType.toLowerCase() === "address") {
                setAddressError(errorMessage);
            } else if (problemType.toLowerCase() === "phonenumber") {
                setPhoneError(errorMessage);
            } else if (problemType.toLowerCase() === "email") {
                setEmailError(errorMessage);
            } else if (problemType.toLowerCase() === "openingbalance") {
                setOpeningBalanceError(errorMessage);
            } else if (problemType.toLowerCase() === "vatnumber") {
                setVatNumberError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "billing-party",
                autoClose: 7000
            })
        }

    }

    function handleSuccess() {
        toast.success("Billing party has been added.", {
            toastId: "billing-party"
        });
        // Close the dialogue
        closeDialogue();

    }

    function resetValues() {
        setName("");
        setAddress("");
        setPhoneNumber("");
        setOpeningBalance("");
        setVatNumber("");
        setEmail("");
    }

    function resetErrors() {
        setNameError("")
        setAddressError("");
        setPhoneError("");
        setOpeningBalanceError("");
        setVatNumberError("");
        setEmailError("");
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
        return isValid;
    }

    function closeDialogue() {
        handleClose();
        resetValues();
        resetErrors();
    }

    return <Dialog
        open={open}
        TransitionComponent={Transition}>
        <DialogTitle>Add New Billing Party</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details to add a new billing party.
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>
            <TextField
                margin="normal"
                value={name}
                error={Boolean(nameError)}
                helperText={nameError}
                onChange={(e) => {
                    setName(e.target.value)
                }
                }
                required
                fullWidth
                className={nameError ? "error" : ""}

                label="Party name"
                autoFocus
            />

            <TextField
                margin="dense"
                value={address}
                error={Boolean(addressError)}
                helperText={addressError}
                onChange={(e) => {
                    setAddress(e.target.value)
                    setAddressError(null);
                }
                }
                required
                fullWidth
                className={addressError ? "error" : ""}

                label="Address"
            />

            <div className={"textField-group"}>
                <TextField
                    margin="dense"
                    type={"email"}
                    value={email}
                    error={Boolean(emailError)}
                    helperText={emailError}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError(null);

                    }
                    }
                    required={false}
                    fullWidth
                    className={emailError ? "error" : ""}

                    label="Email Address"
                />

                <TextField
                    margin="dense"
                    type={"tel"}
                    value={phoneNumber}
                    error={Boolean(phoneError)}
                    helperText={phoneError}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        const regex = /^\d*\.?\d*$/;
                        // Check if input value matches the regex
                        if (regex.test(inputValue) || inputValue === '') {
                            setPhoneNumber(inputValue);
                        }
                        setPhoneError(null);

                    }
                    }
                    required={false}
                    fullWidth
                    className={phoneError ? "error" : ""}

                    label="Phone Number"
                />
            </div>


            <div className={"textField-group"}>
                <div className={"textField-connected"}>
                    <TextField
                        type={"text"}
                        margin="dense"
                        value={openingBalance}
                        error={Boolean(openingBalanceError)}
                        helperText={openingBalanceError}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Regular expression to match float numbers
                            const regex = /^\d*\.?\d{0,2}$/;
                            // Check if input value matches the regex
                            if (regex.test(inputValue) || inputValue === '') {
                                setOpeningBalance(inputValue);
                            }
                            setOpeningBalanceError(null);

                        }
                        }
                        fullWidth
                        label="Opening Balance"
                        className={openingBalanceError ? "error" : ""}

                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start">
                                    <CurrencyRupeeIcon/>
                                </InputAdornment>,
                        }}
                    />

                    <FormControl sx={{ m: 1, minWidth: 120 , ml: -0.25, borderRight: "none"}} size="medium">
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={toReceive}
                            onChange={(e) => {setToReceive(e.target.value)}}
                        >
                            <MenuItem value={true}>
                                To Receive
                            </MenuItem>
                            <MenuItem value={false}>To Pay</MenuItem>

                        </Select>
                    </FormControl>
                </div>


                <TextField
                    margin="dense"
                    value={vatNumber}
                    error={Boolean(vatNumberError)}
                    helperText={vatNumberError}
                    onChange={(e) => {
                        setVatNumber(e.target.value)
                        setVatNumberError(null);

                    }
                    }
                    required={false}
                    label="VAT Number"
                    className={vatNumberError ? "error" : ""}

                />
            </div>

        </DialogContent>

        <DialogActions>
            <Button onClick={closeDialogue}
                    variant={"contained"}
                    size={"small"}
                    color={"error"}>Cancel
            </Button>
            <Button onClick={onAddParty}
                    endIcon={<AddIcon/>}
                    variant={"contained"}
                    size={"small"}>Add
            </Button>

        </DialogActions>

    </Dialog>

}

export default AddOrEditBillingPartyComponent;