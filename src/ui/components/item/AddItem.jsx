import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAddItemMutation} from "../../../redux/features/api/itemApi";

function AddItem() {
    const [itemName, setItemName] = useState("");
    const [itemNameError, setItemNameError] = useState(null);
    const navigate = useNavigate();

    const [addItem, {isLoading, error} ] = useAddItemMutation();

    async function onAddItem() {

        setItemNameError(null);

        if (!itemName) {
            setItemNameError("Item name is required");
            return;
        }

        try {
            const result = await addItem({name: itemName}).unwrap();
            handleSuccess(result);
        } catch (err) {
            handleError(err)
        }
    }

    function handleError(error) {
        if (error.data){
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;
            let problemType = problemDetails.type;

            toast.error(errorMessage, {
                toastId: "addItem",
                autoClose: 7000
            });

            if (problemType.toLowerCase() === "itemName") {
                setItemNameError(errorMessage);
            }
            return;

        }

        // This is when the server is down or there is a network error
        if (error.error) {
            toast.error("Cannot connect to server, Please check your internet or make sure that the server is running", {
                toastId: "addItem",
                autoClose: 7000
            })
        }
    }

    function handleSuccess(data) {
        toast.success("Item added successfully", {
            toastId: "addItem"
        });
        setItemName("");
        navigate("/", {replace: true});    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Add Item
            </Typography>
            <Box component="form" noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    error={Boolean(itemNameError)}
                    value={itemName}
                    onChange={(e) => {
                        setItemName(e.target.value)
                        setItemNameError(null)
                    }}
                    required
                    fullWidth
                    id="itemName"
                    label="Item Name"
                    name="itemName"
                    autoComplete="off"
                    helperText={itemNameError}
                    autoFocus
                />
                <Button
                    fullWidth
                    onClick={onAddItem}
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Add Item
                </Button>
            </Box>
        </Box>
    );
}

export { AddItem };
