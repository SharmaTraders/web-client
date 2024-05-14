import React from 'react';
import { useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {MainListItems, SecondaryListItems} from "./NavigationItems";
import {isMobile} from "../../../utils/SystemInfo";

function DrawerComponent({open, toggleDrawer}) {

    const drawerWidth = 190;
    const theme = useTheme();

    return (
        <MuiDrawer
            variant="permanent"
            open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    // backgroundColor: theme.palette.secondary.main,
                    width: drawerWidth,
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),

                    boxSizing: 'border-box',
                    ...(!open && {
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        width: theme.spacing(0), // Removes Icon space while on mobile
                        [theme.breakpoints.up('sm')]: {
                            width: theme.spacing(9),
                        },
                    }),
                },
            }}
        >
                <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: "white",
                    color: theme.palette.text.primary,
                    px: [1],
                }}

            >
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>

            <Divider/>

            {/* Applying conditional style based on `open` state and `isMobile` */}
            <List sx={{...(isMobile() && !open && {display: 'none'})}}>
                <MainListItems/>
            </List>

            <Divider/>

            <List sx={{...(isMobile() && !open && {display: 'none'})}}>
                <SecondaryListItems/>
            </List>

        </MuiDrawer>
    );
}

export {DrawerComponent}