import React from 'react';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const styles = {
    card: {
        margin: '1rem 0',
        boxShadow: 'none',
        border: 'solid 1px rgba(0, 0, 0, 0.12)'
    },
    cardTitle: {
        fontWeight: '700'
    },
    commandInput: {
        width: '100%'
    },
    output: {
        padding: '0 .5rem',
        maxHeight: '500px',
        background: '#333',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
    },
    outputText: {
        color: '#fff'
    }
};

@inject('settings')
@observer
class CommandCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            command: '',
            output: '',
            executable: true
        };
        this.outputRef = React.createRef();
    }

    handleChange = (e) => {
        this.setState({
            command: e.target.value
        });
    }

    handleClick = () => {
        this.postCommand(this.state.command);
    }

    postCommand = (cmd) => {
        this.setState({
            output: this.state.output + '\r\n> ' + cmd,
            executable: false
        });
        axios.post('/api/robo/command', {
            command: cmd,
            authKey: this.props.settings.authKey
        })
            .then(result => {
                this.setState({
                    output: this.state.output + result.data.response,
                    executable: true
                });
                this.outputRef.current.scrollTop = this.outputRef.current.scrollHeight;
            })
            .catch(err => {
                this.setState({
                    output: this.state.output + err.response.data.response,
                    executable: true
                });
                this.outputRef.current.scrollTop = this.outputRef.current.scrollHeight;
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.cardTitle} variant="h6" component="h2">
                        コマンド実行
                    </Typography>
                    <Grid container spacing={24} alignItems="center">
                        <Grid item xs>
                            <TextField
                                value={this.state.command}
                                className={classes.commandInput}
                                onChange={this.handleChange}
                                label="Command"
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item >
                            <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleClick} disabled={!this.state.executable}>
                                実行
                            </Button>
                        </Grid>
                    </Grid>
                    <div className={classes.output} ref={this.outputRef}>
                        <code>
                            {this.state.output.split(/\n|\r\n|\r/).map((m, idx) => {
                                return <Typography className={classes.outputText} key={m + idx}>{m}<br /></Typography>
                            })}
                        </code>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(CommandCard);