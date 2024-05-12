import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
    Box,
    InputAdornment,
    Checkbox, FormControlLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {useGetItemsQuery} from "../../../redux/features/api/itemApi";
import BillingPartyAutocomplete from "../../components/Invoice/BillingPartyAutocomplete";
import ItemAutocomplete from "../../components/Invoice/ItemAutocomplete";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from "react-toastify";

function InvoicePage() {
    const {
        data: billingPartiesDatas,
        isLoading: isLoadingBillingParties,
        error: billingPartiesError
    } = useGetBillingPartiesQuery();
    const {data: itemsDatas, isLoading: isLoadingItems, error: itemsError} = useGetItemsQuery();

    const [invoiceItems, setInvoiceItems] = useState([{itemName: '', quantity: '', rate: '', report: '', amount: ''}]);
    const [invoiceDate, setInvoiceDate] = useState('');
    const [showVAT, setShowVAT] = useState(false);
    const [vatAmount, setVatAmount] = useState(0);
    const [showTransportFees, setShowTransportFees] = useState(false);
    const [transportFees, setTransportFees] = useState("");
    const [paidAmount, setPaidAmount] = useState(0);
    const [checked, setChecked] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

    let vatPercentage = 13;

    const calculateSubtotal = () => {
        return invoiceItems.reduce((total, item) => total + (item.amount || 0), 0);
    };
    const calculateTotalAmount = () => {
        return calculateSubtotal() + vatAmount + transportFees;
    };

    useEffect(() => {
        setTotalAmount(calculateTotalAmount());
        if (checked) {
            setPaidAmount(totalAmount);
        }
        setRemainingAmount(totalAmount - paidAmount);
    }, [checked,transportFees,invoiceItems,paidAmount]);

    if (isLoadingBillingParties || isLoadingItems) {
        return <div>Loading...</div>
    }

    if (billingPartiesError) {
        return <div> Something went wrong while getting billing party</div>
    }

    if (itemsError) {
        return <div> Something went wrong while getting billing party</div>
    }

    // Cloning data to a new array for manipulation
    const billingPartiesData = billingPartiesDatas.billingParties;

    let itemsData = [...itemsDatas.items];


    const handleDateChange = ({bsDate, adDate}) => {
        console.log(bsDate, adDate);
        setInvoiceDate(bsDate);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceItems];
        newItems[index][field] = value;

        // Extract quantity, rate, and report from the current item
        const {quantity, rate, report} = newItems[index];

        // Ensure report defaults to 0 if not provided
        const effectiveReport = report || 0;

        // Calculate amount on-the-fly
        newItems[index].amount = quantity && rate ? (quantity * rate) - effectiveReport : '';
        if (showVAT) {
            setVatAmount(calculateSubtotal() * 0.13);
        }
        // Update the invoice items state
        setInvoiceItems(newItems);
    };


    const addItem = () => {
        setInvoiceItems([...invoiceItems, {itemName: '', quantity: '', rate: '', report: '', amount: ''}]);
    };

    const removeItem = (index) => {
        const newItems = [...invoiceItems];
        newItems.splice(index, 1);
        setInvoiceItems(newItems);
    };


    // Handle clicking of the Add fees (transport , vat) button
    const handleAddVATClick = () => {
        setVatAmount(calculateSubtotal() * 0.13);
        setShowVAT(true);
    };

    const handleAddTransportFeesClick = () => {
        setShowTransportFees(true);
    }

    const handleTransportFeesChange = (event) => {
        setTransportFees(parseFloat(event));
    };

    const handlePaidAllAmountChange = (event) => {
        if (event.target.checked) {
            setPaidAmount(calculateTotalAmount());
        }
        setChecked(event.target.checked);
    };

    const handlePaidAmountChange = (event) => {
        const amount = event.target.value;
        setPaidAmount(amount);
        // Automatically uncheck if the paid amount does not equal the total amount
        if (parseFloat(amount) !== calculateTotalAmount()) {
            setChecked(false);
        } else {
            setChecked(true);
        }
    };



    function handleSavePurchase() {
        const data = {
            invoiceDate: invoiceDate,
            items: invoiceItems,
            vatAmount: vatAmount,
            transportFees: transportFees,
            finalAmount: paidAmount,
            paidAllAmount: checked,
        };
        console.log(data);
        toast.success("Backend API not implemented yet. Data is logged to console.");
    }

    return (
        <Box sx={{margin: 2}}>

            <Typography variant="h5" gutterBottom mb={2}>Create Purchase Invoice</Typography>

            <Grid container spacing={2}>
                {/*For the billing part , invoice date and time */}
                <Grid container item spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={4}>
                        <BillingPartyAutocomplete billingPartiesData={billingPartiesData}/>
                    </Grid>

                    {/* Container for Invoice Number and Calendar */}
                    <Grid item xs={12} md={6} container spacing={2} justifyContent="space-between" alignItems="center">
                        {/* Invoice Number */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Invoice Number"
                                variant="outlined"
                            />
                        </Grid>

                        {/* Calendar for Date Selection */}
                        <Grid item xs={12} md={6}>
                            <Calendar onChange={handleDateChange} theme='deepdark' />
                        </Grid>
                    </Grid>
                </Grid>

                {/*For item and its value */}

                {invoiceItems.map((item, index) => (
                    <Grid container item spacing={2} key={index}>
                        <Grid item xs={12} sm={3} lg={1} md={3}>
                            <TextField
                                fullWidth
                                label="SN"
                                value={index + 1}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => removeItem(index)}>
                                                <RemoveCircleOutlineIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={5} lg={3} md={3}>
                            <ItemAutocomplete itemsData={itemsData}/>
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                type="number"
                                InputProps={{endAdornment: <InputAdornment position="start">Kg</InputAdornment>}}
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                label="Rate"
                                type="number"
                                InputProps={{startAdornment: <InputAdornment position="start">Rs.</InputAdornment>}}
                                value={item.rate}
                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                label="Report"
                                type="number"
                                value={item.report}
                                onChange={(e) => handleItemChange(index, 'report', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                label="Amount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    readOnly: true,
                                }}
                                value={item.amount}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                ))}

                <Grid container item spacing={2} xs={12} justifyContent="space-between" alignItems="center">
                    <Grid item spacing={2}>  {/* Grid item for the button */}
                        <Button
                            variant="contained"
                            onClick={addItem}
                            startIcon={<AddCircleOutlineIcon/>}
                        >
                            Add Billing Item
                        </Button>
                    </Grid>
                    <Grid item spacing={2}>  {/* Grid item for the subtotal */}
                        <Typography variant="h6">
                            Sub Total: Rs {calculateSubtotal().toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container item spacing={2}>
                    <Grid item spacing={2} xs={12} sm={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Note"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid container spacing={2} item md={6}>
                        {/*For vat */}
                        <Grid container item xs={12} sm={12} md={12}>
                            {!showVAT && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={handleAddVATClick}
                                >
                                    Add VAT
                                </Button>
                            )}

                            {showVAT && (
                                <Grid container spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                                    <Grid item xs sm={6} md={4}>
                                        <TextField
                                            label="VAT (%)"
                                            type="text"
                                            value={`${vatPercentage} %`}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <TextField
                                            label="VAT Amount"
                                            type="text"
                                            value={`Rs. ${vatAmount.toFixed(2)}`}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs sm={6} md={2}>
                                        <DeleteIcon
                                            onClick={() => {
                                                setShowVAT(false);
                                                setVatAmount(0);
                                            }}/>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        {/*For transport fees */}
                        <Grid container item xs={12} sm={12} md={12}>
                            {!showTransportFees && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={handleAddTransportFeesClick}
                                >
                                    Add Transport Fees
                                </Button>
                            )}

                            {showTransportFees && (
                                <Grid container spacing={2} justifyContent={"space-between"}>
                                    <Grid item xs sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Transport Fees"
                                            type="number"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                            }}
                                            value={transportFees}
                                            onChange={(e) => handleTransportFeesChange(e.target.value)}
                                            variant="outlined"
                                        />

                                    </Grid>
                                    <Grid item xs sm={6} md={2}>
                                        <DeleteIcon
                                            onClick={() => {
                                                setShowTransportFees(false);
                                                setTransportFees(0);
                                            }}/>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        {/*Showing Total amount */}

                        <Grid item >
                            <TextField
                                fullWidth
                                label="Total Amount"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                }}
                                value={totalAmount}
                                variant="outlined"
                            />
                        </Grid>

                        {/* For Paid Amount with Checkbox */}
                        <Grid container item xs={12} sm={12} alignItems="center" spacing={2}>
                            <Grid item md>
                                <TextField
                                    fullWidth
                                    label="Paid Amount"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    }}
                                    value={paidAmount}
                                    onChange={handlePaidAmountChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={handlePaidAllAmountChange}
                                            color="primary"
                                        />
                                    }
                                    label="Paid All Amount"
                                />
                            </Grid>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                label="Remaining Balance"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                }}
                                value={remainingAmount}
                                variant="outlined"
                            />
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" >Save and Print</Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="secondary" onClick={handleSavePurchase}>Save Purchase Invoice</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default InvoicePage;
