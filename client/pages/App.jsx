import React, { Component, PropTypes } from 'react'

// App component - represents the whole app
// @DragDropContext(HTML5Backend)
class App extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        var containerClasses = ['container-wrap']
        var childrenClasses = ['children', 'pb20']
        return (
            <div className={containerClasses.join(' ')}>
                <div className={childrenClasses.join(' ')}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App
