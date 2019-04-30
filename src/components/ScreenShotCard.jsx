import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';

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
        return (
            <Card>
                <CardMedia
                    component="img"
                    src={this.state.url} />
            </Card>
        );
    }
}

export default ScreenShotCard;