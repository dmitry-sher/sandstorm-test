import React from 'react'
import { textExts } from '../../lib/common'
const path = require('path')

export const FileContents = (props) => {
    const { contents, file, forceText } = props
    const ext = path.extname(file)
    if (forceText || textExts.indexOf(ext) != -1) {
        return (
            <div>
                <h3>{file}</h3>
                <div className="pre" dangerouslySetInnerHTML={{__html: contents}}></div>
            </div>
        )
    }
    return(
        <div>
            <h3>{file}</h3>
            <textarea value={contents}></textarea>
        </div>
    )
}

export default FileContents