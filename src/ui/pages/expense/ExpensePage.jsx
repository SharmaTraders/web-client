import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useState} from "react";
import AddExpenseCategoryComponent from "../../components/expense/AddExpenseCategoryComponent";
import RegisterExpenseComponent from "../../components/expense/RegisterExpenseComponent";
import {isMobile} from "../../../utils/SystemInfo";
import ExpenseCategoryList from "../../components/expense/ExpenseCategoryList";
import {useSelector} from "react-redux";
import {selectSelectedCategory} from "../../../redux/features/state/expenseCategoryState";
import ExpenseActivityComponent from "../../components/expense/ExpenseActivityComponent";
import ExpenseActivityPhoneComponent from "../../components/expense/ExpenseActivityPhoneComponent";

function ExpensePage() {

    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openRegisterExpenseModal, setOpenRegisterExpenseModal] = useState(false);

    const selectedCategory = useSelector(selectSelectedCategory);

    function handleClickOpenExpense() {
        setOpenRegisterExpenseModal(true);
    }

    function handleCloseExpense() {
        setOpenRegisterExpenseModal(false);
    }


    function handleClickOpenCategory() {
        setOpenAddCategoryModal(true);
    }

    function handleCloseCategory() {
        setOpenAddCategoryModal(false);
    }


    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                Expense
            </h3>

            <div className={"item-activity-buttons"}>
                <Button variant="contained"
                        color="primary"
                        size="small"
                        onClick = {handleClickOpenExpense}
                        startIcon={isMobile() || <AddIcon/>}>
                    Register Expense
                </Button>

                <Button variant="contained"
                        color="primary"
                        size="small"
                        onClick = {handleClickOpenCategory}
                        startIcon={isMobile() || <AddIcon/>}>
                    Add Category
                </Button>
            </div>


            {
                openRegisterExpenseModal &&
                < RegisterExpenseComponent open={openRegisterExpenseModal} handleClose={handleCloseExpense}/>
            }

            {
                openAddCategoryModal &&
                < AddExpenseCategoryComponent open={openAddCategoryModal} handleClose={handleCloseCategory}/>
            }
        </div>

        <div className={"page-content"}>
            <div className={"page-list"}>
                <ExpenseCategoryList/>
            </div>
            {
                isMobile() ?
                    <>
                    {
                        selectedCategory &&
                        <ExpenseActivityPhoneComponent/>
                    }
                    </>
                    :
                    <div className={"page-details"}>
                        <ExpenseActivityComponent/>
                    </div>
            }

        </div>
    </div>

}

export default ExpensePage;