import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    getMeteorData(props) {
        const user = Meteor.user()
        const loggingIn = Meteor.loggingIn()
        return { user, loggingIn }
    }

    render() {
        const { user, loggingIn } = this.props
        if (!user && !loggingIn) {
            return (
                <div className="index">
                    Not logged in. Please log in.
                </div>
            )
        }
        if (!user && loggingIn) {
            return (
                <div className="index"> ... logging in ... </div>
            )
        }
        const username = (user && user.profile && user.profile.name) || '---'
        return (
            <div className="index">
                Connected user: {username} <br />
                Local root: {Meteor.absoluteUrl()} <br />
            </div>
        )
    }
}

HomePage.contextTypes = {
    router: React.PropTypes.object
}

export default createContainer(HomePage.prototype.getMeteorData, HomePage)
