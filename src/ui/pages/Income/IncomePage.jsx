import {useState} from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RegisterIncomeComponent from "../../components/Income/RegisterIncomeComponent";
import BillingPartyList from "../../components/BillingParty/BillingPartyList";
import {isMobile} from "../../../utils/SystemInfo";
import IncomeActivityComponent from "../../components/Income/IncomeActivityComponent";
import IncomeActivityPhoneComponent from "../../components/Income/IncomeActivityPhoneComponent";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import {useSelector} from "react-redux";

function IncomePage() {
    const [openAddModal, setOpenAddModal] = useState(false);
    const selectedBillingParty = useSelector(selectSelectedBillingParty);

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                Income
            </h3>

            <Button variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    size="small"
                    startIcon={<AddIcon/>}>
                Register Income
            </Button>

            {openAddModal &&
                <RegisterIncomeComponent open={openAddModal} handleClose={handleClose}/>
            }
        </div>

        <div className={"page-content"}>
            <div className={"page-list"}>
                <BillingPartyList/>
            </div>
            {
                isMobile() ?
                    <>
                        {
                            selectedBillingParty &&
                                <IncomeActivityPhoneComponent/>
                        }
                    </>
                    :
                    <div className={"page-details"}>
                        <IncomeActivityComponent/>
                    </div>
            }

        </div>

    </div>
}

export default IncomePage;