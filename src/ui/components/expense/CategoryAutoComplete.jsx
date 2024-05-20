import {useState} from "react";
import {useGetAllCategoriesQuery} from "../../../redux/features/api/expenseCategoryApi";
import {Autocomplete, ListItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddExpenseCategoryComponent from "./AddExpenseCategoryComponent";

function CategoryAutoComplete({onChange}) {
    const [openAddModal, setOpenAddModal] = useState(false);
    const {data} = useGetAllCategoriesQuery();
    const categories = data ? [...data.categories] : [];

    function handleClickOpen() {
        setOpenAddModal(true);
    }

    function handleClose() {
        setOpenAddModal(false);
    }

    const billingParty = categories.filter(category => category.toLowerCase() === "billing party");
    const otherCategories = categories.filter(category => category.toLowerCase() !== "billing party");

    const options = ["add_new_category", ...billingParty, ...otherCategories];

    const handleSelect = (event, value) => {
        if (!value) onChange({});
        if (value && value === "add_new_category") {
            handleClickOpen();
        } else {
            onChange(value);
        }
    };

    return <>
        <Autocomplete
            disablePortal
            renderInput={(params) => <TextField margin="dense" {...params} label={"Expense Category"} required/>}
            options={options}
            onChange={handleSelect}
            renderOption={(props, option) =>(
                option === "add_new_category" ? (
                    <Box {...props} className="add-new-button" onClick={handleClickOpen} key={option}>
                        <Typography variant="body2" color="primary">
                            + Add New Category
                        </Typography>
                    </Box>
                ) : (
                    <ListItem {...props} key={option}>
                        <ListItemText primary={option} />
                    </ListItem>
                )
            )}
        />
        {
            openAddModal && (
                <AddExpenseCategoryComponent open={openAddModal} handleClose={handleClose} mode={"add"} />
            )
        }

    </>
}

export default CategoryAutoComplete;