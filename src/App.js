import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes} from "react-router-dom";
import {HomePage} from "./ui/pages/Home/HomePage";
import SignInPage from "./ui/pages/Signin/SignInPage";
import BillingPartiesPage from "./ui/pages/BillingParty/BillingPartiesPage";
import {getCurrentTheme} from "./ui/themes/Theme";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {Root} from "./ui/pages/Root/Root";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "./redux/features/state/authstate";
import ItemsPage from "./ui/pages/Item/ItemsPage";
import IncomePage from "./ui/pages/Income/IncomePage";
import React from "react";
import AddInvoice from "./ui/components/Invoice/AddInvoice";
import InvoicePage from "./ui/pages/Invoice/InvoicePage";
import ExpensePage from "./ui/pages/expense/ExpensePage";
import EmployeePage from "./ui/pages/Employee/EmployeePage";
import AllTransactionsReportPage from "./ui/pages/reports/AllTransactionsReportPage";
import StocksSummaryReportsPage from "./ui/pages/reports/StocksSummaryReportsPage";
import ExpenseByCategoryReport from "./ui/pages/reports/ExpenseByCategoryReport";

const RequireAuth = ({children}) => {
    const userIsLogged = useSelector(selectIsLoggedIn);

    if (!userIsLogged) {
        return <SignInPage/>;
    }
    return children;
};


const defaultTheme = getCurrentTheme();


function App() {
    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover/>
            <ThemeProvider theme={defaultTheme}>
                <CssBaseline/>
                <Routes>
                    <Route path={""} element={
                        <RequireAuth>
                            <Root/>
                        </RequireAuth>
                    }>
                        <Route path={"/"} element={<HomePage/>}/>
                        <Route path={"/parties"} element={<BillingPartiesPage/>}/>
                        <Route path={"/items"} element = {<ItemsPage/>}/>
                        <Route path={"/purchaseInvoice"} element = {<AddInvoice mode={"purchase"}/>}/>
                        <Route path={"/purchase"} element = {<InvoicePage mode={"purchase"}/>}/>
                        <Route path={"/sale"} element = {<InvoicePage mode={"sale"}/>}/>
                        <Route path={"/incomes"} element = {<IncomePage/>}/>
                        <Route path={"/expenses"} element = {<ExpensePage/>}/>
                        <Route path={"/saleInvoice"} element = {<AddInvoice mode={"sale"}/>}/>
                        <Route path={"/employees"} element = {<EmployeePage/>}/>
                        <Route path={"/reports/all-transactions"} element = {<AllTransactionsReportPage/>}/>
                        <Route path={"/reports/stock-summary"} element = {<StocksSummaryReportsPage/>}/>
                        <Route path={"/reports/expense-by-category"} element = {<ExpenseByCategoryReport/>}/>
                    </Route>
                </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
