import {getCurrentTheme} from "../ui/themes/Theme";

 export  default function stringAvatar(name) {
    let initials;
    if (name.includes(' ')) {
        initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase();
    } else {
        initials = name.substring(0, 1).toUpperCase();
    }
    return {
        sx: {
            bgcolor: getCurrentTheme().palette.primary.light,
        },
        children: initials,
    };
}