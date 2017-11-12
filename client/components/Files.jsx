import React from 'react'
import { Button } from 'react-bootstrap'
import FileList from './FileList'
import File from './File'

const PageStatus = {
    Initial: 0,
    Loading: 1,
    Success: 2,
    Error: 3
}

export default class Files extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: PageStatus.Initial,
            dir: '/',
            file: '',
            filter: ''
        }
    }

    componentDidMount () {
        this.reload(this.state.dir)
    }

    reload(dir) {
        this.setState({ status: PageStatus.Loading }, () => {
            Meteor.call('dir', dir, (err, res) => {
                if (err) {
                    this.setState({ status: PageStatus.Error, err })
                    return
                }
                this.setState({...res, status: PageStatus.Success, dir})
            })
        })
    }

    onChangeDir = (dir) => {
        const currentDir = this.state.dir
        if (dir == '..') {
            const pathParts = _.filter(currentDir.split('/'), (p) => !!p)
            if (pathParts.length == 0) {
                this.reload('/')
                return
            }
            pathParts.pop()
            this.reload(`/${pathParts.join('/')}`)
        }
        const filteredDir = ''
        this.reload(dir)
    }

    getLink = (dir, file) => {
        if (dir == '/') return `/${file}`
        return `${dir}/${file}`
    }

    onOpenFile = (file) => {
        this.setState({ file })
    }

    onCloseFile = (file) => {
        this.setState({ file: '' })
    }

    onChangeFilter = (e) => {
        this.setState({ filter: e.target.value })
    }
    
    render() {
        const { status, files, dir, dirname, paths, file, filter } = this.state
        
        if ([PageStatus.Initial, PageStatus.Loading].indexOf(status) != -1) return (
            <div>...</div>
        )

        if (status == PageStatus.Error) {
            return (
                <div>
                    <h3>Error</h3>
                    <div dangerouslySetInnerHTML={{__html: JSON.stringify(this.state.err)}}></div>
                </div>
            )
        }

        let eFiles = files
        if (filter) {
            const re = new RegExp(filter, 'i')
            eFiles = _.filter(files, f => re.test(f))
        }

        return (
            <div>
                <div>dirname: {dirname}</div>
                <div>paths: <ul>{Object.keys(paths).map(key => (
                    <li key={`p-${key}`}>{key}: {paths[key]}</li>
                ))}</ul></div>
                <div>
                    <input placeholder="filter" value={this.state.filter} onChange={this.onChangeFilter} />
                </div>
                <div className="flexy">
                    <FileList 
                        files={eFiles}
                        dir={dir}
                        onChangeDir={this.onChangeDir}
                        getLink={this.getLink}
                        onOpenFile={this.onOpenFile}
                    />
                    <div>
                        <File file={file} onCloseFile={this.onCloseFile} />
                    </div>
                </div>
            </div>
        )
    }
}