import React, {useState} from "react";
import {Slide} from "@mui/material";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedItem, setSelectedItem} from "../../../redux/features/state/itemState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons/faRupeeSign";
import {useAddStockMutation, useReduceStockMutation} from "../../../redux/features/api/stockApi";
import {toast} from "react-toastify";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { getBsToday} from "../../../utils/dateConverters";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

function ManageStockComponent({open, handleClose, mode}) {
    const selectedItem = useSelector(selectSelectedItem);
    const dispatch = useDispatch();


    const [weight, setWeight] = useState("");
    const [weightError, setWeightError] = useState("");

    const [expectedValuePerKilo, setExpectedValuePerKilo] = useState(selectedItem ? selectedItem.estimatedPricePerKilo : "");
    const [expectedValuePerKiloError, setExpectedValuePerKiloError] = useState(null);

    const [addStock, {isLoading: addLoading}] = useAddStockMutation();
    const [reduceStock, {isLoading: reduceLoading}] = useReduceStockMutation();

    const currentDate = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(currentDate);
    const [dateError, setDateError] = useState("");

    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState("");

    if (addLoading) {
        toast.loading("Adding stock..", {
            toastId: "stock-loading",
            autoClose: false
        });
    }

    if (reduceLoading) {
        toast.loading("Reducing stock..", {
            toastId: "stock-loading",
            autoClose: false
        });
    }

    function updateSelectedItem(item) {
        dispatch(setSelectedItem(item));
    }

    async function onAddStockClick() {
        if (!validateNonEmptyRequiredFields()) return;

        // Change the date with picker component.
        const {error} = await addStock({
            itemId: selectedItem.id,
            weight,
            expectedValuePerKilo,
            date,
            remarks
        });
        if (error) {
            handleError(error);
        } else {
            toast.dismiss("stock-loading");
            toast.success("Stock added successfully");

            const updatedItem = {
                ...selectedItem,
                estimatedPricePerKilo: expectedValuePerKilo,
                stockWeight: +weight + selectedItem.stockWeight
            };
            updateSelectedItem(updatedItem);

            handleClose();
        }
    }

    async function onReduceStockClick() {
        if (!validateNonEmptyRequiredFields()) return;

        // Change the date with picker component.
        const {error} = await reduceStock({
            itemId: selectedItem.id,
            weight,
            date,
            remarks
        });
        if (error) {
            handleError(error);
        } else {
            toast.dismiss("stock-loading");
            toast.success("Stock reduced successfully");

            const updatedItem = {
                ...selectedItem,
                stockWeight: selectedItem.stockWeight - weight,
                date,
                remarks
            };
            updateSelectedItem(updatedItem);
            handleClose();
        }
    }

    function handleError(error) {
        toast.dismiss("stock-loading");

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "add-item-error",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "weight") {
                setWeightError(errorMessage);
            }
            if (problemType.toLowerCase() === "expectedvalueperkilo") {
                setExpectedValuePerKiloError(errorMessage);
            }
            if (problemType.toLowerCase() === "remarks") {
                setRemarksError(errorMessage);
            }
            if (problemType.toLowerCase() === "date") {
                setDateError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "add-item-error",
                autoClose: 7000
            })
        }
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;
        if (!weight) {
            setWeightError("Stock weight is required");
            isValid = false;
        }
        if (!expectedValuePerKilo) {
            setExpectedValuePerKiloError("Expected value per kilo is required");
            isValid = false;
        }
        return isValid;
    }


    if (!selectedItem) return <div> Item needs to be selected to perform this action</div>

    function closeDialogue() {
        handleClose();
    }

    function onDateChange({adDate}) {
        setDate(adDate);
        setDateError("");
    }

    return <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}>
        <DialogTitle>{mode === "add" ? "Add Stock" : "Reduce Stock"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details to {mode} stock.
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>

            <Calendar className={dateError ? "calendar error" : "calendar"}
                      theme="green"
                      language="en"
                      maxDate = {getBsToday()}
                      placeholder={"Select Date"}
                      onChange={onDateChange}/>

            <TextField
                type={"text"}
                margin="normal"
                value={weight}
                error={Boolean(weightError)}
                helperText={weightError}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    console.log("Got weight >" + inputValue);

                    // Regular expression to match float numbers
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Check if input value matches the regex
                    if (regex.test(inputValue)){
                        console.log("Setting weight >" + inputValue);
                        setWeight(inputValue);
                    }
                    setWeightError(null);
                }}
                fullWidth
                required
                label="Stock (Kg)"
                className={weightError ? "error" : ""}
            />

            {
                mode === "add"
                &&
                <TextField
                    type={"text"}
                    margin="normal"
                    value={expectedValuePerKilo}
                    error={Boolean(expectedValuePerKiloError)}
                    helperText={expectedValuePerKiloError}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        // Regular expression to match float numbers
                        const regex = /^\d*\.?\d{0,2}$/;
                        // Check if input value matches the regex
                        if (regex.test(inputValue) || inputValue === '') {
                            setExpectedValuePerKilo(inputValue);
                        }
                        setExpectedValuePerKiloError(null);
                    }}
                    fullWidth
                    label="Expected value per kg"
                    className={weightError ? "error" : ""}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faRupeeSign}/>
                            </InputAdornment>
                        )
                    }}
                />

            }

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
            <Button onClick={closeDialogue}
                    variant="contained"
                    size="small"
                    color="error">Cancel
            </Button>

            {
                mode === "add" ?
                    <Button variant="contained"
                            onClick={onAddStockClick}
                            color="primary"
                            size="small"
                            startIcon={<AddIcon/>}>
                        Add
                    </Button>
                    :
                    <Button variant="contained"
                            color="primary"
                            onClick={onReduceStockClick}
                            size="small"
                            startIcon={<RemoveIcon/>}>
                        Reduce
                    </Button>

            }

        </DialogActions>
    </Dialog>
}


ManageStockComponent.propTypes = {
    mode: PropTypes.oneOf(['add', 'reduce']).isRequired,
}

export default ManageStockComponent;