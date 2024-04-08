import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./ui/pages/HomePage";
import {Parties} from "./ui/pages/Parties";
import {Navigation} from "./ui/components/Navigation/Navigation";import SignIn from "./ui/pages/Login/SignIn";
import {Items} from "./ui/pages/Items";


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
                element: <Parties/>
            },
            {
                path: "/items",
                element: <Items/>
            },
        ],
    },
    {
        path: "/signin",
        element: <SignIn/>
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
