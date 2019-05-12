import React from 'react';
import axios from 'axios';
import Linkify from 'react-linkify'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { inject, observer } from 'mobx-react';

const styles = {
    card: {
        boxShadow: 'none', border: 'solid 1px rgba(0, 0, 0, 0.12)'
    },
    cardTitle: {
        fontWeight: '700'
    },
    nestedList: {
        paddingLeft: '2.5rem',
    }
};

@inject('store')
@observer
class ProgramList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: (() => {
                var _collapseOpen = [];
                for (let i = 0; i < Object.keys(rbMonitor.programs).length; i++) {
                    _collapseOpen[i] = false;
                }
                return _collapseOpen;
            })(),
            dialogOpen: false,
            selectedTaskName: null,
            resultSnackOpen: false,
            resultSnackMsg: ''
        };
    }

    handleCollapseSwitch(idx) {
        var _collapseOpen = this.state.collapseOpen;
        _collapseOpen[idx] = !_collapseOpen[idx];
        this.setState({
            collapseOpen: _collapseOpen
        });
    }

    openDialog(taskName) {
        this.setState({
            dialogOpen: true,
            selectedTaskName: taskName
        });
    }

    closeDialog() {
        this.setState({
            dialogOpen: false
        });
    }

    handleExecResultOpen = (msg) => {
        this.setState({
            dialogOpen: false,
            resultSnackOpen: true,
            resultSnackMsg: msg
        });
    }

    handleExecResultClose = () => {
        this.setState({
            resultSnackOpen: false,
            resultSnackMsg: ''
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.cardTitle} variant="h6" component="h2">タスクを実行</Typography>
                    <Typography color="textSecondary">
                        プログラムを指定すると今すぐにタスクが実行されます
                    </Typography>
                </CardContent>
                <List component="nav">
                    {Object.keys(rbMonitor.programs).map((genre, idx) => {
                        return (
                            <React.Fragment key={genre}>
                                <ListItem button onClick={this.handleCollapseSwitch.bind(this, idx)}>
                                    <ListItemText primary={genre} />
                                    {this.state.collapseOpen[idx] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={this.state.collapseOpen[idx]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {rbMonitor.programs[genre].map((task, jdx) => {
                                            return (
                                                <ListItem key={task.name} button onClick={this.openDialog.bind(this, task.name)} className={classes.nestedList}>
                                                    <ListItemText primary={task.name} />
                                                </ListItem>
                                            );
                                        })
                                        }
                                    </List>
                                </Collapse>
                                <Divider />
                            </React.Fragment>
                        );
                    })}
                </List>
                <ProgramExecDialog
                    open={this.state.dialogOpen}
                    executable={!this.props.store.isRunning}
                    taskName={this.state.selectedTaskName}
                    handleResultOpen={this.handleExecResultOpen}
                    handleClose={this.closeDialog.bind(this)} />
                <ResultSnackbar open={this.state.resultSnackOpen} message={this.state.resultSnackMsg} handleClose={this.handleExecResultClose} />
            </Card>
        );
    }
}

class ProgramExecDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            task: null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            task: (() => {
                for (const genre of Object.values(rbMonitor.programs)) {
                    for (const task of genre) {
                        if (task.name == nextProps.taskName) return task;
                    }
                }
            })()
        });
    }

    handleExec = () => {
        this.setState({ loading: true });

        axios.get('/api/robo/start/' + this.state.task.name)
            .then(result => {
                if (result.status == 200) {
                    this.props.handleResultOpen('実行を開始しました');
                } else {
                    this.props.handleResultOpen('実行エラー：' + result.data.error);
                    console.log(result.data.error);
                }
                this.setState({ loading: false });
            })
            .catch(error => {
                this.props.handleResultOpen('実行エラー：' + error.message);
                console.log(error)
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.propshandleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.state.task ? this.state.task.name : null}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {(() => {
                            if (this.state.task) {
                                return (
                                    this.state.task.descript.split(/\\n|\\r\\n|\\r/).map(s => {
                                        return (
                                            <Linkify properties={{ target: '_blank', style: { color: '#3366BB', fontSize: '.75em', fontWeight: 'bold' } }}>
                                                <span key={s}>{s}<br /></span>
                                            </Linkify>
                                        );
                                    })
                                );
                            }
                        })()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {(() => {
                        if (this.state.task && this.state.task.command) {
                            return (
                                <>
                                    <Button onClick={this.props.handleClose} color="primary">
                                        キャンセル
                                    </Button>
                                    <Button
                                        onClick={this.handleExec}
                                        color="primary"
                                        autoFocus
                                        disabled={(this.state.task && !this.state.task.allowForceExec) && (this.state.loading || !this.props.executable)}>
                                        実行
                                    </Button>
                                </>
                            );
                        } else {
                            return (
                                <Button onClick={this.props.handleClose} color="primary">
                                    閉じる
                                </Button>
                            );
                        }
                    })()}
                </DialogActions>
            </Dialog>
        );
    }
}

class ResultSnackbar extends React.Component {
    render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.open}
                autoHideDuration={6000}
                onClose={this.props.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.props.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        );
    }
}

export default withStyles(styles)(ProgramList);