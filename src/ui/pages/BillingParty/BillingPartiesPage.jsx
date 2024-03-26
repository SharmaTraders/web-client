import React, {useState} from "react";
import "./BillingParty.css"
import AddIcon from '@mui/icons-material/Add';
import AddBillingPartyComponent from "../../components/BillingParty/AddBillingPartyComponent";
import Button from "@mui/material/Button";
import BillingPartyList from "../../components/BillingParty/BillingPartyList";


function BillingPartiesPage() {

    const [openAddModal, setOpenAddModal] = useState(false)

    function handleClickOpen() {
        setOpenAddModal(true)
    }

    function handleClose() {
        setOpenAddModal(false)
    }

    return <div className={"billing-party-page"}>
        <div className={"bp-header"}>
            <h3>
                All Parties
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size={"small"}
                    startIcon={<AddIcon/>}>
                Add Party
            </Button>
            <AddBillingPartyComponent open={openAddModal} handleClose={handleClose}/>

        </div>

        <div className={"bp-content"}>
            <div className={"bp-list"}>
                <BillingPartyList/>
            </div>

            <div className={"bp-details"}>

            </div>

        </div>

    </div>
}





export default BillingPartiesPage;