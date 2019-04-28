import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class ScreenShotCard extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Card>
                <CardMedia
                    component="img"
                    src="/api/ss" />
            </Card>
        );
    }
}

export default ScreenShotCard;