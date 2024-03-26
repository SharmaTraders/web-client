import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CategoryIcon from '@mui/icons-material/Category';
import {Link} from 'react-router-dom';
import {Fragment} from "react";

function MainListItems() {
    return (
        <Fragment>
            <ListItemButton component={Link} to={"/"}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/parties"}>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Billing Parties"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/items"}>
                <ListItemIcon>
                    <CategoryIcon/>
                </ListItemIcon>
                <ListItemText primary="Items"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/purchase"}>
                <ListItemIcon>
                    <ShoppingCartIcon/>
                </ListItemIcon>
                <ListItemText primary="Purchase"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/sales"}>
                <ListItemIcon>
                    <ReceiptIcon/>
                </ListItemIcon>
                <ListItemText primary="Sales"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/expenses"}>
                <ListItemIcon>
                    <MoneyOffIcon/>
                </ListItemIcon>
                <ListItemText primary="Expenses"/>
            </ListItemButton>

            <ListItemButton component={Link} to={"/income"}>
                <ListItemIcon>
                    <CurrencyRupeeIcon/>
                </ListItemIcon>
                <ListItemText primary="Income"/>
            </ListItemButton>
        </Fragment>
    )
}

function SecondaryListItems() {
    return (
        <Fragment>

            <ListSubheader component="div" inset>
                Reports
            </ListSubheader>

            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Day Book"/>
            </ListItemButton>

            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Purchase Reports"/>
            </ListItemButton>

            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Sell Reports"/>

            </ListItemButton>
        </Fragment>
    )
}

export {MainListItems, SecondaryListItems}