import React, { useState } from 'react';
import { Autocomplete, TextField, ListItem, ListItemText } from '@mui/material';
import ManageItemComponent from "../Item/ManageItemComponent";
import {setSelectedItem} from "../../../redux/features/state/itemState";

function ItemAutoComplete({ itemsData,  addNewItem }) {
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
        if (value && value.id === "add_new_item") {
            handleClickOpen();
        } else {
            setSelectedItem(value);
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
                    <ListItem {...props} key={option.id}>
                        <ListItemText primary={option.name} />
                    </ListItem>
                )}
                sx={{ width: '100%' }}
            />
            {openAddModal && (
                <ManageItemComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
            )}
        </>
    );
}

export default ItemAutoComplete;
