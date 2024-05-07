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
import {useAddItemMutation} from "../../../redux/features/api/itemApi";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddItemComponent({open, handleClose}) {

    const [itemName, setItemName] = useState("");
    const [itemNameError, setItemNameError] = useState(null);

    const [addItem, {isLoading}] = useAddItemMutation();


    if (isLoading) {
        toast.loading("Adding item...", {
            toastId: "loading-item",
            autoClose: false
        })
    } else {
        toast.dismiss("loading-item");
    }


    async function onAddItem() {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        const body = {
            itemName
        }
        const {error} = await addItem(body);

        if (error) handleError(error)
        else handleSuccess();
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
        toast.success("Item has been added.", {
            toastId: "add-item-success",
        });
        // Close the dialogue
        closeDialogue();

    }

    function resetValues() {
        setItemName("");
    }

    function resetErrors() {
        setItemNameError("")
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
        resetValues();
        resetErrors();
    }

    return <Dialog
        open={open}
        TransitionComponent={Transition}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please fill in the following details to add a new Item.
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>
            <TextField
                margin="normal"
                value={itemName}
                error={Boolean(itemNameError)}
                helperText={itemNameError}
                onChange={(e) => {
                    setItemName(e.target.value)
                }
                }
                required
                fullWidth
                className={itemNameError ? "error" : ""}

                label="Item name"
                autoFocus
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={closeDialogue}
                    variant={"contained"}
                    size={"small"}
                    color={"error"}>Cancel
            </Button>
            <Button onClick={onAddItem}
                    endIcon={<AddIcon/>}
                    variant={"contained"}
                    size={"small"}>Add
            </Button>

        </DialogActions>

    </Dialog>

}

export default AddItemComponent;