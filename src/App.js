import './App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import Root from "./ui/pages/Root";
import SignIn from "./ui/pages/Login/SignIn";


const router = createHashRouter([
    {
        path: "/",
        element: <Root/>,
        children : [

        ]
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
