import { toast } from "react-toastify";
import { Avatar } from "@mui/material";
import stringAvatar from "../../../utils/stringAvatar";
import { getCurrentTheme } from "../../themes/Theme";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import SearchIcon from "@mui/icons-material/Search";

function ItemDetailsInfoCard({ item }) {
    if (!item) return <ItemDetailsInfoCardSkeleton />


    function onEdit() {
        toast.info("Edit is not implemented yet", {
            toastId: "edit-not-implemented",
            autoClose: 5000
        });
    }

    function onDelete() {
        toast.info("Delete is not implemented yet", {
            toastId: "delete-not-implemented",
            autoClose: 5000
        });
    }

    function onShowHistory() {
        toast.info("Show History is not implemented yet", {
            toastId: "show-history-not-implemented",
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
                    startIcon={<SearchIcon/>}
            >
                Search History
            </Button>

            <Button variant="contained"
                    onClick={onEdit}
                    size={"small"}
                    color="primary"
                    startIcon={<EditIcon/>}>
                Edit
            </Button>

            <Button variant="contained"
                    onClick={onDelete}
                    size={"small"}
                    color="error"
                    startIcon={<DeleteIcon/>}
            >
                Delete
            </Button>
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
