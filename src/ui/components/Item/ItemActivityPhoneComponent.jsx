import Button from "@mui/material/Button";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import React, {useState} from "react";
import  {StocksTableModal} from "./ItemActivityComponent";

function ItemActivityPhoneComponent() {

    const [openModal , setOpenModal] = useState(false);

    function onShowHistory(){
        setOpenModal(true)
    }

    function handleClose(){
        setOpenModal(false);
    }

    return <>
        <Button variant="contained"
                onClick={onShowHistory}
                size="small"
                color="primary"
                startIcon={<ManageSearchIcon/>}
        >
            Stocks History
        </Button>

        {
            openModal
            &&
            <StocksTableModal open={openModal} handleClose={handleClose}/>

        }
    </>


}

export default ItemActivityPhoneComponent;