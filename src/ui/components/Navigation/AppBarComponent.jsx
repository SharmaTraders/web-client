import React from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useLocation} from 'react-router-dom';
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
        case '/reports':
            return 'Reports';
        case '/employees':
            return 'Employees';
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
                        imgProps={{loading: "lazy"}}
                        src="https://scontent-cph2-1.xx.fbcdn.net/v/t39.30808-6/419252439_1463196244596538_4842537556956711715_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=5-aKC6YJtp4AX_90WTL&_nc_ht=scontent-cph2-1.xx&oh=00_AfBvRtJAgdQ8-A_NCJufe_M7oocG270mZwJrkANeB2zP8A&oe=6608D37B"
                        alt={"Profile picture"}
                        sx={{marginRight: 2}}/>
                    {isDesktop &&
                        <Typography variant="subtitle1" noWrap>
                            Sharma Traders
                        </Typography>
                    }

                </Box>
            </Toolbar>
        </MuiAppBar>
    );
}

export {AppBarComponent};
