import React from 'react';
import "./SideBarNavigation.css"
import RecyclingIcon from '@mui/icons-material/Recycling';
import aa from "./aa.svg"

function SideBarNavigation() {
    return (
        <div >
            <div className="sideBarLogo">
                <img src = {aa} alt="My Happy SVG"/>
            </div>
            {/* Drawer list items */}
            <ul className="nav-list">
                <li className="nav-item">
                    <span className="nav-icon">&#9776;</span>
                    <span className="nav-text">Overview</span>
                </li>
                <li className="nav-item">
                    <span className="nav-icon">&#9776;</span>
                    <span className="nav-text">Features</span>
                </li>
            </ul>
        </div>
    );
}

export default SideBarNavigation;