import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { inject, observer } from 'mobx-react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './components/header';
import Status from './components/Status';
import ScreenShotCard from './components/ScreenShotCard';
import ProgramList from './components/ProgramList';
import CommandCard from './components/CommandCard';

import SettingsStore from './stores/SettingsStore';
import MonitorStore from './stores/MonitorStore';
const settings = new SettingsStore();
const store = new MonitorStore();


const theme = createMuiTheme({
    palette: {
        type: settings.isDarkTheme ? 'dark' : 'light'
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Helvetica Neue"',
            '"Noto Sans JP"',
            'YuGothic',
            '"ヒラギノ角ゴ ProN W3"',
            'Hiragino Kaku Gothic ProN',
            'Arial',
            '"メイリオ"',
            'Meiryo',
            'sans-serif',
        ].join(',')
    }
});


const styles = theme => ({
    mainContent: {
        margin: 'auto',
        [theme.breakpoints.down('lg')]: {
            maxWidth: '90%'
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1280px'
        }
    },
    mainContentGrid: {
    }
});

@observer
class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <Provider settings={this.props.settings} store={this.props.store}>
                <MuiThemeProvider theme={theme} >
                    <CssBaseline />
                    <Header />
                    <Grid container className={classes.mainContent} spacing={24}>
                        <Grid item xs={12}>
                            <Status />
                        </Grid>
                        <Grid item className={classes.mainContentGrid} xs={12} md={8}>
                            <ScreenShotCard />
                        </Grid>
                        <Grid item className={classes.mainContentGrid} xs={12} md={4}>
                            <ProgramList />
                            {(() => {
                                if (this.props.settings.authorized) {
                                    return (
                                        <CommandCard />
                                    );
                                }
                            })()}
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </Provider>
        );
    }
}
const _App = withStyles(styles)(App);
render(<_App settings={settings} store={store} />, document.getElementById('app'));