import {isDarkThemePreferred} from "../../utils/SystemInfo";
import {createTheme} from "@mui/material/styles";

// This matches our websites theme with the default preferred theme. This can also later be a functionality in our system settings.
function getCurrentTheme(){
    if (isDarkThemePreferred()){
        return createTheme({
            palette: {
                mode: 'dark',
            },
        })
    }
    return createTheme();
}

export {getCurrentTheme};