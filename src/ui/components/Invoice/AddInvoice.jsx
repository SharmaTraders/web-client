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
import BillingPartyAutocomplete from "./BillingPartyAutocomplete";
import ItemAutocomplete from "./ItemAutocomplete";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from "react-toastify";
import {useAddPurchaseMutation} from "../../../redux/features/api/purchase";
import {useAddSaleMutation} from "../../../redux/features/api/sale"; // Import the sale mutation
import {useNavigate} from "react-router-dom";
import {getBsToday} from "../../../utils/dateConverters";
import PropTypes from "prop-types";

function AddInvoice({mode}) {
    // Fetch billing parties and items
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

    const [invoiceItems, setInvoiceItems] = useState([initialInvoiceItem]);

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
    const [amountFromOrToParty, setAmountFromOrToParty] = useState(0);
    const [paidAmountError, setPaidAmountError] = useState('');
    const [checked, setChecked] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [remarksError, setRemarksError] = useState('');
    const [selectedBillingPartyError, setSelectedBillingPartyError] = useState('');
    const [addPurchase, {isLoading: isAddLoading}] = useAddPurchaseMutation();
    const [addSale, {isLoading: isAddSaleLoading}] = useAddSaleMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedBillingParty, setSelectedBillingParty] = useState({});

    let vatPercentage = 13;

    if (isItemLoading) {
        toast.loading("Loading items...", {
            toastId: "loading-items",
            autoClose: false
        })
    } else {
        toast.dismiss("loading-items");
    }

    if (isAddLoading || isAddSaleLoading) {
        toast.loading("Adding invoice...", {
            toastId: "add-invoice-loading",
            autoClose: false
        });
    } else {
        toast.dismiss("add-invoice-loading");
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
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);
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

    const handleDateChange = ({adDate}) => {
        setDate(adDate);
        setDateError("");
    };

    const addItem = () => {
        setInvoiceItems([...invoiceItems, initialInvoiceItem]);
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
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);
    };

    const handleRemoveVAT = () => {
        const newTotalAmount = calculateTotalAmount(invoiceItems, 0, transportFees);

        setVatAmount(0);
        setShowVAT(false);
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);
    }

    const handleAddTransportFeesClick = () => {
        setShowTransportFees(true);
    };

    const handleTransportFeesChange = (event) => {
        const newTransportFees = parseFloat(event);
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, newTransportFees);

        setTransportFees(newTransportFees);
        setTransportFeesError("");
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);
    };

    const handleRemoveTransportFee = () => {
        setShowTransportFees(false);
        setTransportFees(0);
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, 0);
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);
    }

    const handlePaidAllAmountChange = (event) => {
        const isChecked = event.target.checked;
        const newTotalAmount = calculateTotalAmount(invoiceItems, vatAmount, transportFees);
        setAmountFromOrToParty(isChecked ? newTotalAmount : 0);
        setChecked(isChecked);
    };

    const handlePaidAmountChange = (event) => {
        const amount = event.target.value;
        setAmountFromOrToParty(parseFloat(amount) || "");
        setPaidAmountError("");
        setChecked(parseFloat(amount) === calculateTotalAmount(invoiceItems, vatAmount, transportFees));
    };

    function handleError(error) {
        toast.dismiss("add-invoice-loading");

        // Handle server errors globally
        if (error.status && error.status === 500) {
            toast.error("Server error, Please contact support.", {
                toastId: "add-invoice-error",
                autoClose: 7000
            });
            return;
        }

        if (error.data) {
            let problemDetails = error.data;
            let errorMessage = problemDetails.detail;

            toast.error(errorMessage, {
                toastId: "add-invoice-error",
                autoClose: 7000
            });
            if (problemDetails.type) {
                let problemType = problemDetails.type;

                if (problemType.toLowerCase() === "paidamount" || problemType.toLowerCase() === "receivedamount") {
                    setPaidAmountError(errorMessage);
                } else if (problemType.toLowerCase() === "date") {
                    setDateError(errorMessage);
                } else if (problemType.toLowerCase() === "remarks") {
                    setRemarksError(errorMessage);
                } else if (problemType.toLowerCase() === "transportfee") {
                    setTransportFeesError(errorMessage);
                }else if (problemType.toLowerCase() === "invoicenumber") {
                    setInvoiceNumberError(errorMessage);
                }
                else if (problemType.toLowerCase() === "sales"|| problemType.toLowerCase() === "purchases") {
                    toast.error(errorMessage, {
                        toastId: "add-invoice-error",
                        autoClose: 7000
                    });
                }
            }
            if (problemDetails.errors){
                toast.error(problemDetails.title, {
                    toastId: "add-invoice-error",
                    autoClose: 7000
                });
            } else {
                toast.error(problemDetails.detail, {
                    toastId: "add-invoice-error",
                    autoClose: 7000
                });
            }
        }
    }


    function handleSuccess(print) {
        toast.dismiss("add-invoice-loading");
        toast.success("Invoice has been added", {
            toastId: "add-invoice-success",
            autoClose: 5000
        });
        if (print) {
            toast.dismiss("add-invoice-loading");
            // Set up the event listener before calling window.print()
            const handleAfterPrint = () => {
                // Redirect to another page after print dialog is closed
                window.removeEventListener('afterprint', handleAfterPrint); // Clean up the event listener
            };
            window.addEventListener('afterprint', handleAfterPrint);
            window.print();
            mode === 'purchase' ? navigate("/purchase") : navigate("/sale");
        }
        mode === 'purchase' ? navigate("/purchase") : navigate("/sale");
    }

    function validateNonEmptyRequiredFields() {
        let isValid = true;

        if (!selectedBillingParty || !selectedBillingParty.id) {
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
        if (transportFees) {
            if (isNaN(transportFees)) {
                setTransportFeesError("Transport fees must be a number");
                isValid = false;
            } else {
                setTransportFeesError("");
            }
        }
        if (amountFromOrToParty) {
            if (isNaN(amountFromOrToParty)) {
                setPaidAmountError("Amount must be a number");
                isValid = false;
            } else {
                setPaidAmountError("");
            }
        }
        if (remarks) {
            if (remarks.length > 500) {
                setRemarksError("Remarks must be less than 500 characters");
                isValid = false;
            }
        }

        if (invoiceItems.length === 0) {
            toast.error("Please add at least one item", {
                toastId: "add-invoice-item",
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
        handleSaveInvoice(true)
    }

    function handleSaveWithoutPrint() {
        handleSaveInvoice(false)
    }

    async function handleSaveInvoice(print) {
        const isValid = validateNonEmptyRequiredFields();
        if (!isValid) return;

        setIsSubmitting(true);
        const invoiceLines = invoiceItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.rate,
            report: item.report ? item.report : 0,
        }));

        const data = {
            billingPartyId: selectedBillingParty.id,
            date: date,
            remarks: remarks,
            vatAmount: vatAmount || 0,
            transportFee: transportFees || 0,
            invoiceNumber: invoiceNumber || 0
        };

        if (mode === 'purchase') {
            data.paidAmount = amountFromOrToParty || 0;
            data.purchaseLines = invoiceLines;
        } else {
            data.receivedAmount = amountFromOrToParty || 0;
            data.saleLines = invoiceLines;
        }

        try {
            if (mode === 'purchase') {
                await addPurchase(data).unwrap();
            } else {
                await addSale(data).unwrap();
            }
            handleSuccess(print);
        } catch (error) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
            toast.dismiss("add-invoice-loading");
        }
    }

    const handleRemarkChange = (value) => {
        setRemarks(value);
        setRemarksError("");
    };

    const handleInvoiceNumberChange = (value) => {
        setInvoiceNumber(value);
        setInvoiceNumberError("");
    };

    const handleItemSelected = (index, item) => {
        const newItems = invoiceItems.map((invoiceItem, idx) => {
            if (idx === index) {
                return item ? {...invoiceItem, itemName: item.name, itemId: item.id} : {
                    ...invoiceItem,
                    itemName: '',
                    itemId: ''
                };
            }
            return invoiceItem;
        });

        const newSubtotal = calculateSubtotal(newItems);
        const newVatAmount = showVAT ? newSubtotal * 0.13 : 0;
        const newTotalAmount = calculateTotalAmount(newItems, newVatAmount, transportFees);

        setInvoiceItems(newItems);
        setVatAmount(newVatAmount);
        setAmountFromOrToParty(checked ? newTotalAmount : amountFromOrToParty);

        const newErrors = [...itemErrors];
        newErrors[index].itemIdError = '';
        setItemErrors(newErrors);
    }

    if (isItemLoading) {
        return <div>Loading...</div>
    }

    if (itemsError) {
        return <div> Something went wrong while getting items</div>
    }

    let itemsData = [...items.items];

    const totalAmount = calculateTotalAmount(invoiceItems, vatAmount, transportFees);
    const remainingAmount = totalAmount - amountFromOrToParty;

    function onSelectedParty(party) {
        setSelectedBillingParty(party);
        setSelectedBillingPartyError("");
    }

    return (
        <Box sx={{margin: 2}}>
            <Typography variant="h5" gutterBottom mb={2}>
                Create {mode === 'purchase' ? 'Purchase' : 'Sales'} Invoice
            </Typography>
            <Typography gutterBottom mb={2}>The fields marked with * are mandatory </Typography>
            <Grid container spacing={2}>
                <Grid container item spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={4}>
                        <BillingPartyAutocomplete onChange={onSelectedParty}/>
                        {selectedBillingPartyError && (
                            <Typography color="error">{selectedBillingPartyError}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6} container spacing={2} justifyContent="space-between"
                          alignItems="center">
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
                                      maxDate={getBsToday()}
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
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">Kg</InputAdornment>
                                }}
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                                }}
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
                                <Grid container spacing={2} justifyContent={"space-between"}
                                      alignItems={"center"}>
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
                                                startAdornment: <InputAdornment
                                                    position="start">Rs.</InputAdornment>,
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
                                                startAdornment: <InputAdornment
                                                    position="start">Rs.</InputAdornment>,
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
                                    label={mode === 'sale' ? "Received Amount" : "Paid Amount"}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    }}
                                    value={amountFromOrToParty}
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
                                    label={mode === 'sale' ? "Received all amount" : "Paid all amount"}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2} className={"remaining-Amount"}>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    {mode === 'sale' ? "Remaining amount to receive " : "Remaining amount to pay"}
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveAndPrint}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : `Save and Print ${mode === 'purchase' ? 'Purchase' : 'Sale'} Invoice`}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveWithoutPrint}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : `Save ${mode === 'purchase' ? 'Purchase' : 'Sale'} Invoice`}
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
}

AddInvoice.propTypes = {
    mode: PropTypes.oneOf(['sale', 'purchase']).isRequired,
};


export default AddInvoice;
