import React from 'react';
import {
    Button,
    Grid,
    Typography,

} from '@mui/material';

import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';

import "./InvoicePage.css";
import {InvoiceActivityComponent} from "../../components/Invoice/InvoiceActivityComponent";
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