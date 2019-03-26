import React, { Component } from 'react';

export default class HttpRequest extends Component {
    constructor(props) {
        super(props);
        this.state = { isShowingText: true };

        //server url: http;//192.168.4.1/wifisave?s=TP_LINK-133&p=flx2809133
        // Toggle the state every second
        setInterval(() => (
            this.setState(
                previousState => 
                    ({ 
                        isShowingText: !previousState.isShowingText 
                    })
                )
            ), 1000);
    }

    render() {
        if (!this.state.isShowingText) {
            return null;
        }

        return (
            <Text>{this.props.text}</Text>
        );
    }
}
