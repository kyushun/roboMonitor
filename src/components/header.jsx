import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import SettingsDialog from './SettingsDialog';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        };
    }

    handleSettingsOpen = () => {
        this.setState({
            dialogOpen: true
        });
    }

    handleSettingsClsoe = () => {
        this.setState({
            dialogOpen: false
        });
    }

    render() {
        return (
            <div>
                <AppBar position="relative" color="default" style={{ boxShadow: 'none', border: 'solid 1px rgba(0, 0, 0, 0.12)' }}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flexGrow: '1' }}>
                            Robopat Monitor
                        </Typography>
                        <IconButton
                            color="inherit"
                            onClick={this.handleSettingsOpen}
                        >
                            <Settings />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <SettingsDialog open={this.state.dialogOpen} handleClose={this.handleSettingsClsoe} />
            </div>
        );
    }
}

export default Header;