import React, {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import ManageItemComponent from "../../components/Item/ManageItemComponent";
import ItemInfoCard from "../../components/Item/ItemDetailsInfoCard";
import ItemList from "../../components/Item/ItemList";
import "./ItemsPage.css";

function ItemsPage() {
    const [openAddModal, setOpenAddModal] = useState(false);
    const isMobile = window.innerWidth < 768;


    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div className={"items-page"}>
        <div className={"item-header"}>
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
            <ManageItemComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
        </div>

        <div className={"item-content"}>
            <div className={"item-list"}>
                <ItemList/>
            </div>
            <div className={"item-details"}>
                <div className={"item-details-info"}>
                    <ItemInfoCard/>
                </div>

                {!isMobile && (
                    <div className={"item-details-history"}>
                        <p>
                            Item transaction list is not implemented yet...
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
}




export default ItemsPage;