import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    title: {
        fontSize: '1.5rem',
        fontWeight: '900'
    },
    section: {
        display: 'flex'
    },
    sectionSummary: {
        flexGrow: '1',
        minWidth: '200px'
    },
    sectionForm: {

    }
};

@inject('settings')
@observer
class SettingsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkTheme: this.props.settings.isDarkTheme,
            autoFetch: this.props.settings.autoFetch,
            authKey: this.props.settings.authKey
        };
    }

    handleSave = () => {
        for (var s in this.state) {
            let _state = this.state;
            this.props.settings.set(s, eval(`_state.${s}`));
        }
        this.handleClose();
    }

    handleClose = () => {
        this.setState({
            isDarkTheme: this.props.settings.isDarkTheme,
            autoFetch: this.props.settings.autoFetch
        });
        this.props.handleClose();
    }

    handleSwitchChange = (name, e) => {
        this.setState({ [name]: e.target.checked });
    };

    handleTextChange = (name, e) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                fullScreen={this.props.fullScreen}
                open={this.props.open}
                className={classes.dialog}
            >
                <DialogTitle>
                    <span className={classes.title}>設定</span>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.section}>
                        <div className={classes.sectionSummary}><Typography>ダークテーマ</Typography></div>
                        <div className={classes.sectionForm}>
                            <Switch
                                checked={this.state.isDarkTheme}
                                color="primary"
                                onChange={this.handleSwitchChange.bind(this, 'isDarkTheme')}
                            />
                        </div>
                    </div>
                    <div className={classes.section}>
                        <div className={classes.sectionSummary}><Typography>自動更新</Typography></div>
                        <div className={classes.sectionForm}>
                            <Switch
                                checked={this.state.autoFetch}
                                color="primary"
                                onChange={this.handleSwitchChange.bind(this, 'autoFetch')}
                            />
                        </div>
                    </div>
                    <div className={classes.section}>
                        <div className={classes.sectionSummary}><Typography>管理ユーザー認証</Typography></div>
                        <div className={classes.sectionForm}>
                            <TextField
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                variant="outlined"
                                value={this.state.authKey}
                                onChange={this.handleTextChange.bind(this, 'authKey')}
                            />
                        </div>
                    </div>
                    {(() => {
                        if (this.props.settings.authorized) {
                            return (
                                <div>
                                    <Divider />
                                    <div className={classes.section}>
                                        <div className={classes.sectionSummary}><Typography>SS取得間隔 (ms)</Typography></div>
                                        <div className={classes.sectionForm}>
                                            <TextField
                                                id="outlined-number"
                                                label="Number"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSave} color="secondary" autoFocus>
                        Save
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withMobileDialog()(withStyles(styles)(SettingsDialog));