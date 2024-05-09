import React, {useState} from "react";
import {
    useCreateBillingPartyMutation,
    useUpdateBillingPartyMutation
} from "../../../redux/features/api/billingPartyApi";
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
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import {useDispatch} from "react-redux";
import {setSelectedBillingParty} from "../../../redux/features/state/billingPartyState";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ManageBillingPartyComponent({mode, billingParty, open, handleClose}) {


    const [name, setName] = useState(billingParty ? billingParty.name : null);
    const [nameError, setNameError] = useState(null);

    const [email, setEmail] = useState(billingParty ? billingParty.email : null);
    const [emailError, setEmailError] = useState(null);

    const [vatNumber, setVatNumber] = useState(billingParty ? billingParty.vatNumber : null);
    const [vatNumberError, setVatNumberError] = useState(null);

    const [address, setAddress] = useState(billingParty ? billingParty.address : null);
    const [addressError, setAddressError] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState(billingParty ? billingParty.phoneNumber : null)
    const [phoneError, setPhoneError] = useState(null)

    const [openingBalance, setOpeningBalance] = useState("0")
    const [openingBalanceError, setOpeningBalanceError] = useState(null)

    const [toReceive, setToReceive] = useState(true);
    const [createBillingParty, {isLoading: isCreateLoading}] = useCreateBillingPartyMutation();
    const [updateBillingParty, {isLoading: isUpdateLoading}] = useUpdateBillingPartyMutation();
    const dispatch = useDispatch()



    if (isCreateLoading) {
        toast.loading("Adding billing party...", {
            toastId: "loading-billingParty-create",
            autoClose: false
        })

    }
    if (isUpdateLoading) {
        toast.loading("Updating billing party...", {
            toastId: "loading-billingParty-update",
            autoClose: false
        });
    }


    async function onAddParty() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        let balance = parseFloat(openingBalance);
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
        else handleAddSuccess();
    }

    async function onUpdateParty() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        const params = {
            id: billingParty.id,
            name,
            address,
            phoneNumber,
            email,
            vatNumber
        }
        const {error} = await updateBillingParty(params);
        if (error) handleError(error);
        else handleUpdateSuccess();
    }

    function handleError(error) {
        toast.dismiss("loading-billingParty-create");
        toast.dismiss("loading-billingParty-update");

        if (error.status && error.status ===500){
            toast.error("Server error, Please contact support.", {
                toastId: "billing-party",
                autoClose: 7000
            });
            return;
        }


        if (error.data ) {
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

    function handleAddSuccess() {
        toast.success("Billing party has been added.", {
            toastId: "billing-party"
        });
        // Close the dialogue
        toast.dismiss("loading-billingParty-create");
        closeDialogue();
    }

    function handleUpdateSuccess() {
        toast.success("Billing party has been updated", {
            toastId: "billing-party"
        });
        toast.dismiss("loading-billingParty-update");
        dispatch(setSelectedBillingParty({
            id: billingParty.id,
            name,
            address,
            phoneNumber,
            balance : billingParty.balance,
            vatNumber,
            email
        }));
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
        <DialogTitle>
            {
                mode === "add"
                    ?
                    "Add new billing party"
                    :
                    "Edit billing party"
            }

        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details to {mode} a new billing party.
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

                    }}
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
                {
                    mode === "add"
                    &&
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

                        <FormControl sx={{m: 1, minWidth: 120, ml: -0.25}} size="medium">
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={toReceive}
                                onChange={(e) => {
                                    setToReceive(e.target.value)
                                }}
                                sx = {{color : toReceive ?'green' : 'red', fontWeight: 'bold' }}
                            >
                                <MenuItem value={true} sx = {{color : 'green'}}>
                                    To Receive
                                </MenuItem>
                                <MenuItem value={false} sx = {{color : 'red'}}>To Pay</MenuItem>

                            </Select>
                        </FormControl>
                    </div>
                }


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
                    fullWidth={mode === "edit"}
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
            {
                mode === "add"
                    ?
                    <Button onClick={onAddParty}
                            endIcon={<AddIcon/>}
                            variant={"contained"}
                            size={"small"}>Add
                    </Button>
                    :
                    <Button onClick={onUpdateParty}
                            endIcon={<EditIcon/>}
                            variant={"contained"}
                            size={"small"}>Save
                    </Button>

            }


        </DialogActions>

    </Dialog>

}

ManageBillingPartyComponent.propTypes = {
    mode: PropTypes.oneOf(['edit', 'add']).isRequired,
    item: function (props, propName, componentName) {
        // Validate item prop only if mode is 'edit'
        if (props.mode === 'edit' && !props[propName]) {
            return new Error(
                `The prop \`${propName}\` is required when mode is 'edit' in component \`${componentName}\`.`
            );
        }
    }
};

export default ManageBillingPartyComponent;