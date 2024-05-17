import {useState} from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RegisterIncomeComponent from "../../components/Income/RegisterIncomeComponent";

function IncomePage() {
    const [openAddModal, setOpenAddModal] = useState(false);

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

    </div>
}

export default IncomePage;