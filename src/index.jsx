import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './components/header';
import ScreenShotCard from './components/ScreenShotCard';
import ProgramList from './components/ProgramList';

import MonitorStore from './stores/MonitorStore';
import { theme } from './components/theme';

const store = new MonitorStore();

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

class App extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme} >
                    <Header />
                    <Grid className={classes.mainContent} container spacing={24}>
                        <Grid className={classes.mainContentGrid} item xs={12} md={6}>
                            <ScreenShotCard />
                        </Grid>
                        <Grid className={classes.mainContentGrid} item xs={12} md={6}>
                            <ProgramList />
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </Provider>
        );
    }
}
const _App = withStyles(styles)(App);
render(<_App />, document.getElementById('app'));