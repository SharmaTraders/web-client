import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import {AddItem} from "../components/item/AddItem";
import {ListOfItems} from "../components/item/ListOfItems";

function style() {
    return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
}

function Items() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div>
                <Button variant="contained" onClick={handleOpen}> <AddIcon/> Add new item</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style()}>
                        <AddItem/>
                    </Box>
                </Modal>
            </div>

            <ListOfItems></ListOfItems>
        </>
    );
}

export {Items}