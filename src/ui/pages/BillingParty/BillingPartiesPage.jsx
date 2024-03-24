import React, {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./BillingParty.css"
import InputAdornment from "@mui/material/InputAdornment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {useCreateBillingPartyMutation} from "../../../redux/features/api/billingPartyApi";
import {toast} from "react-toastify";
import {Slide} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function BillingPartiesPage() {

    const [openAddModal, setOpenAddModal] = useState(false)

    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div>
        <h1>Billing Parties</h1>
        <button onClick={handleClickOpen}> Open Modal</button>
        <AddDialogue open={openAddModal} handleClose={handleClose}/>
    </div>
}

function AddDialogue({open, handleClose}) {

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

        const body = {
            name,
            address,
            phoneNumber,
            openingBalance: parseFloat(openingBalance),
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
                            </InputAdornment>
                    }}
                />

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
                    fullWidth
                    label="VAT Number"
                    className={vatNumberError ? "error" : ""}

                />
            </div>

        </DialogContent>

        <DialogActions>
            <Button onClick={closeDialogue}>Cancel</Button>
            <Button onClick={onAddParty}>Add Party</Button>

        </DialogActions>

    </Dialog>

}

export default BillingPartiesPage;