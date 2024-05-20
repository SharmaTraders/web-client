import React, {useState} from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
    Box,
    InputAdornment,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useGetItemsQuery} from "../../../redux/features/api/itemApi";
import BillingPartyAutocomplete from "../../components/BillingParty/BillingPartyAutocomplete";
import ItemAutocomplete from "../../components/Item/ItemAutocomplete";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from "react-toastify";
import {useAddPurchaseMutation} from "../../../redux/features/api/purchaseApi";
import {useAddSaleMutation} from "../../../redux/features/api/saleApi"; // Import the sale mutation
import "./InvoicePage.css";
import {InvoiceActivityComponent} from "../../components/Invoice/InvoiceActivityComponent";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function InvoicePage({mode}) {
    const navigate = useNavigate();

    function handleAddInvoice() {
        if (mode === "purchase") {
            navigate("/purchaseInvoice")
        }else {
            navigate("/saleInvoice")
        }
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5" gutterBottom mb={2}>
                            {mode === 'purchase' ? 'Purchase' : 'Sales'} List
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddInvoice}
                        >
                            {mode === "purchase" ? "Add Purchase Invoice" : "Add Sale Invoice"}
                        </Button>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <InvoiceActivityComponent mode={mode}/>
                </Grid>
            </Grid>
        </div>
    );
}

export default InvoicePage;