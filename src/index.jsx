import React from 'react';
import { render } from 'react-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import Header from './components/header';

import { theme } from './components/theme';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={theme} >
                <Header />
            </MuiThemeProvider>
        );
    }
}

render(<App />, document.getElementById('app'));