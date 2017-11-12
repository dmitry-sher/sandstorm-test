var require = meteorInstall({"lib":{"common.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// lib/common.js                                                                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({                                                                                                     // 1
    isSandstorm: function () {                                                                                      // 1
        return isSandstorm;                                                                                         // 1
    }                                                                                                               // 1
});                                                                                                                 // 1
                                                                                                                    //
function isSandstorm() {                                                                                            // 1
    var isItSandstorm = Meteor.settings && Meteor.settings.public && Meteor.settings.public.sandstorm;              // 2
    return isItSandstorm;                                                                                           // 4
}                                                                                                                   // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"sandstorm.js":function(require,exports,module,__filename,__dirname){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// server/sandstorm.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _regenerator = require("babel-runtime/regenerator");                                                            //
                                                                                                                    //
var _regenerator2 = _interopRequireDefault(_regenerator);                                                           //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                   //
                                                                                                                    //
var module1 = module;                                                                                               // 1
var check = void 0;                                                                                                 // 1
module1.watch(require("meteor/check"), {                                                                            // 1
    check: function (v) {                                                                                           // 1
        check = v;                                                                                                  // 1
    }                                                                                                               // 1
}, 0);                                                                                                              // 1
var isSandstorm = void 0;                                                                                           // 1
module1.watch(require("../lib/common"), {                                                                           // 1
    isSandstorm: function (v) {                                                                                     // 1
        isSandstorm = v;                                                                                            // 1
    }                                                                                                               // 1
}, 1);                                                                                                              // 1
                                                                                                                    //
function promisifyCb(cb, arg) {                                                                                     // 4
    // console.log('[promisifyCb] cb =', cb, ', arg = ', arg)                                                       // 5
    return new Promise(function (resolve, reject) {                                                                 // 6
        cb(arg, function (err, res) {                                                                               // 7
            if (err) reject(err);                                                                                   // 8
            resolve(res);                                                                                           // 9
        });                                                                                                         // 10
    });                                                                                                             // 11
}                                                                                                                   // 12
                                                                                                                    //
Meteor.methods({                                                                                                    // 14
    dir: function () {                                                                                              // 15
        function _callee() {                                                                                        // 14
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';                     // 14
                                                                                                                    //
            var fs, files, dirFiles, _iterator, _isArray, _i, _ref, file, filePath, stats, dirname, modules, paths;
                                                                                                                    //
            return _regenerator2.default.async(function () {                                                        // 14
                function _callee$(_context) {                                                                       // 14
                    while (1) {                                                                                     // 14
                        switch (_context.prev = _context.next) {                                                    // 14
                            case 0:                                                                                 // 14
                                fs = require('fs');                                                                 // 16
                                _context.prev = 1;                                                                  // 14
                                files = [];                                                                         // 19
                                _context.next = 5;                                                                  // 14
                                return _regenerator2.default.awrap(promisifyCb(fs.readdir, path));                  // 14
                                                                                                                    //
                            case 5:                                                                                 // 14
                                dirFiles = _context.sent;                                                           // 20
                                                                                                                    //
                                if (dirFiles) {                                                                     // 14
                                    _context.next = 8;                                                              // 14
                                    break;                                                                          // 14
                                }                                                                                   // 14
                                                                                                                    //
                                throw new Meteor.Error('no files');                                                 // 14
                                                                                                                    //
                            case 8:                                                                                 // 14
                                _iterator = dirFiles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
                                                                                                                    //
                            case 9:                                                                                 // 14
                                if (!_isArray) {                                                                    // 14
                                    _context.next = 15;                                                             // 14
                                    break;                                                                          // 14
                                }                                                                                   // 14
                                                                                                                    //
                                if (!(_i >= _iterator.length)) {                                                    // 14
                                    _context.next = 12;                                                             // 14
                                    break;                                                                          // 14
                                }                                                                                   // 14
                                                                                                                    //
                                return _context.abrupt("break", 33);                                                // 14
                                                                                                                    //
                            case 12:                                                                                // 14
                                _ref = _iterator[_i++];                                                             // 14
                                _context.next = 19;                                                                 // 14
                                break;                                                                              // 14
                                                                                                                    //
                            case 15:                                                                                // 14
                                _i = _iterator.next();                                                              // 14
                                                                                                                    //
                                if (!_i.done) {                                                                     // 14
                                    _context.next = 18;                                                             // 14
                                    break;                                                                          // 14
                                }                                                                                   // 14
                                                                                                                    //
                                return _context.abrupt("break", 33);                                                // 14
                                                                                                                    //
                            case 18:                                                                                // 14
                                _ref = _i.value;                                                                    // 14
                                                                                                                    //
                            case 19:                                                                                // 14
                                file = _ref;                                                                        // 23
                                filePath = path == '/' ? "/" + file : path + "/" + file;                            // 24
                                _context.prev = 21;                                                                 // 14
                                _context.next = 24;                                                                 // 14
                                return _regenerator2.default.awrap(promisifyCb(fs.stat, filePath));                 // 14
                                                                                                                    //
                            case 24:                                                                                // 14
                                stats = _context.sent;                                                              // 26
                                files.push({                                                                        // 27
                                    file: file,                                                                     // 27
                                    isDirectory: stats.isDirectory()                                                // 27
                                });                                                                                 // 27
                                _context.next = 31;                                                                 // 14
                                break;                                                                              // 14
                                                                                                                    //
                            case 28:                                                                                // 14
                                _context.prev = 28;                                                                 // 14
                                _context.t0 = _context["catch"](21);                                                // 14
                                files.push({                                                                        // 29
                                    file: file,                                                                     // 29
                                    err: _context.t0                                                                // 29
                                });                                                                                 // 29
                                                                                                                    //
                            case 31:                                                                                // 14
                                _context.next = 9;                                                                  // 14
                                break;                                                                              // 14
                                                                                                                    //
                            case 33:                                                                                // 14
                                dirname = __dirname;                                                                // 33
                                modules = ['capnp', 'isarray', 'test'];                                             // 34
                                paths = {};                                                                         // 35
                                modules.forEach(function (module) {                                                 // 36
                                    return paths[module] = require.resolve(module);                                 // 36
                                });                                                                                 // 36
                                return _context.abrupt("return", {                                                  // 14
                                    files: files,                                                                   // 37
                                    dirname: dirname,                                                               // 37
                                    paths: paths                                                                    // 37
                                });                                                                                 // 37
                                                                                                                    //
                            case 40:                                                                                // 14
                                _context.prev = 40;                                                                 // 14
                                _context.t1 = _context["catch"](1);                                                 // 14
                                throw new Meteor.Error('error', _context.t1.toString());                            // 14
                                                                                                                    //
                            case 43:                                                                                // 14
                            case "end":                                                                             // 14
                                return _context.stop();                                                             // 14
                        }                                                                                           // 14
                    }                                                                                               // 14
                }                                                                                                   // 14
                                                                                                                    //
                return _callee$;                                                                                    // 14
            }(), null, this, [[1, 40], [21, 28]]);                                                                  // 14
        }                                                                                                           // 14
                                                                                                                    //
        return _callee;                                                                                             // 14
    }()                                                                                                             // 14
});                                                                                                                 // 14
                                                                                                                    //
if (isSandstorm() && Meteor.isServer) {                                                                             // 43
    // const dir = `${__dirname}/node_modules/capnp`                                                                // 44
    var checkModule = function (dir) {                                                                              // 43
        try {                                                                                                       // 47
            var Capnp = require(dir);                                                                               // 48
        } catch (e) {                                                                                               // 49
            console.warn(e);                                                                                        // 50
        }                                                                                                           // 51
    };                                                                                                              // 52
                                                                                                                    //
    checkModule('../node_modules/capnp');                                                                           // 53
    checkModule('../../node_modules/capnp');                                                                        // 54
    checkModule('../../../node_modules/capnp');                                                                     // 55
    checkModule('../../../../node_modules/capnp');                                                                  // 56
}                                                                                                                   // 57
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./lib/common.js");
require("./server/sandstorm.js");
//# sourceMappingURL=app.js.map
