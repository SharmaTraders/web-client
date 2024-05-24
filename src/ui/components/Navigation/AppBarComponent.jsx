import React from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {NavLink, useLocation} from 'react-router-dom';
import {Avatar} from "@mui/material";

function getTitle(pathname) {
    switch (pathname) {
        case '/':
            return 'Dashboard';
        case '/parties':
            return 'Parties';
        case '/items':
            return 'Items';
        case '/purchase':
            return 'Purchase';
        case '/sale':
            return 'Sale';
        case '/expenses':
            return 'Expenses';
        case '/purchaseInvoice':
            return 'Purchase Invoice';
        case '/saleInvoice':
            return 'Sale Invoice';
        case '/incomes':
            return 'Income';
        case '/employees':
            return 'Employees';
        case '/reports/all-transactions':
            return 'All Transactions';
        case '/reports/stock-summary':
            return 'All Transactions';
        default:
            return 'Dashboard'; // default title
    }
}

function AppBarComponent({open, toggleDrawer}) {

    const drawerWidth = 190;
    const theme = useTheme();
    const isDesktop = useMediaQuery('(min-width:560px)');
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
                backgroundColor: "white",
                color: theme.palette.text.primary,

                ...(open && {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }),
            }}
            variant={"dense"}
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
                {!open || isDesktop ? (
                    <Typography variant="h6" noWrap component="div">
                        {getTitle(location.pathname)}
                    </Typography>
                ) : null}

                {/* Spacer to push the following content to the right */}
                <Box sx={{flexGrow: 1}}/>

                {/* User Profile Section */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Avatar
                        alt={"Profile picture"}
                        sx={{marginRight: 2}}>
                        ST
                    </Avatar>
                    {isDesktop &&
                        <NavLink to={"/"}>
                            <div id={"logo"} className={"hard-title animate-text"}>
                                Sharma Traders
                            </div>
                        </NavLink>

                    }

                </Box>
            </Toolbar>
        </MuiAppBar>
    );
}

export {AppBarComponent};
