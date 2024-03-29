import React from 'react';
import {DrawerComponent} from "./DrawerComponent";
import {AppBarComponent} from "./AppBarComponent";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {Outlet} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import {getCurrentTheme} from "../../themes/Theme";


function Navigation() {

    const defaultTheme = getCurrentTheme();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
                <DrawerComponent open={open} toggleDrawer={toggleDrawer}/>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    {/* Outlet is placed here so that main content can be seen inside the box */}
                    <Outlet/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export { Navigation };