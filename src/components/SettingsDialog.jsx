import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Switch from '@material-ui/core/Switch';
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

@inject('store')
@observer
class SettingsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.settings;
    }

    handleSave = () => {
        this.props.store.setSettings({
            isDarkTheme: this.state.isDarkTheme,
            autoFetch: this.state.autoFetch
        });
        this.handleClose();
        location.reload();
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleChange = name => e => {
        this.setState({ [name]: e.target.checked });
    };

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
                                onChange={this.handleChange('isDarkTheme')}
                            />
                        </div>
                    </div>
                    <div className={classes.section}>
                        <div className={classes.sectionSummary}><Typography>自動更新</Typography></div>
                        <div className={classes.sectionForm}>
                            <Switch
                                checked={this.state.autoFetch}
                                color="primary"
                                onChange={this.handleChange('autoFetch')}
                            />
                        </div>
                    </div>
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