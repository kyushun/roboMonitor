import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';

const styles = {
    card: {
        position: 'relative'
    },
    disconnected: {
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, .5)'
    }
};

@inject('store', 'settings')
@observer
class ScreenShotCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '/api/ss'
        };
    }

    componentDidMount() {
        this.fetchSS();
        if (this.props.settings.autoFetch) {
            this.fetchInterval = setInterval(() => {
                this.fetchSS();
            }, this.props.settings.ssFetchInterval);
        }
    }

    fetchSS = () => {
        fetch('/api/ss')
            .then((response) => {
                return response.blob();
            })
            .then((blob) => {
                var url = (window.URL || window.webkitURL).createObjectURL(blob);

                this.setState({
                    url: url
                });
            })
            .catch((error) => console.log(error));
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia
                    component="img"
                    src={this.state.url} />
                <div className={this.props.store.connected ? '' : classes.disconnected}></div>
            </Card>
        );
    }
}

export default withStyles(styles)(ScreenShotCard);