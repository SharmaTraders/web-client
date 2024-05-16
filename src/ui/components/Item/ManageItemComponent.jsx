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
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedItem, setSelectedItem} from "../../../redux/features/state/itemState";
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons/faRupeeSign";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ManageItemComponent({open, handleClose, mode}) {

    let selectedItem = useSelector(selectSelectedItem);
    if (mode === "add") selectedItem = {}


    const [itemName, setItemName] = useState(selectedItem ? selectedItem.name : "");
    const [itemNameError, setItemNameError] = useState("");

    const [stockWeight, setStockWeight] = useState(selectedItem ? selectedItem.openingStockWeight : "");
    const [openingStockWeightError, setOpeningStockWeightError] = useState("");

    const [estimatedPricePerKilo, setEstimatedPricePerKilo] = useState(selectedItem ? selectedItem.openingStockValue : "");
    const [estimatedPricePerKiloError, setEstimatedPricePerKiloError] = useState("");

    const [addItem, {isLoading}] = useAddItemMutation();
    const [updateItem, {isLoading : isUpdateLoading}] = useUpdateItemMutation();
    const dispatch = useDispatch()

    if (isLoading) {
        toast.loading("Adding item...", {
            toastId: "loading-item",
            autoClose: false
        })
    }

    if (isUpdateLoading) {
        toast.loading("Updating item...", {
            toastId: "loading-item",
            autoClose: false
        })
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
                name : itemName,
                stockWeight: parseFloat(stockWeight),
                estimatedPricePerKilo: parseFloat(estimatedPricePerKilo)
            }
            console.log(body);
            const {error} = await addItem(body);

            if (error) handleError(error)
            else handleSuccess();
        }
    }

    function handleError(error) {
        toast.dismiss("loading-item");

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
            if (problemType.toLowerCase() === "estimatedValuePerKilo") {
                setEstimatedPricePerKiloError(errorMessage);
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
        toast.dismiss("loading-item");

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

        toast.dismiss("loading-item");
        closeDialogue();

    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;
        if (!itemName) {
            setItemNameError("Item Name is required");
            isValid = false;
        }
        return isValid;
    }

    function closeDialogue() {
        handleClose();

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
                    setItemName(e.target.value);
                }}
                required
                fullWidth
                className={itemNameError ? "error" : ""}
                label="Item name"
                autoFocus
            />
            {mode === 'add' && (
                <>
                    <TextField
                        type={"text"}
                        margin="dense"
                        value={stockWeight}
                        error={Boolean(openingStockWeightError)}
                        helperText={openingStockWeightError}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Regular expression to match float numbers
                            const regex = /^\d*\.?\d{0,2}$/;
                            // Check if input value matches the regex
                            if (regex.test(inputValue) || inputValue === '') {
                                setStockWeight(inputValue);
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
                        value={estimatedPricePerKilo}
                        error={Boolean(estimatedPricePerKiloError)}
                        helperText={estimatedPricePerKiloError}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Regular expression to match float numbers
                            const regex = /^\d*\.?\d{0,2}$/;
                            // Check if input value matches the regex
                            if (regex.test(inputValue) || inputValue === '') {
                                setEstimatedPricePerKilo(inputValue);
                            }
                            setEstimatedPricePerKiloError(null);
                        }}
                        fullWidth
                        label="Estimated value per kilo (Rs)"
                        className={estimatedPricePerKiloError ? "error" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faRupeeSign} />
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
                    startIcon={mode === 'edit' ? <SaveIcon/> : <AddIcon/>}
                    variant="contained"
                    size="small">{mode === 'edit' ? 'Save Changes' : 'Add'}
            </Button>
        </DialogActions>
    </Dialog>

}

ManageItemComponent.propTypes = {
    mode: PropTypes.oneOf(['edit', 'add']).isRequired,

}


export default ManageItemComponent;