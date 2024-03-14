import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./TopNavigationBar.css";

function TopNavigationBar({onMenuIconClick}){
    return (
        <div className="topNavigationBarContainer">
            <div className="menu-icon" onClick={onMenuIconClick}> {/* This will call the toggle function */}
                <MenuIcon />
            </div>
            <div className="topNavBarLogo">
                <h1>Sharma Traders</h1>
            </div>
            <div className="profile-section">
                <div className="profile-image">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profile" />
                </div>
                <div className="profile-name">
                    <h3>Sharma Traders</h3>
                </div>
            </div>
        </div>
    )
}


export default TopNavigationBar;