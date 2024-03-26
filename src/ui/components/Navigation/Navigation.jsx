import React from 'react';
import {DrawerComponent} from "./DrawerComponent";
import {AppBarComponent} from "./AppBarComponent";
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {Outlet} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import {getCurrentTheme} from "../../themes/Theme";


function Navigation() {

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
            <Box sx={{display: 'flex'}}>
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
                        <Outlet/>
                    </div>
                </Box>
            </Box>
    );
}

export {Navigation};