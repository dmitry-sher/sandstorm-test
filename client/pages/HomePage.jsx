import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { isSandstorm } from '../../lib/common'
import Files from '../components/Files'

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
        let username = '---'
        if (isSandstorm()) {
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
            username = (user && user.profile && user.profile.name) || '---'
        }
        
        return (
            <div className="index">
                Connected user: {username} <br />
                Local root: {Meteor.absoluteUrl()} <br />
                <Files />
            </div>
        )
            
    }
}

HomePage.contextTypes = {
    router: React.PropTypes.object
}

export default createContainer(HomePage.prototype.getMeteorData, HomePage)
