import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./ui/pages/Home/HomePage";
import {Navigation} from "./ui/components/Navigation/Navigation";
import SignInPage from "./ui/pages/Login/SignInPage";
import BillingPartiesPage from "./ui/pages/BillingParty/BillingPartiesPage";


const router = createHashRouter([
    {
        path: "/",
        element: <Navigation/>,
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
        <RouterProvider router={router}/>
    </div>
  );
}

export default App;
