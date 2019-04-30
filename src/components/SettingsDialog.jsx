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
            ssFetchInterval: this.props.settings.ssFetchInterval,
            statusFetchInterval: this.props.settings.statusFetchInterval,
            authKey: this.props.settings.authKey
        };
    }

    handleSave = () => {
        var _obj = {};
        for (var s in this.state) {
            let _state = this.state;
            _obj[s] = eval(`_state.${s}`);
        }
        this.props.settings.setAll(_obj);
        this.handleClose();
    }

    handleClose = () => {
        this.setState({
            isDarkTheme: this.props.settings.isDarkTheme,
            autoFetch: this.props.settings.autoFetch,
            ssFetchInterval: this.props.settings.ssFetchInterval,
            statusFetchInterval: this.props.settings.statusFetchInterval,
            authKey: this.props.settings.authKey
        });
        this.props.handleClose();
    }

    handleSwitchChange = (name, e) => {
        this.setState({ [name]: e.target.checked });
    };

    handleValueChange = (name, e) => {
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
                                onChange={this.handleValueChange.bind(this, 'authKey')}
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
                                                label="Number"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                margin="normal"
                                                variant="outlined"
                                                value={this.state.ssFetchInterval}
                                                onChange={this.handleValueChange.bind(this, 'ssFetchInterval')}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.section}>
                                        <div className={classes.sectionSummary}><Typography>ステータス取得間隔 (ms)</Typography></div>
                                        <div className={classes.sectionForm}>
                                            <TextField
                                                label="Number"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                margin="normal"
                                                variant="outlined"
                                                value={this.state.statusFetchInterval}
                                                onChange={this.handleValueChange.bind(this, 'statusFetchInterval')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" style={{marginRight: 'auto'}} onClick={e => {this.props.settings.reset()}}>
                        設定をリセット
                    </Button>
                    <Button onClick={this.handleSave} color="primary" autoFocus>
                        保存
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                        キャンセル
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withMobileDialog()(withStyles(styles)(SettingsDialog));