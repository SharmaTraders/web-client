import TopNavigationBar from "../components/Navigation/TopNavigationBar";
import SideBarNavigation from "../components/Navigation/SideBarNavigation";
import React, {useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./Root.css"
function Root() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="main-container">
            <div className={`sideBarNavigationContainer ${isSidebarOpen ? "open" : ""} `}>
                <SideBarNavigation/>
            </div>

            <div className="childrenContentContainer">
                <div className="topNavContainer">
                    <TopNavigationBar onMenuIconClick={toggleSidebar}/>
                </div>
                <div className="mainItemsContainer">
                {/*    Children Content goes over here */}
                </div>
            </div>
        </div>
    )
}
export default Root;