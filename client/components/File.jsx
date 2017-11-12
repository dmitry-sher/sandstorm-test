import React from 'react'
import { Button } from 'react-bootstrap'
import FileContents from './FileContents'

const PageStatus = {
    Initial: 0,
    Loading: 1,
    Success: 2,
    Error: 3
}

export default class FileContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: PageStatus.Initial,
        }
    }

    componentDidMount () {
        this.reload(this.props.file)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.file != nextProps.file) this.reload(nextProps.file)
    }

    reload(file) {
        if (!file) return
        this.setState({ status: PageStatus.Loading }, () => {
            Meteor.call('file', file, (err, res) => {
                if (err) {
                    this.setState({ status: PageStatus.Error, err })
                    return
                }
                this.setState({...res, status: PageStatus.Success, file})
            })
        })
    }

    onClose = () => {
        if (this.props.onCloseFile) this.props.onCloseFile()
    }

    render() {
        const { status, contents } = this.state
        const { file } = this.props
        
        if ([ PageStatus.Loading].indexOf(status) != -1) return (
            <div>...</div>
        )

        if ([PageStatus.Initial].indexOf(status) != -1) return null

        if (status == PageStatus.Error) {
            return (
                <div>
                    <h3>Error</h3>
                    <div dangerouslySetInnerHTML={{__html: JSON.stringify(this.state.err)}}></div>
                </div>
            )
        }

        return (
            <div className="fileContents">
                <div className="pointer close" onClick={this.onClose}>X</div>
                <FileContents 
                    file={file}
                    contents={contents}
                />
            </div>
        )
    }
}