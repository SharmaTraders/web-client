import {Avatar} from "@mui/material";
import React, {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import ManageItemComponent from "./ManageItemComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWarehouse} from "@fortawesome/free-solid-svg-icons/faWarehouse";
import {isMobile} from "../../../utils/SystemInfo";
import AddReduceStockComponent from "./AddReduceStockComponent";
import ItemActivityPhoneComponent from "./ItemActivityPhoneComponent";
import {useSelector} from "react-redux";
import {selectSelectedItem} from "../../../redux/features/state/itemState";


function ItemDetailsInfoCard() {
    const item = useSelector(selectSelectedItem);
    const [openAddModal, setOpenAddModal] = useState(false);

    if (!item) return <div className={"center"}> Please select an item to view details</div>


    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }


    return <div className={"bp-details-card"}>
        <div className={"bp-details-card-info"}>
            <div className={"bp-details-card-1"}>
                <Avatar
                    variant={"rounded"} sx={{
                    width: "60px",
                    height: "60px",
                }}>
                    {item.name.charAt(0)}
                </Avatar>


                <div className={"bp-details-card-avatar"}>
                    <div className={"bold"}> {item.name}</div>
                    <div className={"secondary-text"}>
                        <FontAwesomeIcon icon={faWarehouse}/>
                        {item.stockWeight} kg
                    </div>
                </div>
            </div>

            <div className={"item-details-card-2"}>
                <div className={"secondary-text"}>
                    Estimated Price (Per kg): Rs. {item.estimatedPricePerKilo}
                </div>

                <div className={"secondary-text"}>
                    Total estimated stock
                    price: {item.estimatedPricePerKilo !== 0 ? `Rs. ${item.stockWeight * item.estimatedPricePerKilo}` : "Estimated price is not set"}
                </div>

            </div>
        </div>

        <div className={"item-details-card-buttons"}>

            {
                isMobile() &&
                <>
                    <ItemActivityPhoneComponent/>
                    <AddReduceStockComponent/>
                </>

            }


            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size="small"
                    startIcon={<EditIcon/>}>
                Edit Item
            </Button>
            {
                openAddModal &&
                <ManageItemComponent open={openAddModal} handleClose={handleClose} mode={"edit"}/>
            }
        </div>
    </div>
}


export default ItemDetailsInfoCard;