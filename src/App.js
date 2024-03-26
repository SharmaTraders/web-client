import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes} from "react-router-dom";
import {HomePage} from "./ui/pages/Home/HomePage";
import SignInPage from "./ui/pages/Login/SignInPage";
import BillingPartiesPage from "./ui/pages/BillingParty/BillingPartiesPage";
import {getCurrentTheme} from "./ui/themes/Theme";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {Root} from "./ui/pages/Root/Root";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "./redux/features/state/authstate";


const RequireAuth = ({children}) => {
    const userIsLogged = useSelector(selectIsLoggedIn);
    console.log(userIsLogged);// Your hook to get login status

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
                    <Route path={"/signin"} element={<SignInPage/>}/>
                    <Route path={""} element={
                        <RequireAuth>
                            <Root/>
                        </RequireAuth>
                    }>
                        <Route path={"/"} element={<HomePage/>}/>
                        <Route path={"/parties"} element={<BillingPartiesPage/>}/>

                    </Route>
                </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
