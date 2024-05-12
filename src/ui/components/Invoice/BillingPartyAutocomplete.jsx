import React, {useState} from 'react';
import {Autocomplete, TextField, ListItem, ListItemText} from '@mui/material';
import ManageBillingPartyComponent from "../BillingParty/ManageBillingPartyComponent";
import {setSelectedBillingParty} from "../../../redux/features/state/billingPartyState";

function BillingPartyAutocomplete({billingPartiesData, setSelectedBillingPartyFromInvoice, addNewParty}) {
    const [openAddModal, setOpenAddModal] = useState(false);

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    const options = [
        {name: "Cash Purchase", id: "cash_purchase"},
        {name: "Add New Party", id: "add_new_party"},
        ...billingPartiesData
    ];

    const handleSelect = (event, value) => {
        if (value && value.id === "add_new_party") {
            handleClickOpen();
        } else {
            setSelectedBillingParty(value);
        }
    };

    return (
        <>
            <Autocomplete
                disablePortal
                id="billing-party-autocomplete"
                options={options}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Billing Party"/>}
                onChange={handleSelect}
                renderOption={(props, option) => (
                    <ListItem {...props} key={option.id}>
                        <ListItemText primary={option.name}/>
                    </ListItem>
                )}
                sx={{width: '100%'}}
            />
            {openAddModal && (
                <ManageBillingPartyComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
            )}
        </>
    );
}

export default BillingPartyAutocomplete;
