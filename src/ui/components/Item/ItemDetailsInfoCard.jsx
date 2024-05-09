import { toast } from "react-toastify";
import { Avatar } from "@mui/material";
import stringAvatar from "../../../utils/stringAvatar";
import { getCurrentTheme } from "../../themes/Theme";
import React, {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ManageItemComponent from "./ManageItemComponent";
import {useSelector} from "react-redux";
import {selectSelectedItem} from "../../../redux/features/state/itemState";

function ItemDetailsInfoCard() {
    const item = useSelector(selectSelectedItem);
    const [openAddModal, setOpenAddModal] = useState(false);
    if (!item) return <ItemDetailsInfoCardSkeleton />

    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    function onShowHistory() {
        toast.info("Transaction History is not implemented yet", {
            toastId: "transaction-history-not-implemented",
            autoClose: 5000
        });
    }

    return <div className={"item-details-card"}>
        <div className={"item-details-card-info"}>
            <div className={"item-details-card-1"}>
                <Avatar
                    variant={"rounded"}
                    {...stringAvatar(item.name)}
                    sx={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: getCurrentTheme().palette.primary.light
                    }}/>

                <div className={"item-details-card-avatar"}>
                    <div className={"bold"}> {item.name}</div>
                </div>
            </div>

            <div className={"item-details-card-2"}>
                <div className={"item-balance"}>
                    {/*Quantity: {item.quantity}*/}
                    Quantity: 10
                </div>
                <div className={"item-balance"}>
                    {/*Estimated Value: Rs. {item.estimatedValue}*/}
                    Estimated Value: Rs. 1000
                </div>
            </div>
        </div>

        <div className={"item-details-card-buttons"}>
            <Button variant="contained"
                    onClick={onShowHistory}
                    size={"small"}
                    color="primary"
                    startIcon={<ManageSearchIcon />}
            >
                Transaction History
            </Button>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size={"small"}
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

function ItemDetailsInfoCardSkeleton() {
    return <div className={"item-details-card"}>
        <div className={"item-details-card-info"}>
            <div className={"item-details-card-1"}>
                <Skeleton animation="wave" variant="rounded" width={60} height={60}/>
                <div className={"item-details-card-avatar"}>
                    <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
                </div>
            </div>

            <div className={"item-details-card-2"}>
                <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
                <Skeleton animation="wave" variant="rounded" width={100} height={10}/>
            </div>
        </div>

        <div className={"item-details-card-buttons"}>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
            <Skeleton animation="wave" variant="rounded" width={40} height={10}/>
        </div>
    </div>
}

export default ItemDetailsInfoCard;