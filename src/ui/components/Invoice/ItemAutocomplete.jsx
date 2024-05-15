import React, { useState } from 'react';
import { Autocomplete, TextField, ListItem, ListItemText, Box, Typography } from '@mui/material';
import ManageItemComponent from "../Item/ManageItemComponent";
import { setSelectedItem } from "../../../redux/features/state/itemState";
import { useDispatch } from "react-redux";

function ItemAutoComplete({ itemsData, addNewItem, onItemSelected }) {
    const [openAddModal, setOpenAddModal] = useState(false);
    const dispatch = useDispatch();

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    const options = [
        { name: "Add New Item", id: "add_new_item" },
        ...itemsData
    ];

    const handleSelect = (event, value) => {
        if (value && value.id === "add_new_item") {
            handleClickOpen();
        } else {
            dispatch(setSelectedItem(value));
            onItemSelected(value);
        }
    };

    return (
        <>
            <Autocomplete
                disablePortal
                id="item-autocomplete"
                options={options}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Item" />}
                onChange={handleSelect}
                renderOption={(props, option) => (
                    option.id === "add_new_item" ? (
                        <Box {...props} className="add-new-button" onClick={handleClickOpen} key={option.id}>
                            <Typography variant="body2" color="primary">
                                + Add New Item
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
                <ManageItemComponent open={openAddModal} handleClose={handleClose} mode={"add"} />
            )}
        </>
    );
}

export default ItemAutoComplete;
