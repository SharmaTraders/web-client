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
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";
import {useGetItemsQuery} from "../../../redux/features/api/itemApi";
import BillingPartyAutocomplete from "../../components/Invoice/BillingPartyAutocomplete";
import ItemAutocomplete from "../../components/Invoice/ItemAutocomplete";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from "react-toastify";
import {useAddPurchaseMutation} from "../../../redux/features/api/purchase";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import {useSelector} from "react-redux";
import "./InvoicePage.css";
import {useNavigate} from "react-router-dom";
import {getBsToday} from "../../../utils/dateConverters";

function InvoicePage() {

    // Fetch billing parties and items
    const {data: billingParties, isLoading: isLoadingBillingParties, error: billingPartiesError } = useGetBillingPartiesQuery();
    const {data: items, isLoading: isItemLoading, error: itemsError} = useGetItemsQuery();

    // Initialize states
    const initialInvoiceItem = {
        itemId: '',
        itemName: '',
        quantity: '',
        rate: '',
        report: '',
        amount: ''
    };

    const [invoiceItems, setInvoiceItems] = useState([
        initialInvoiceItem]);

    const [itemErrors, setItemErrors] = useState([{
        itemIdError: '',
        quantityError: '',
        rateError: ''
    }]);

    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);
    const [dateError, setDateError] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceNumberError, setInvoiceNumberError] = useState('');
    const [showVAT, setShowVAT] = useState(false);
    const [vatAmount, setVatAmount] = useState(0);
    const [showTransportFees, setShowTransportFees] = useState(false);
    const [transportFees, setTransportFees] = useState('');
    const [transportFeesError, setTransportFeesError] = useState('');
    const [paidAmount, setPaidAmount] = useState(0);
    const [paidAmountError, setPaidAmountError] = useState('');
    const [checked, setChecked] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [remarksError, setRemarksError] = useState('');
    const selectedBillingParty = useSelector(selectSelectedBillingParty);
    const [selectedBillingPartyError, setSelectedBillingPartyError] = useState('');
    const [addPurchase, {isLoading : isAddLoading}] = useAddPurchaseMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    let vatPercentage = 13;

    if (isItemLoading){
        toast.loading("Loading items...", {
            toastId: "loading-items",
            autoClose: false
        })
    } else {
        toast.dismiss("loading-items");
    }

    if (isAddLoading) {
        toast.loading("Adding purchase invoice...", {
            toastId: "add-purchase-loading",
            autoClose: false
        });
    } else {
        toast.dismiss("add-purchase-loading");
    }

    const calculateSubtotal = (items) => {
        return items.reduce((total, item) => total + (item.amount || 0), 0);
    };

    const calculateTotalAmount = (items, vatAmount, transportFees) => {
        return calculateSubtotal(items) + vatAmount + (parseFloat(transportFees) || 0);
    };

    function updateState(newItems, newVatAmount, newTotalAmount) {
        setInvoiceItems(newItems);
        setVatAmount(newVatAmount);
        setPaidAmount(checked ? newTotalAmount : paidAmount);
    }

    const handleItemChange = (index, field, value) => {
        // Updating the specific field of an item in the invoiceItems array.
        const newItems = invoiceItems.map((item, idx) => {
            if (idx === index) {
                const updatedItem = {...item, [field]: value};

                const {quantity, rate, report} = updatedItem;
                const effectiveReport = report || 0;
                updatedItem.amount = quantity && rate ? (quantity * rate) - effectiveReport : '';

                return updatedItem;
            }
            return item;
        });

        // Calculate the new subtotal, VAT amount, and total amount
        const newSubtotal = calculateSubtotal(newItems);
        const newVatAmount = showVAT ? newSubtotal * 0.13 : 0;
        const newTotalAmount = calculateTotalAmount(newItems, newVatAmount, transportFees);

        // Update the state with the new values
        updateState(newItems, newVatAmount, newTotalAmount);
    };

    const handleDateChange = ({ adDate}) => {
        setDate(adDate);
        setDateError("");
    };

    const addItem = () => {
        setInvoiceItems([...invoiceItems,initialInvoiceItem]);
        setItemErrors([...itemErrors, {itemIdError: '', quantityError: '', rateError: ''}]);
    };

    const removeItem = (index) => {
        const newItems = [...invoiceItems];
        newItems.splice(index, 1);
        const newErrors = [...itemErrors];
        newErrors.splice(index, 1);
        const newSubtotal = calculateSubtotal(newItems);
        const newVatAmount = showVAT ? newSubtotal * 0.13 : 0;
        const newTotalAmount = calculateTotalAmount(newItems, newVatAmount, transportFees);

        setItemErrors(newErrors);
        updateState(newItems, newVatAmount, newTotalAmount);
    };

    const handleAddVATClick = () => {
        const newSubtotal = calculateSubtotal(invoiceItems);
        const newVatAmount = newSubtotal * 0.13;
        const newTotalAmount = calculateTotalAmount(invoiceItems, newVatAmount, transportFees);

        setShowVAT(true);
        setVatAmount(newVatAmount);
        setPaidAmount(checked ? newTotalAmount : paidAmount);
    };

    const handleRemoveVAT = () => {
        const newTotalAmount = calculateTotalAmount(invoiceItems, 0, transportFees);

        setVatAmount(0);
        setShowVAT(false);
        setPaidAmount(checked ? newTotalAmount : paidAmount);
    }
    const handleAddTransportFeesClick = () => {
        setShowTransportFees(true);
    };

    const handleTransportFeesChange = (event) => {
        const newTransportFees = parseFloat(event);
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, newTransportFees);

        setTransportFees(newTransportFees);
        setPaidAmount(checked ? newTotalAmount : paidAmount);
    };

    const handleRemoveTransportFee = () => {
        setShowTransportFees(false);
        setTransportFees(0);
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, 0);
        setPaidAmount(checked ? newTotalAmount : paidAmount);
    }

    const handlePaidAllAmountChange = (event) => {
        const isChecked = event.target.checked;
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, transportFees);
        setPaidAmount(isChecked ? newTotalAmount : 0);
        setChecked(isChecked);
    };

    const handlePaidAmountChange = (event) => {
        const amount = event.target.value;
        setPaidAmount(parseFloat(amount) || "");
        setChecked(parseFloat(amount) === calculateTotalAmount(invoiceItems, vatAmount, transportFees));
    };

    function handleError(error) {
        toast.dismiss("add-purchase-loading");
        if (error.status && error.status === 500) {
            toast.error("Server error, Please contact support.", {
                toastId: "add-purchase-error",
                autoClose: 7000
            });
            return;
        }

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.title;
            let errorDetails = problemDetails.errors;

            // Show a general error toast
            toast.error(errorMessage, {
                toastId: "add-purchase-party",
                autoClose: 7000
            });

            // Initialize new error states
            let newSelectedBillingPartyError = '';
            let newInvoiceDateError = '';
            let newTransportFeesError = '';
            let newPaidAmountError = '';
            let newRemarksError = '';
            let newItemErrors = [...itemErrors];


            // Map server errors to the corresponding form fields
            for (const [key, value] of Object.entries(errorDetails)) {
                const errorMessage = value.join(' ');

                if (key.startsWith("RequestBody.PurchaseLines")) {
                    const match = key.match(/RequestBody\.PurchaseLines\[(\d+)]\.(\w+)/);
                    if (match) {
                        const index = parseInt(match[1], 10);
                        const field = match[2];

                        if (field === "ItemId") {
                            newItemErrors[index].itemIdError = errorMessage;
                        } else if (field === "Quantity") {
                            newItemErrors[index].quantityError = errorMessage;
                        } else if (field === "UnitPrice") {
                            newItemErrors[index].rateError = errorMessage;
                        }
                    }
                } else if (key === "RequestBody.BillingPartyId") {
                    newSelectedBillingPartyError = errorMessage;
                } else if (key === "RequestBody.Date") {
                    newInvoiceDateError = errorMessage;
                } else if (key === "RequestBody.TransportFee") {
                    newTransportFeesError = errorMessage;
                } else if (key === "RequestBody.PaidAmount") {
                    newPaidAmountError = errorMessage;
                } else if (key === "RequestBody.Remarks") {
                    newRemarksError = errorMessage;
                }
            }

            if (problemDetails.type === "ItemId") {
                newItemErrors.forEach((itemError) => {
                    itemError.itemIdError = errorMessage;
                });
            }

            // Set new error states
            setSelectedBillingPartyError(newSelectedBillingPartyError);
            setDateError(newInvoiceDateError);
            setTransportFeesError(newTransportFeesError);
            setPaidAmountError(newPaidAmountError);
            setRemarksError(newRemarksError);
            setItemErrors(newItemErrors);
        }
    }

    function handleSuccess() {
        toast.dismiss("add-purchase-loading");
        toast.success("Purchase invoice has been added print", {
            toastId: "add-purchase-success",
            autoClose: 5000
        });
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;

        if (!selectedBillingParty) {
            setSelectedBillingPartyError("Billing party is required");
            isValid = false;
        } else {
            setSelectedBillingPartyError("");
        }

        if (!date) {
            setDateError("Invoice date is required");
            isValid = false;
        } else {
            setDateError("");
        }

        if (invoiceNumber) {
            if (isNaN(invoiceNumber)) {
                setInvoiceNumberError("Invoice number must be a number");
                isValid = false;
            } else {
                setInvoiceNumberError("");
            }
        }

        if (invoiceItems.length === 0) {
            toast.error("Please add at least one item", {
                toastId: "add-purchase-item",
                autoClose: 7000
            });
            isValid = false;
        }
        const newErrors = itemErrors.map((error, index) => {
            const item = invoiceItems[index];
            let itemIdError = '', quantityError = '', rateError = '';

            if (!item.itemId) {
                itemIdError = 'Item is required';
                isValid = false;
            }

            if (!item.quantity || item.quantity <= 0) {
                quantityError = 'Quantity is required and must be greater than 0';
                isValid = false;
            }

            if (!item.rate || item.rate <= 0) {
                rateError = 'Rate is required and must be greater than 0';
                isValid = false;
            }

            return {itemIdError, quantityError, rateError};
        });
        setItemErrors(newErrors);
        return isValid;
    }

    function handleSaveAndPrint() {
        handleSavePurchase(true)
    }

    function handleSaveAndWithoutPrint(){
        handleSavePurchase(false)
    }

    async function handleSavePurchase(print) {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        setIsSubmitting(true);
        const purchaseLines = invoiceItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.rate,
            report: item.report ? item.report : 0,
        }));

        const data = {
            billingPartyId: selectedBillingParty.id,
            purchaseLines: purchaseLines,
            date: date,
            remarks: remarks,
            vatAmount: vatAmount ? vatAmount : 0,
            transportFee: transportFees ? transportFees : 0,
            paidAmount: paidAmount ? paidAmount : 0,
            invoiceNumber: invoiceNumber ? invoiceNumber : 0
        };

        try {
            await addPurchase(data).unwrap();
            handleSuccess();
        } catch (error) {
            handleError(error);
        } finally {
            if (print) {
                console.log("Print dialog opened")
                // Set up the event listener before calling window.print()
                const handleAfterPrint = () => {
                    console.log('Print dialog closed');
                    // Redirect to another page after print dialog is closed
                    navigate('/');
                    window.removeEventListener('afterprint', handleAfterPrint); // Clean up the event listener
                };

                window.addEventListener('afterprint', handleAfterPrint);
                window.print();
            }
            setIsSubmitting(false);
            toast.dismiss("add-purchase-loading");
            navigate('/');

        }
    }

    const handleRemarkChange = (value) => {
        setRemarks(value);
    };

    const handleInvoiceNumberChange = (value) => {
        setInvoiceNumber(value);
    };

    const handleItemSelected = (index, item) => {
            const newItems = invoiceItems.map((invoiceItem, idx) => {
                if (idx === index) {
                    return item ? {...invoiceItem, itemName: item.name, itemId: item.id} : {...invoiceItem, itemName: '', itemId: ''};
                }
                return invoiceItem;
            });

            const newSubtotal = calculateSubtotal(newItems);
            const newVatAmount = showVAT ? newSubtotal * 0.13 : 0;
            const newTotalAmount = calculateTotalAmount(newItems, newVatAmount, transportFees);

            setInvoiceItems(newItems);
            setVatAmount(newVatAmount);
            setPaidAmount(checked ? newTotalAmount : paidAmount);

            const newErrors = [...itemErrors];
            newErrors[index].itemIdError = '';
            setItemErrors(newErrors);
    }

    if (isLoadingBillingParties || isItemLoading) {
        return <div>Loading...</div>
    }

    if (billingPartiesError) {
        return <div> Something went wrong while getting billing party</div>
    }

    if (itemsError) {
        return <div> Something went wrong while getting items</div>
    }

    const billingPartiesData = billingParties.parties;
    let itemsData = [...items.items];

    const totalAmount = calculateTotalAmount(invoiceItems, vatAmount, transportFees);
    const remainingAmount = totalAmount - paidAmount;

    return (
        <Box sx={{margin: 2}}>
            <Typography variant="h5" gutterBottom mb={2}>Create Purchase Invoice</Typography>
            <Typography  gutterBottom mb={2}>The fields marked with * are mandatory </Typography>
            <Grid container spacing={2}>
                <Grid container item spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={4}>
                        <BillingPartyAutocomplete billingPartiesData={billingPartiesData}/>
                        {selectedBillingPartyError && (
                            <Typography color="error">{selectedBillingPartyError}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6} container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Invoice Number"
                                variant="outlined"
                                onChange={(e) => {
                                    handleInvoiceNumberChange(e.target.value)
                                }}
                                error={Boolean(invoiceNumberError)}
                                helperText={invoiceNumberError}
                                value={invoiceNumber}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Calendar className={dateError ? "calendar error" : "calendar"}
                                      theme="green"
                                      language="en"
                                      maxDate = {getBsToday()}
                                      placeholder={"Select Date"}
                                      onChange={handleDateChange}/>
                            {dateError && (
                                <Typography color="error" variant="body2">
                                    {dateError}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

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
                                            <IconButton
                                                onClick={() => removeItem(index)} className={"delete-icon"}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={5} lg={3} md={3}>
                            <ItemAutocomplete
                                key={index}
                                itemsData={itemsData}
                                onItemSelected={(item) => handleItemSelected(index, item)}
                            />
                            {itemErrors[index]?.itemIdError && (
                                <Typography color="error">{itemErrors[index].itemIdError}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                required
                                fullWidth
                                label="Quantity"
                                type="number"
                                InputProps={{endAdornment: <InputAdornment position="start">Kg</InputAdornment>}}
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                variant="outlined"
                                error={Boolean(itemErrors[index]?.quantityError)}
                                helperText={itemErrors[index]?.quantityError}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                required
                                fullWidth
                                label="Rate"
                                type="number"
                                InputProps={{startAdornment: <InputAdornment position="start">Rs.</InputAdornment>}}
                                value={item.rate}
                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                variant="outlined"
                                error={Boolean(itemErrors[index]?.rateError)}
                                helperText={itemErrors[index]?.rateError}
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
                    <Grid item spacing={2}>
                        <Button
                            variant="text"
                            onClick={addItem}
                            startIcon={<AddCircleOutlineIcon/>}
                        >
                            Add Billing Item
                        </Button>
                    </Grid>
                    <Grid item spacing={2}>
                        <Typography variant="h6">
                            Sub Total: Rs {calculateSubtotal(invoiceItems).toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container item spacing={2}>
                    <Grid item spacing={2} xs={12} sm={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Remarks"
                            variant="outlined"
                            onChange={event => handleRemarkChange(event.target.value)}
                            error={Boolean(remarksError)}
                        />
                    </Grid>

                    <Grid container spacing={2} item md={6}>
                        <Grid container item xs={12} sm={12} md={12}>
                            {!showVAT && (
                                <Button
                                    variant="text"
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
                                            value={`${vatAmount.toFixed(2)}`}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs sm={6} md={2}>
                                        <DeleteIcon onClick={handleRemoveVAT} className={"delete-icon"}/>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        <Grid container item xs={12} sm={12} md={12}>
                            {!showTransportFees && (
                                <Button
                                    variant="text"
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
                                            error={Boolean(transportFeesError)}
                                        />

                                    </Grid>
                                    <Grid item xs sm={6} md={2}>
                                        <DeleteIcon
                                            onClick={handleRemoveTransportFee} className={"delete-icon"}/>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        <Grid item>
                            <TextField
                                fullWidth
                                label="Total Amount"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    readOnly: true,
                                    style: {color: 'black'},
                                }}
                                value={totalAmount.toFixed(2)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid container item xs={12} sm={12} alignItems="center" spacing={2}>
                            <Grid item>
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
                                    error={Boolean(paidAmountError)}
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
                        <Grid item container spacing={2} className={"remaining-Amount"}>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Balance Amount:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Rs {remainingAmount.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={handleSaveAndPrint}>
                        {isSubmitting ? "Saving..." : "Save and Print"}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={handleSaveAndWithoutPrint}>
                        {isSubmitting ? "Saving..." : "Save Purchase Invoice"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default InvoicePage;
