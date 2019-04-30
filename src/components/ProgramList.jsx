import React from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

@inject('store')
@observer
class ProgramList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            selectedProgramIdx: null,
            resultSnackOpen: false,
            resultSnackMsg: ''
        };
    }

    openDialog(idx) {
        this.setState({
            dialogOpen: true,
            selectedProgramIdx: idx
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
        return (
            <Card style={{ boxShadow: 'none', border: 'solid 1px rgba(0, 0, 0, 0.12)' }}>
                <CardContent>
                    <Typography style={{ fontWeight: '700' }} variant="h6" component="h2">タスクを実行</Typography>
                    <Typography color="textSecondary">
                        プログラムを指定すると今すぐにタスクが実行されます
                    </Typography>
                </CardContent>
                <List component="nav">
                    {rbMonitor.programs.map((p, idx) => {
                        return (
                            <ListItem button key={p.id}>
                                <ListItemText onClick={this.openDialog.bind(this, idx)} primary={p.name} />
                            </ListItem>
                        );
                    })}
                </List>
                <ProgramExecDialog executable={!this.props.store.isRunning} open={this.state.dialogOpen} idx={this.state.selectedProgramIdx} handleResultOpen={this.handleExecResultOpen} handleClose={this.closeDialog.bind(this)} />
                <ResultSnackbar open={this.state.resultSnackOpen} message={this.state.resultSnackMsg} handleClose={this.handleExecResultClose} />
            </Card>
        );
    }
}

class ProgramExecDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleExec = () => {
        this.setState({ loading: true });

        axios.get('/api/robo/start/' + rbMonitor.programs[Number(this.props.idx)].id)
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
                <DialogTitle id="alert-dialog-title">{rbMonitor.programs[Number(this.props.idx)].name}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {rbMonitor.programs[Number(this.props.idx)].descript.split(/\n|\r\n|\r/).map(s => {
                            return (
                                <span key={s}>{s}<br /></span>
                            );
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button onClick={this.handleExec} color="primary" autoFocus disabled={!rbMonitor.programs[Number(this.props.idx)].allowForceExec && (this.state.loading || !this.props.executable)}>
                        実行
                    </Button>
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

export default ProgramList;