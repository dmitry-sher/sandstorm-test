import React from 'react'
import { Button } from 'react-bootstrap'

export const FileList = (props) => {
    const { dir = '/', files, onChangeDir, getLink, onOpenFile } = props
    const isTopDir = dir == '/'
    return(
        <div className="fileList">
            <h3>{dir}</h3>
            {isTopDir ? null : (
                <Button onClick={() => onChangeDir('..')} bsStyle="link">..</Button>
            )}
            {files.map((file, i) => file.isDirectory ? (
                <Button key={`file-${file.file}`} onClick={() => onChangeDir(getLink(dir, file.file))} bsStyle="link">{file.file}</Button>
            ) : (
                <Button key={`file-${file.file}`} onClick={() => onOpenFile(getLink(dir, file.file))} bsStyle="link">{file.file}</Button>
            ))}
        </div>
    )
}

export default FileList