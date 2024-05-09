import React, {useState} from "react";
import {toast} from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Slide} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useAddItemMutation, useUpdateItemMutation} from "../../../redux/features/api/itemApi";
import InputAdornment from "@mui/material/InputAdornment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedItem, setSelectedItem} from "../../../redux/features/state/itemState";
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from "prop-types";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ManageItemComponent({open, handleClose, mode}) {

    const selectedItem = useSelector(selectSelectedItem);
    const [itemName, setItemName] = useState(selectedItem ? selectedItem.name : "");
    const [itemNameError, setItemNameError] = useState(null);

    const [openingStockWeight, setOpeningStockWeight] = useState(selectedItem ? selectedItem.openingStockWeight : "");
    const [openingStockWeightError, setOpeningStockWeightError] = useState(null);

    const [openingStockValue, setOpeningStockValue] = useState(selectedItem ? selectedItem.openingStockValue : "");
    const [openingStockValueError, setOpeningStockValueError] = useState(null);

    const [addItem, {isLoading}] = useAddItemMutation();
    const [updateItem] = useUpdateItemMutation();
    const dispatch = useDispatch()

    if (isLoading) {
        toast.loading("Adding item...", {
            toastId: "loading-item",
            autoClose: false
        })
    } else {
        toast.dismiss("loading-item");
    }

    async function handleItemSubmit() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;
        if (mode === 'edit') {
            const body = {
                itemId: selectedItem.id,
                itemName,
            }
            if (itemName === selectedItem.name) {
                toast.info("No changes were made.", {
                    toastId: "no-changes-made",
                    autoClose: 5000
                });
                closeDialogue();
                return;
            }
            const {error} = await updateItem(body);
            if (error) handleError(error)
            else handleSuccess();

        } else {
            const body = {
                itemName,
                openingStockWeight: parseFloat(openingStockWeight),
                openingStockValue: parseFloat(openingStockValue)
            }
            const {error} = await addItem(body);

            if (error) handleError(error)
            else handleSuccess();
        }
    }

    function handleError(error) {
        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "add-item-error",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "itemName") {
                setItemNameError(errorMessage);
            }
            if (problemType.toLowerCase() === "openingStockWeight") {
                setOpeningStockWeightError(errorMessage);
            }
            if (problemType.toLowerCase() === "openingStockValue") {
                setOpeningStockValueError(errorMessage);
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

    function handleSuccess() {
        if (mode === 'edit'){
            toast.success("Item has been updated.", {
                toastId: "edit-item-success",
            });
            dispatch(setSelectedItem({id: selectedItem.id, name: itemName}));
        }
        else
            toast.success("Item has been added.", {
                toastId: "add-item-success",
            });

        closeDialogue();

    }

    function resetValues() {
        setItemName("");
        setOpeningStockWeight("");
        setOpeningStockValue("");
    }

    function resetErrors() {
        setItemNameError("");
        setOpeningStockWeightError("");
        setOpeningStockValueError("");
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;
        if (!itemName) {
            setItemNameError("Item Name is required");
            isValid = false;
        }
        if(itemName < 3 || itemName.length > 20){
            setItemNameError("Item Name must be between 3 and 20 characters");
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
        <DialogTitle>{mode === "edit" ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {mode === "edit" ? "Edit the following details to update the item" : "Please fill in the following details to add a new Item."}
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>
            <TextField
                margin="normal"
                value={itemName}
                error={Boolean(itemNameError)}
                helperText={itemNameError}
                onChange={(e) => {
                    console.log(e.target.value); // Log the new value
                    setItemName(e.target.value);
                }}
                required
                fullWidth
                className={itemNameError ? "error" : ""}
                label="Item name"
                autoFocus
            />
            {mode !== 'edit' && (
                <>
                    <TextField
                        type={"text"}
                        margin="dense"
                        value={openingStockWeight}
                        error={Boolean(openingStockWeightError)}
                        helperText={openingStockWeightError}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Regular expression to match float numbers
                            const regex = /^\d*\.?\d{0,2}$/;
                            // Check if input value matches the regex
                            if (regex.test(inputValue) || inputValue === '') {
                                setOpeningStockWeight(inputValue);
                            }
                            setOpeningStockWeightError(null);
                        }}
                        fullWidth
                        label="Opening Stock (Kg)"
                        className={openingStockWeightError ? "error" : ""}
                    />

                    <TextField
                        type={"text"}
                        margin="dense"
                        value={openingStockValue}
                        error={Boolean(openingStockValueError)}
                        helperText={openingStockValueError}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Regular expression to match float numbers
                            const regex = /^\d*\.?\d{0,2}$/;
                            // Check if input value matches the regex
                            if (regex.test(inputValue) || inputValue === '') {
                                setOpeningStockValue(inputValue);
                            }
                            setOpeningStockValueError(null);
                        }}
                        fullWidth
                        label="Total Estimate Value "
                        className={openingStockValueError ? "error" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CurrencyRupeeIcon/>
                                </InputAdornment>
                            )
                        }}
                    />
                </>
            )}


        </DialogContent>

        <DialogActions>
            <Button onClick={closeDialogue}
                    variant={"contained"}
                    size={"small"}
                    color={"error"}>Cancel
            </Button>
            <Button onClick={handleItemSubmit}
                    endIcon={mode === 'edit' ? <SaveIcon/> : <AddIcon/>}
                    variant="contained"
                    size="small">{mode === 'edit' ? 'Save Changes' : 'Add'}
            </Button>
        </DialogActions>
    </Dialog>

}

ManageItemComponent.propTypes = {
    mode: PropTypes.oneOf(['edit', 'add']).isRequired,
    item: function (props, propName, componentName) {
        // Validate item prop only if mode is 'edit'
        if (props.mode === 'edit' && !props[propName]) {
            return new Error(
                `The prop \`${propName}\` is required when mode is 'edit' in component \`${componentName}\`.`
            );
        }
    }
}


export default ManageItemComponent;