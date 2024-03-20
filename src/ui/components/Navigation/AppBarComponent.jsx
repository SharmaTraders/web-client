import React from 'react';
import { useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useLocation} from 'react-router-dom';
import {Avatar} from "@mui/material";

const drawerWidth = 240;

const getTitle = (pathname) => {
    switch (pathname) {
        case '/':
            return 'Dashboard';
        case '/parties':
            return 'Parties';
        case '/items':
            return 'Items';
        // Add more cases for different paths
        default:
            return 'Dashboard'; // default title
    }
};

function AppBarComponent({open, toggleDrawer}) {

    const theme = useTheme();
    const screenSize = useMediaQuery('(min-width:560px)');
    const location = useLocation();

    return (
        <MuiAppBar
            position="absolute"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...(open && {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }),
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    edge="start"
                    sx={{marginRight: '36px', ...(open && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
                {/* If it is on small screen and drawer is open remove title else show it */}
                {!open || screenSize ? (
                    <Typography variant="h6" noWrap component="div">
                        {getTitle(location.pathname)}
                    </Typography>
                ) : null}

                {/* Spacer to push the following content to the right */}
                <Box sx={{flexGrow: 1}}/>

                {/* User Profile Section */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Avatar
                        src="https://images.unsplash.com/photo-1526800544336-d04f0cbfd700?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        sx={{marginRight: 2}}/>
                    <Typography variant="subtitle1" noWrap>
                        Sharma Traders
                    </Typography>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
}

export {AppBarComponent};
