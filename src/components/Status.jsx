import React from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
    statusCard: {
        padding: '.5rem 1rem',
        boxShadow: 'none'
    },
    using: {
        color: red['900'],
        border: `solid 2px ${red['200']}`,
        //background: red['100']
    },
    free: {
        color: green['900'],
        border: `solid 1px ${green['200']}`,
        background: green['100']
    },
    status: {
        fontSize: '1.1rem'
    },
    statusDesk: {
        fontSize: '.75rem',
    },
    statusSummary: {
        position: 'relative',
        color: '#333',
        fontSize: '1.5rem',
        fontWeight: '900'
    },
    statusDetail: {
        padding: '0 1rem',
        color: '#888',
    },
    statusDetailItem: {
        padding: '.25rem 0',
        '&+ &': {
            borderTop: 'solid 1px rgba(0, 0, 0, 0.12)'
        }
    }
});


@inject('store')
@observer
class Status extends React.Component {
    componentDidMount() {
        this.fetchStatus();
    }

    fetchStatus = () => {
        axios.get('/api/robo/status')
            .then(result => {
                this.props.store.setRoboStatus(result.data.processName);
            });
    }

    render() {
        const { classes } = this.props;

        if (this.props.store.isRunning) {
            return (
                <div>
                    <div className={classes.statusSummary}>使用中</div>
                    <div className={classes.statusDetail}>
                        {this.props.store.runningProcess.map(p => (
                            <div className={classes.statusDetailItem} key={p.startTime}>{(() => {
                                let date = new Date(p.startTime);
                                return ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2);
                            })()} - {p.windowTitle}</div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return <div className={classes.statusSummary}>使用可能</div>
        }
    }
}

export default withStyles(styles)(Status);