export function isSandstorm() {
    const isItSandstorm = Meteor.settings && Meteor.settings.public &&
            Meteor.settings.public.sandstorm
    return isItSandstorm
}
