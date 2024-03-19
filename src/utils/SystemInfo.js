function isDarkThemePreferred(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
export { isDarkThemePreferred };