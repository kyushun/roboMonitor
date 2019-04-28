import React from 'react';
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

class ProgramList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            selectedProgramIdx: null
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

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        タスクを実行
                    </Typography>
                    <Typography color="textSecondary">
                        プログラムを指定すると今すぐにタスクが実行されます
                    </Typography>
                </CardContent>
                <List component="nav">
                    <ListItem button>
                        <ListItemText onClick={this.openDialog.bind(this, 0)} primary="再起動" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText onClick={this.openDialog.bind(this, 1)} primary="PowerBI更新" />
                    </ListItem>
                </List>
                <ProgramExecDialog open={this.state.dialogOpen} idx={this.state.selectedProgramIdx} handleClose={this.closeDialog.bind(this)} />
            </Card>
        );
    }
}

class ProgramExecDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.propshandleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ({this.props.idx})Let Google help apps determine location. This means sending anonymous location data to
                        Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={this.props.handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ProgramList;