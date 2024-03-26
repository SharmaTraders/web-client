import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {RouterProvider, createHashRouter} from "react-router-dom";
import {HomePage} from "./ui/pages/Home/HomePage";
import {Navigation} from "./ui/components/Navigation/Navigation";
import SignInPage from "./ui/pages/Login/SignInPage";
import BillingPartiesPage from "./ui/pages/BillingParty/BillingPartiesPage";
import {getCurrentTheme} from "./ui/themes/Theme";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "./redux/features/state/authstate";


const router = createHashRouter([
    {
        path: "/",
        element: <Navigation/>,
        guard: "auth",
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/parties",
                element: <BillingPartiesPage/>
            },
        ],
    },
    {
        path: "/signin",
        element: <SignInPage/>
    }
])

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
                <RouterProvider router={router} />
            </ThemeProvider>
        </div>
    );
}

export default App;
