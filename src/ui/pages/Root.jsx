import Navbar from "../components/Navbar/Navbar";
import {Outlet} from "react-router-dom";

function Root() {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>

    )
}
export default Root;