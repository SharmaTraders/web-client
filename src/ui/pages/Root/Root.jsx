import React from 'react';
import Box from '@mui/material/Box';
import {Outlet} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import {AppBarComponent} from "../../components/Navigation/AppBarComponent";
import {DrawerComponent} from "../../components/Navigation/DrawerComponent";



function Root() {

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box
            id={"main"}
            sx={{display: 'flex'}}>
            <AppBarComponent open={open} toggleDrawer={toggleDrawer}/>
            <DrawerComponent open={open} toggleDrawer={toggleDrawer}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <div className={"content"}>
                    {/*All the content goes here..*/}
                    <Outlet/>
                </div>
            </Box>
        </Box>
    );
}

export {Root};