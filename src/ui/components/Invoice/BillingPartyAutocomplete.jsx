import React, { useState } from 'react';
import { Autocomplete, TextField, ListItem, ListItemText, Box, Typography } from '@mui/material';
import ManageBillingPartyComponent from "../BillingParty/ManageBillingPartyComponent";
import {useGetBillingPartiesQuery} from "../../../redux/features/api/billingPartyApi";

function BillingPartyAutocomplete({onChange}) {
    const [openAddModal, setOpenAddModal] = useState(false);

    const {data} = useGetBillingPartiesQuery();

    const billingPartiesData = data ? [...data.parties] : [];

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    const cash = billingPartiesData.filter(party => party.name.toLowerCase() === "cash");
    const otherParties = billingPartiesData.filter(party => party.name.toLowerCase() !== "cash");

    const options = [{id: "add_new_party", name: "Add Party"},...cash, ...otherParties];

    const handleSelect = (event, value) => {
        if (value && value.id === "add_new_party") {
            handleClickOpen();
        } else {
            onChange(value);
        }
    };

    return (
        <>
            <Autocomplete
                disablePortal
                id="billing-party-autocomplete"
                options={options}
                getOptionLabel={(option) => option ? option.name : ""}
                renderInput={(params) => <TextField {...params} label="Billing Party" required/>}
                onChange={handleSelect}
                renderOption={(props, option) => (
                    option.id === "add_new_party" ? (
                        <Box {...props} className="add-new-button" onClick={handleClickOpen} key={option.id}>
                            <Typography variant="body2" color="primary">
                                + Add New Party
                            </Typography>
                        </Box>
                    ) : (
                        <ListItem {...props} key={option.id}>
                            <ListItemText primary={option.name} />
                        </ListItem>
                    )
                )}
                sx={{ width: '100%' }}
            />
            {openAddModal && (
                <ManageBillingPartyComponent open={openAddModal} handleClose={handleClose} mode={"add"} />
            )}
        </>
    );
}

export default BillingPartyAutocomplete;
