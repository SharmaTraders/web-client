import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ManageStockComponent from "./ManageStockComponent";
import React, {useState} from "react";

function AddReduceStockComponent(){
    const [openModal, setOpenModal] = useState({
        mode: "",
        open: false
    });

    function handleClose() {
        setOpenModal({
            mode: "",
            open: false
        });
    }

    function onAddStockClick() {
        setOpenModal({
            mode: "add",
            open: true
        });
    }

    function onReduceStockClick() {
        setOpenModal({
            mode: "reduce",
            open: true
        });
    }
    return <>
        <Button variant="contained"
                color="primary"
                size={"small"}
                startIcon={<AddIcon/>}
                onClick={onAddStockClick}>
            Add Stock
        </Button>

        <Button variant="contained"
                color="error"
                size={"small"}
                startIcon={<RemoveIcon/>}
                onClick={onReduceStockClick}>
            Reduce stock
        </Button>
        {
            openModal.open
            &&
            <ManageStockComponent open={openModal.open} mode={openModal.mode} handleClose={handleClose}/>
        }
    </>

}

export default AddReduceStockComponent;