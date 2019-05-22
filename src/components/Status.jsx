import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
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
    },
    statusBadge: {
        fontSize: '.75em',
        paddingRight: '.5rem',
        verticalAlign: 'bottom'
    },
    infiniteLoopWarning: {
        display: 'inline-block',
        marginLeft: '.5rem',
        padding: '0 .5rem',
        fontSize: '.75rem',
        color: '#e65100',
        border: 'solid 1px #e65100',
        borderRadius: '4px',
        verticalAlign: 'middle'
    }
});


@inject('store', 'settings')
@observer
class Status extends React.Component {
    componentDidMount() {
        this.fetchStatus();
        if (this.props.settings.autoFetch) {
            this.fetchInterval = setInterval(() => {
                this.fetchStatus();
            }, this.props.settings.statusFetchInterval);
        }
    }

    fetchStatus = () => {
        axios.get('/api/robo/status', { timeout: this.props.settings.statusFetchInterval + 500 })
            .then(result => {
                this.props.store.setRoboStatus(result.data.processName);
            })
            .catch(err => {
                this.props.store.connected = false;
            });
    }

    render() {
        const { classes } = this.props;

        if (!this.props.store.connected) {
            return <Typography className={classes.statusSummary}><span className={classes.statusBadge} style={{ color: '#ff9800' }}>●</span>接続中...</Typography>
        } else if (!this.props.store.executable) {
            return (
                <div>
                    <Typography className={classes.statusSummary}><span className={classes.statusBadge} style={{ color: '#f44336' }}>●</span>使用中</Typography>
                    <div className={classes.statusDetail}>
                        {this.props.store.runningProcess.map(p => (
                            <div className={classes.statusDetailItem} key={p.startTime}>
                                <span style={{ verticalAlign: 'middle' }}>{(() => {
                                    let date = new Date(p.startTime);
                                    return ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2);
                                })()} - {p.windowTitle}</span>
                                {(() => {
                                    const diff = moment().diff(moment(p.startTime), 'minutes');
                                    if (rbMonitor.processWarningTime != null && diff >= rbMonitor.processWarningTime) {
                                        return <span className={classes.infiniteLoopWarning}>{diff}分経過：タスクが正常に終了していない可能性があります</span>;
                                    }
                                })()}
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return <Typography className={classes.statusSummary}><span className={classes.statusBadge} style={{ color: '#4caf50' }}>●</span>使用可能</Typography>
        }
    }
}

export default withStyles(styles)(Status);