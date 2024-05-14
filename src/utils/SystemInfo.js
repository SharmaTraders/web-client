function isDarkThemePreferred(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isMobile(){
    return window.innerWidth < 768;
}
export { isDarkThemePreferred, isMobile };