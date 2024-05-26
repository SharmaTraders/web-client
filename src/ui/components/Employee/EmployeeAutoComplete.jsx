import {useState} from "react";
import {useGetAllEmployeesQuery} from "../../../redux/features/api/employee";
import {Autocomplete, ListItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ManageEmployeeComponent from "./ManageEmployeeComponent";

function EmployeeAutoComplete({onChange}) {
    const [openAddModal, setOpenAddModal] = useState(false);
    const {data} = useGetAllEmployeesQuery();

    const employees = data ? [...data.employees] : [];

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    const options = ["add_new_employee", ...employees];

    function handleSelect(event, value) {
        if (!value) onChange({});
        if (value && value === "add_new_employee") {
            handleClickOpen();
        } else {
            onChange(value);
        }
    }

    return <>
        <Autocomplete
            disablePortal
            renderInput={(params) => <TextField margin="dense" {...params} label="Employee" required/>}
            options={options}
            getOptionLabel={(option) => option ? option.name : ""}
            onChange={handleSelect}
            renderOption={(props, option) => (
                option === "add_new_employee" ? (
                    <Box {...props} className="add-new-button" onClick={handleClickOpen} key={option}>
                        <Typography variant="body2" color="primary">
                            + Add New Employee
                        </Typography>
                    </Box>
                ) : (
                    <ListItem {...props} key={option.id}>
                        <ListItemText primary={option.name}/>
                    </ListItem>
                )
            )}
        />
        {
            openAddModal && (
                <ManageEmployeeComponent open={openAddModal} handleClose={handleClose} mode={"add"}/>
            )
        }
    </>


}

export default EmployeeAutoComplete;