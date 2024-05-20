import React, {useState} from "react";
import {useAddCategoryMutation} from "../../../redux/features/api/expenseCategoryApi";
import {toast} from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {Slide} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function AddExpenseCategoryComponent({open, handleClose}) {
    const [categoryName, setCategoryName] = useState('');
    const [categoryNameError, setCategoryNameError] = useState('');

    const [addCategory, {isLoading}] = useAddCategoryMutation();

    if (isLoading) {
        toast.loading("Adding category...", {
            toastId: "loading-category",
            autoClose: false
        })
    }

    async function handleSubmit() {
        if (!categoryName) {
            setCategoryNameError("Category name is required");
            return;
        }
        const {error} = await addCategory(categoryName);
        if (error) handleError(error);
        else handleSuccess();
    }

    function handleSuccess() {
        toast.dismiss("loading-category");
        toast.success("Category added successfully", {
            toastId: "add-category-success",
        });
        handleClose();
    }

    function handleError(error) {
        toast.dismiss("loading-category");

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "add-category-error",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "name") {
                setCategoryNameError(errorMessage);
            }
            return;

        }

        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "add-category-error",
                autoClose: 7000
            })
        }

    }

    return <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent ={Transition}
        aria-labelledby="add-category-dialog">
        <DialogTitle>
            Add Expense Category
        </DialogTitle>

        <DialogContent>
            <DialogContentText>
                Please fill in the following details to add a new category.
                <br/>
                The fields marked with * are mandatory
            </DialogContentText>

            <TextField
                margin="normal"
                value={categoryName}
                error={Boolean(categoryNameError)}
                helperText={categoryNameError}
                onChange={(e) => {
                    setCategoryName(e.target.value);
                    setCategoryNameError("");
                }}
                required
                fullWidth
                className={categoryNameError ? "error" : ""}
                label="Category name"
                autoFocus
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}
                    variant="contained"
                    size="small"
                    color="error">
                Cancel
            </Button>

            <Button onClick={handleSubmit}
                    startIcon={ <AddIcon/>}
                    variant="contained"
                    size="small">
                Add
            </Button>

        </DialogActions>
    </Dialog>
}

export default AddExpenseCategoryComponent;