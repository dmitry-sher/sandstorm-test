import { check } from 'meteor/check'
import { isSandstorm, textExts } from '../lib/common'

function promisifyCb(cb, arg) {
    // console.log('[promisifyCb] cb =', cb, ', arg = ', arg)
    return new Promise((resolve, reject) => {
        cb(arg, function(err, res) {
            if (err) reject(err)
            resolve(res)
        })
    })
}

function getPaths() {
    var importPath = []
    const path = require('path')
    for (var i in module.paths) {
      importPath.push(module.paths[i])
    }
    
    if ("NODE_PATH" in process.env) {
      var parts = process.env.NODE_PATH.split(path.delimiter);
      for (var j in parts) {
        importPath.push(parts[j]);
      }
    }
    return importPath
}

Meteor.methods({
    async dir(path = '/') {
        const fs = require('fs');
        
        try {
            const files = []
            const dirFiles = await promisifyCb(fs.readdir, path)
            if (!dirFiles) throw new Meteor.Error('no files')
            // console.log('dirFiles = ', dirFiles)
            for (let file of dirFiles) {
                const filePath = path == '/' ? `/${file}` : `${path}/${file}`
                try {
                    const stats = await promisifyCb(fs.stat, filePath)
                    files.push({file, isDirectory: stats.isDirectory()})
                } catch (e) {
                    files.push({ file, err: e })
                }
            }

            const dirname = __dirname
            const modules = ['capnp', 'isarray', 'test']
            const paths = {}
            modules.forEach(module => paths[module] = require.resolve(module))
            return { files, dirname, paths, imports: getPaths() }
        } catch (e) {
            console.warn(e)
            throw new Meteor.Error('error', e.toString())
        }
    }, 
    async file(file) {
        const fs = require('fs')
        const path = require('path')
        try {
            const ext = path.extname(file)
            if (textExts.indexOf(ext) != -1) {
                const buf = await promisifyCb(fs.readFile, file)
                return { contents: buf.toString() }
            }
            const contents = await promisifyCb(fs.readFile, file)
            const buf = new Buffer(contents)
            return { contents: buf.toString('base64') }
        } catch (e) {
            throw new Meteor.Error('error', e.toString())
        }
    }
})
if (isSandstorm() && Meteor.isServer) {
    // const dir = `${__dirname}/node_modules/capnp`
    
    console.log('capnp = ', Capnp)
    // function checkModule(dir) {
    //     console.log(`loading ${dir} ...`)
    //     try {
    //         const Capnp = require(dir)
    //     } catch (e) {
    //         console.warn(e)
    //         console.warn(e.toString())
    //     }
    // }
    // checkModule('capnp')
    // checkModule('assets/app/capnp')
    // checkModule('assets/app/capnp.node')
    // checkModule('./assets/app/capnp')
    // checkModule('./assets/app/capnp.node')
    // checkModule('../assets/app/capnp')
    // checkModule('../assets/app/capnp.node')
    // checkModule('capnp/capnp')
    // checkModule('capnp/capnp.js')
    // checkModule('capnp.js')
    // checkModule('../capnp')
    // checkModule('../capnp/capnp')
    // checkModule('../capnp/capnp.js')
    // checkModule('../capnp.js')
    // checkModule('./capnp')
    // checkModule('./capnp/capnp')
    // checkModule('./capnp/capnp.js')
    // checkModule('./capnp.js')
    // checkModule('../../capnp')
    // checkModule('../../capnp/capnp')
    // checkModule('../../capnp/capnp.js')
    // checkModule('../../capnp.js')
    // checkModule('../node_modules/capnp')
    // checkModule('../../node_modules/capnp')
    // checkModule('../../../node_modules/capnp')
    // checkModule('../../../../node_modules/capnp')
}
