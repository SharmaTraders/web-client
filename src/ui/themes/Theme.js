import {createTheme} from "@mui/material/styles";

// This matches our websites theme with the default preferred theme. This can also later be a functionality in our system settings.
function getCurrentTheme(){
    // if (isDarkThemePreferred()){
    //     return createTheme({
    //         palette: {
    //             mode: 'dark',
    //         },
    //     })
    // }
    return createTheme({
        palette:{
            primary: {
                main: '#00a878',
            },
            secondary: {
                main: '#d8f1a0',

            },
            text:{
                primary: '#0b0500',
                secondary: '#3f3c3c'
            },
            error:{
                main : "#e3526e"
            },
            warning:{
                main: "#f3c178"
            },
        },
        typography: {
            button: {
                textTransform: 'none'
            },
            fontSize: 12
        }
    });
}

export {getCurrentTheme};