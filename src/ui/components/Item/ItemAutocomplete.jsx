import React, { useState} from 'react';
import { Autocomplete, TextField, ListItem, ListItemText, Box, Typography } from '@mui/material';
import ManageItemComponent from "./ManageItemComponent";

function ItemAutoComplete({ itemsData, onItemSelected }) {
    const [openAddModal, setOpenAddModal] = useState(false);

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
        if(value){
            if (value.id === "add_new_item") {
                handleClickOpen();
            } else {
                onItemSelected(value);
            }
        }else {
            onItemSelected([]);
        }

    };

    return (
        <>
            <Autocomplete
                disablePortal
                id="item-autocomplete"
                options={options}
                getOptionLabel={(option) => option ? option.name : ""}
                renderInput={(params) => <TextField {...params} label="Item" required/>}
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
