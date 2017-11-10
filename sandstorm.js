import { check } from 'meteor/check'
import { isSandstorm } from './lib/common'

if (isSandstorm() && Meteor.isServer) {
    const Capnp = require('capnp')
}
