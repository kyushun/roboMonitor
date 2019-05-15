import React from 'react';
import axios from 'axios';
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
    version: {
        paddingLeft: '10px',
        color: '#999',
        fontSize: '.75rem',
        verticalAlign: 'middle'
    },
    section: {
        display: 'flex'
    },
    sectionSummary: {
        flexGrow: '1',
        minWidth: '200px'
    },
    divider: {
        margin: '1rem 0'
    },
    input: {
        display: 'none'
    },
    taskForm: {
        marginBottom: '1rem'
    },
    button: {
        margin: '0 .25rem'
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

    handleCsvSelected = (e) => {
        var params = new FormData();
        params.append('file', e.target.files[0]);
        axios.post('/api/system/tasklist', params)
            .then(function (response) {
                alert('タスクリストを更新しました');
                location.reload();
            })
            .catch(function (error) {
                console.log(error);
                alert('エラーが発生しました\r\n' + error);
            });
    }

    handleCsvRestore = () => {
        axios.post('/api/system/tasklist/restore')
            .then(() => {
                alert('タスクリストを復元しました');
                location.reload();
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status == 400) {
                    alert('【エラー】復元可能なバックアップファイルが見つかりませんでした');
                } else {
                    alert('【エラー】復元に失敗しました\r\n' + error.response);
                }
            });
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
                    <span className={classes.version}>Ver. {rbMonitor.version}</span>
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
                                value={this.state.authKey || ''}
                                onChange={this.handleValueChange.bind(this, 'authKey')}
                            />
                        </div>
                    </div>
                    {(() => {
                        if (this.props.settings.authorized) {
                            return (
                                <div>
                                    <Divider className={classes.divider} />
                                    <div className={classes.section}>
                                        <div className={classes.sectionSummary}><Typography>タスクリスト更新</Typography></div>
                                        <div className={`${classes.sectionForm} ${classes.taskForm}`}>
                                            <input
                                                accept="text/csv"
                                                className={classes.input}
                                                id="outlined-button-file"
                                                multiple
                                                type="file"
                                                onChange={this.handleCsvSelected.bind(this)}
                                            />
                                            <label htmlFor="outlined-button-file">
                                                <Button variant="outlined" color="primary" component="span" className={classes.button}>
                                                    アップロード
                                                </Button>
                                            </label>
                                            <Button variant="outlined" color="secondary" component="span" className={classes.button} onClick={this.handleCsvRestore}>
                                                復元
                                            </Button>
                                        </div>
                                    </div>
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
                                                value={this.state.ssFetchInterval || 2000}
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
                                                value={this.state.statusFetchInterval || 2000}
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
                    <Button color="secondary" style={{ marginRight: 'auto' }} onClick={e => { this.props.settings.reset() }}>
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