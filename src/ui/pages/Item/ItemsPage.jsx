import React, {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import ManageItemComponent from "../../components/Item/ManageItemComponent";
import ItemInfoCard from "../../components/Item/ItemDetailsInfoCard";
import ItemList from "../../components/Item/ItemList";
import "./ItemsPage.css";
import ItemActivityComponent from "../../components/Item/ItemActivityComponent";
import {isMobile} from "../../../utils/SystemInfo";

function ItemsPage() {
    const [openAddModal, setOpenAddModal] = useState(false);


    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                All Items
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size={"small"}
                    startIcon={<AddIcon/>}>
                Add Item
            </Button>
            {
                openAddModal &&
                <ManageItemComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>

            }
        </div>

        <div className={"page-content"}>
            <div className={"page-list"}>
                <ItemList/>
            </div>
            <div className={"page-details"}>
                <div className={"page-details-info"}>
                    <ItemInfoCard />
                </div>

                {!isMobile() && (
                    <div className={"item-details-history"}>
                       <ItemActivityComponent/>
                    </div>
                )}
            </div>
        </div>
    </div>
}




export default ItemsPage;