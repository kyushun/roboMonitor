import { createMuiTheme } from '@material-ui/core/styles';
import store from 'store';

export const theme = createMuiTheme({
    palette: {
        type: store.get('settings').isDarkTheme ? 'dark' : 'light'
    },
    typography: {
        fontFamily: '"Noto Sans JP", sans-serif'
    }
});