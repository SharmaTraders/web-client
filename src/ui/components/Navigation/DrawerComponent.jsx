import React from 'react';
import { useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useMediaQuery from '@mui/material/useMediaQuery';
import {mainListItems, secondaryListItems} from "./NavigationItems";

const drawerWidth = 240;

function DrawerComponent({open, toggleDrawer}) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <MuiDrawer
            variant="permanent"
            open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'relative',
                    whiteSpace: 'nowrap',
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
                    px: [1],
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>

            <Divider/>

            {/* Applying conditional style based on `open` state and `isMobile` */}
            <List sx={{...(isMobile && !open && {display: 'none'})}}>
                {mainListItems}
            </List>

            <Divider/>

            <List sx={{...(isMobile && !open && {display: 'none'})}}>
                {secondaryListItems}
            </List>

        </MuiDrawer>
    );
}

export {DrawerComponent}