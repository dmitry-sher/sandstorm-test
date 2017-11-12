import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import { IndexRoute, Route } from 'react-router'
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr'
import App from './pages/App'
import HomePage from './pages/HomePage'
import './main.scss'
import './bootstrap.min.css'

const AppRoutes = (
    <Route path = "/" component = {App} >
        <IndexRoute component={ HomePage } />
    </Route>
)

ReactRouterSSR.Run(AppRoutes, {
    props: {
        onUpdate(a, b, c) {
            // Notify the page has been changed to Google Analytics
            if (window.ga) { window.ga.trackView('') }
        }
    },
    rootElement: 'render-target'
}, {
    preRender: function(req, res) {
        // ReactCookie.plugToRequest(req, res);
    }
})
