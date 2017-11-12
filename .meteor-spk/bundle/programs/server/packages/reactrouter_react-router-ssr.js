(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var FastRender = Package['staringatlights:fast-render'].FastRender;
var InjectData = Package['staringatlights:inject-data'].InjectData;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var URL = Package.url.URL;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var ReactRouterSSR, exports;

var require = meteorInstall({"node_modules":{"meteor":{"reactrouter:react-router-ssr":{"lib":{"react-router-ssr.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactrouter_react-router-ssr/lib/react-router-ssr.js                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var checkNpmVersions = void 0;                                                                                    // 1
module.watch(require("meteor/tmeasday:check-npm-versions"), {                                                     // 1
  checkNpmVersions: function (v) {                                                                                // 1
    checkNpmVersions = v;                                                                                         // 1
  }                                                                                                               // 1
}, 0);                                                                                                            // 1
checkNpmVersions({                                                                                                // 2
  'react': '15.x',                                                                                                // 3
  'react-dom': '15.x',                                                                                            // 4
  'react-router': '3.x'                                                                                           // 5
}, 'reactrouter:react-router-ssr');                                                                               // 2
                                                                                                                  //
if (Meteor.isClient) {                                                                                            // 8
  ReactRouterSSR = require('./client.jsx').default;                                                               // 9
} else {                                                                                                          // 10
  ReactRouterSSR = require('./server.jsx').default;                                                               // 11
}                                                                                                                 // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"client.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactrouter_react-router-ssr/lib/client.jsx                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _extends2 = require("babel-runtime/helpers/extends");                                                         //
                                                                                                                  //
var _extends3 = _interopRequireDefault(_extends2);                                                                //
                                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                 //
                                                                                                                  //
module.export({                                                                                                   // 1
  ReactRouterSSR: function () {                                                                                   // 1
    return ReactRouterSSR;                                                                                        // 1
  }                                                                                                               // 1
});                                                                                                               // 1
var React = void 0;                                                                                               // 1
module.watch(require("react"), {                                                                                  // 1
  "default": function (v) {                                                                                       // 1
    React = v;                                                                                                    // 1
  }                                                                                                               // 1
}, 0);                                                                                                            // 1
var ReactDOM = void 0;                                                                                            // 1
module.watch(require("react-dom"), {                                                                              // 1
  "default": function (v) {                                                                                       // 1
    ReactDOM = v;                                                                                                 // 1
  }                                                                                                               // 1
}, 1);                                                                                                            // 1
var Router = void 0,                                                                                              // 1
    browserHistory = void 0;                                                                                      // 1
module.watch(require("react-router"), {                                                                           // 1
  Router: function (v) {                                                                                          // 1
    Router = v;                                                                                                   // 1
  },                                                                                                              // 1
  browserHistory: function (v) {                                                                                  // 1
    browserHistory = v;                                                                                           // 1
  }                                                                                                               // 1
}, 2);                                                                                                            // 1
var ReactRouterSSR = {                                                                                            // 5
  Run: function (routes, clientOptions) {                                                                         // 6
    if (!clientOptions) {                                                                                         // 7
      clientOptions = {};                                                                                         // 8
    }                                                                                                             // 9
                                                                                                                  //
    var history = browserHistory;                                                                                 // 11
                                                                                                                  //
    if (typeof clientOptions.historyHook === 'function') {                                                        // 13
      history = clientOptions.historyHook(history);                                                               // 14
    }                                                                                                             // 15
                                                                                                                  //
    Meteor.startup(function () {                                                                                  // 17
      var rootElementName = clientOptions.rootElement || 'react-app';                                             // 18
      var rootElementType = clientOptions.rootElementType || 'div';                                               // 19
      var attributes = clientOptions.rootElementAttributes instanceof Array ? clientOptions.rootElementAttributes : [];
      var rootElement = document.getElementById(rootElementName); // In case the root element doesn't exist, let's create it
                                                                                                                  //
      if (!rootElement) {                                                                                         // 24
        rootElement = document.createElement(rootElementType);                                                    // 25
        rootElement.id = rootElementName; // check if a 2-dimensional array was passed... if not, be nice and handle it anyway
                                                                                                                  //
        if (attributes[0] instanceof Array) {                                                                     // 29
          // set attributes                                                                                       // 30
          for (var i = 0; i < attributes.length; i++) {                                                           // 31
            rootElement.setAttribute(attributes[i][0], attributes[i][1]);                                         // 32
          }                                                                                                       // 33
        } else if (attributes.length > 0) {                                                                       // 34
          rootElement.setAttribute(attributes[0], attributes[1]);                                                 // 35
        }                                                                                                         // 36
                                                                                                                  //
        document.body.appendChild(rootElement);                                                                   // 38
      } // Rehydrate data client side, if desired.                                                                // 39
                                                                                                                  //
                                                                                                                  //
      if (typeof clientOptions.rehydrateHook === 'function') {                                                    // 42
        InjectData.getData('dehydrated-initial-data', function (data) {                                           // 43
          var rehydratedData = data ? JSON.parse(data) : undefined;                                               // 44
          clientOptions.rehydrateHook(rehydratedData);                                                            // 45
        });                                                                                                       // 46
      }                                                                                                           // 47
                                                                                                                  //
      var appGenerator = function (addProps) {                                                                    // 49
        return React.createElement(Router, (0, _extends3.default)({                                               // 49
          history: history,                                                                                       // 51
          children: routes                                                                                        // 52
        }, clientOptions.props, addProps));                                                                       // 50
      };                                                                                                          // 49
                                                                                                                  //
      var app = React.createElement(Router, (0, _extends3.default)({                                              // 57
        history: history,                                                                                         // 58
        children: routes                                                                                          // 59
      }, clientOptions.props));                                                                                   // 57
                                                                                                                  //
      if (typeof clientOptions.wrapperHook === 'function') {                                                      // 62
        app = clientOptions.wrapperHook(appGenerator);                                                            // 63
      }                                                                                                           // 64
                                                                                                                  //
      if (typeof clientOptions.renderHook === 'function') {                                                       // 66
        clientOptions.renderHook(app, rootElement);                                                               // 67
      } else {                                                                                                    // 68
        ReactDOM.render(app, rootElement);                                                                        // 69
      }                                                                                                           // 70
                                                                                                                  //
      var collectorEl = document.getElementById(clientOptions.styleCollectorId || 'css-style-collector-data');    // 72
                                                                                                                  //
      if (collectorEl) {                                                                                          // 74
        collectorEl.parentNode.removeChild(collectorEl);                                                          // 75
      }                                                                                                           // 76
    });                                                                                                           // 77
  }                                                                                                               // 78
};                                                                                                                // 5
module.exportDefault(ReactRouterSSR);                                                                             // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactrouter_react-router-ssr/lib/server.jsx                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _extends2 = require("babel-runtime/helpers/extends");                                                         //
                                                                                                                  //
var _extends3 = _interopRequireDefault(_extends2);                                                                //
                                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                 //
                                                                                                                  //
var React = void 0;                                                                                               // 1
module.watch(require("react"), {                                                                                  // 1
  "default": function (v) {                                                                                       // 1
    React = v;                                                                                                    // 1
  }                                                                                                               // 1
}, 0);                                                                                                            // 1
var ReactRouterMatch = void 0,                                                                                    // 1
    RouterContext = void 0,                                                                                       // 1
    createMemoryHistory = void 0;                                                                                 // 1
module.watch(require("react-router"), {                                                                           // 1
  match: function (v) {                                                                                           // 1
    ReactRouterMatch = v;                                                                                         // 1
  },                                                                                                              // 1
  RouterContext: function (v) {                                                                                   // 1
    RouterContext = v;                                                                                            // 1
  },                                                                                                              // 1
  createMemoryHistory: function (v) {                                                                             // 1
    createMemoryHistory = v;                                                                                      // 1
  }                                                                                                               // 1
}, 1);                                                                                                            // 1
var SsrContext = void 0;                                                                                          // 1
module.watch(require("./ssr_context"), {                                                                          // 1
  "default": function (v) {                                                                                       // 1
    SsrContext = v;                                                                                               // 1
  }                                                                                                               // 1
}, 2);                                                                                                            // 1
var patchSubscribeData = void 0;                                                                                  // 1
module.watch(require("./ssr_data"), {                                                                             // 1
  "default": function (v) {                                                                                       // 1
    patchSubscribeData = v;                                                                                       // 1
  }                                                                                                               // 1
}, 3);                                                                                                            // 1
var ReactDOMServer = void 0;                                                                                      // 1
module.watch(require("react-dom/server"), {                                                                       // 1
  "default": function (v) {                                                                                       // 1
    ReactDOMServer = v;                                                                                           // 1
  }                                                                                                               // 1
}, 4);                                                                                                            // 1
var cookieParser = void 0;                                                                                        // 1
module.watch(require("cookie-parser"), {                                                                          // 1
  "default": function (v) {                                                                                       // 1
    cookieParser = v;                                                                                             // 1
  }                                                                                                               // 1
}, 5);                                                                                                            // 1
var Cheerio = void 0;                                                                                             // 1
module.watch(require("cheerio"), {                                                                                // 1
  "default": function (v) {                                                                                       // 1
    Cheerio = v;                                                                                                  // 1
  }                                                                                                               // 1
}, 6);                                                                                                            // 1
var merge = void 0;                                                                                               // 1
module.watch(require("lodash/merge"), {                                                                           // 1
  "default": function (v) {                                                                                       // 1
    merge = v;                                                                                                    // 1
  }                                                                                                               // 1
}, 7);                                                                                                            // 1
                                                                                                                  //
function IsAppUrl(req) {                                                                                          // 17
  var url = req.url;                                                                                              // 18
                                                                                                                  //
  if (url === '/favicon.ico' || url === '/robots.txt') {                                                          // 19
    return false;                                                                                                 // 20
  }                                                                                                               // 21
                                                                                                                  //
  if (url === '/app.manifest') {                                                                                  // 23
    return false;                                                                                                 // 24
  } // Avoid serving app HTML for declared routes such as /sockjs/.                                               // 25
                                                                                                                  //
                                                                                                                  //
  if (RoutePolicy.classify(url)) {                                                                                // 28
    return false;                                                                                                 // 29
  }                                                                                                               // 30
                                                                                                                  //
  return true;                                                                                                    // 31
}                                                                                                                 // 32
                                                                                                                  //
var webpackStats = void 0;                                                                                        // 34
var ReactRouterSSR = {};                                                                                          // 36
module.exportDefault(ReactRouterSSR);                                                                             // 1
// creating some EnvironmentVariables that will be used later on                                                  // 39
ReactRouterSSR.ssrContext = new Meteor.EnvironmentVariable();                                                     // 40
ReactRouterSSR.inSubscription = new Meteor.EnvironmentVariable(); // <-- needed in ssr_data.js                    // 41
                                                                                                                  //
ReactRouterSSR.LoadWebpackStats = function (stats) {                                                              // 43
  webpackStats = stats;                                                                                           // 44
}; // this line just patches Subscribe and find mechanisms                                                        // 45
                                                                                                                  //
                                                                                                                  //
patchSubscribeData(ReactRouterSSR);                                                                               // 48
                                                                                                                  //
ReactRouterSSR.Run = function (routes, clientOptions, serverOptions) {                                            // 50
  if (!clientOptions) {                                                                                           // 52
    clientOptions = {};                                                                                           // 53
  }                                                                                                               // 54
                                                                                                                  //
  if (!serverOptions) {                                                                                           // 56
    serverOptions = {};                                                                                           // 57
  }                                                                                                               // 58
                                                                                                                  //
  if (!serverOptions.webpackStats) {                                                                              // 60
    serverOptions.webpackStats = webpackStats;                                                                    // 61
  }                                                                                                               // 62
                                                                                                                  //
  Meteor.bindEnvironment(function () {                                                                            // 64
    WebApp.rawConnectHandlers.use(cookieParser());                                                                // 65
    WebApp.connectHandlers.use(Meteor.bindEnvironment(function (req, res, next) {                                 // 67
      if (!IsAppUrl(req)) {                                                                                       // 68
        next();                                                                                                   // 69
        return;                                                                                                   // 70
      }                                                                                                           // 71
                                                                                                                  //
      global.__CHUNK_COLLECTOR__ = [];                                                                            // 73
      var loginToken = req.cookies['meteor_login_token'];                                                         // 75
      var headers = req.headers;                                                                                  // 76
      var context = new FastRender._Context(loginToken, {                                                         // 77
        headers: headers                                                                                          // 77
      });                                                                                                         // 77
      FastRender.frContext.withValue(context, function () {                                                       // 80
        var history = createMemoryHistory(req.url);                                                               // 81
                                                                                                                  //
        if (typeof serverOptions.historyHook === 'function') {                                                    // 83
          history = serverOptions.historyHook(history);                                                           // 84
        }                                                                                                         // 85
                                                                                                                  //
        ReactRouterMatch({                                                                                        // 87
          history: history,                                                                                       // 87
          routes: routes,                                                                                         // 87
          location: req.url                                                                                       // 87
        }, Meteor.bindEnvironment(function (err, redirectLocation, renderProps) {                                 // 87
          if (err) {                                                                                              // 88
            res.writeHead(500);                                                                                   // 89
            res.write(err.messages);                                                                              // 90
            res.end();                                                                                            // 91
          } else if (redirectLocation) {                                                                          // 92
            res.writeHead(302, {                                                                                  // 93
              Location: redirectLocation.pathname + redirectLocation.search                                       // 93
            });                                                                                                   // 93
            res.end();                                                                                            // 94
          } else if (renderProps) {                                                                               // 95
            sendSSRHtml(clientOptions, serverOptions, req, res, next, renderProps);                               // 96
          } else {                                                                                                // 97
            res.writeHead(404);                                                                                   // 98
            res.write('Not found');                                                                               // 99
            res.end();                                                                                            // 100
          }                                                                                                       // 101
        }));                                                                                                      // 102
      });                                                                                                         // 103
    }));                                                                                                          // 104
  })();                                                                                                           // 105
};                                                                                                                // 106
                                                                                                                  //
function sendSSRHtml(clientOptions, serverOptions, req, res, next, renderProps) {                                 // 108
  var _generateSSRData = generateSSRData(clientOptions, serverOptions, req, res, renderProps),                    // 108
      css = _generateSSRData.css,                                                                                 // 108
      html = _generateSSRData.html;                                                                               // 108
                                                                                                                  //
  res.write = patchResWrite(clientOptions, serverOptions, res.write, css, html);                                  // 110
  next();                                                                                                         // 112
}                                                                                                                 // 113
                                                                                                                  //
function patchResWrite(clientOptions, serverOptions, originalWrite, css, html) {                                  // 115
  return function (data) {                                                                                        // 116
    if (typeof data === 'string' && data.indexOf('<!DOCTYPE html>') === 0) {                                      // 117
      if (!serverOptions.dontMoveScripts) {                                                                       // 118
        data = moveScripts(data);                                                                                 // 119
      }                                                                                                           // 120
                                                                                                                  //
      if (css) {                                                                                                  // 122
        data = data.replace('</head>', '<style id="' + (clientOptions.styleCollectorId || 'css-style-collector-data') + '">' + css + '</style></head>');
      }                                                                                                           // 124
                                                                                                                  //
      if (typeof serverOptions.htmlHook === 'function') {                                                         // 126
        data = serverOptions.htmlHook(data);                                                                      // 127
      }                                                                                                           // 128
                                                                                                                  //
      var rootElementAttributes = '';                                                                             // 130
      var attributes = clientOptions.rootElementAttributes instanceof Array ? clientOptions.rootElementAttributes : [];
                                                                                                                  //
      if (attributes[0] instanceof Array) {                                                                       // 132
        for (var i = 0; i < attributes.length; i++) {                                                             // 133
          rootElementAttributes = rootElementAttributes + ' ' + attributes[i][0] + '="' + attributes[i][1] + '"';
        }                                                                                                         // 135
      } else if (attributes.length > 0) {                                                                         // 136
        rootElementAttributes = ' ' + attributes[0] + '="' + attributes[1] + '"';                                 // 137
      }                                                                                                           // 138
                                                                                                                  //
      data = data.replace('<body>', '<body><' + (clientOptions.rootElementType || 'div') + ' id="' + (clientOptions.rootElement || 'react-app') + '"' + rootElementAttributes + '>' + html + '</' + (clientOptions.rootElementType || 'div') + '>');
                                                                                                                  //
      if (typeof serverOptions.webpackStats !== 'undefined') {                                                    // 142
        data = addAssetsChunks(serverOptions, data);                                                              // 143
      }                                                                                                           // 144
    }                                                                                                             // 145
                                                                                                                  //
    originalWrite.call(this, data);                                                                               // 147
  };                                                                                                              // 148
}                                                                                                                 // 149
                                                                                                                  //
function addAssetsChunks(serverOptions, data) {                                                                   // 151
  var chunkNames = serverOptions.webpackStats.assetsByChunkName;                                                  // 152
  var publicPath = serverOptions.webpackStats.publicPath;                                                         // 153
                                                                                                                  //
  if (typeof chunkNames.common !== 'undefined') {                                                                 // 155
    var chunkSrc = typeof chunkNames.common === 'string' ? chunkNames.common : chunkNames.common[0];              // 156
    data = data.replace('<head>', '<head><script type="text/javascript" src="' + publicPath + chunkSrc + '"></script>');
  }                                                                                                               // 161
                                                                                                                  //
  for (var i = 0; i < global.__CHUNK_COLLECTOR__.length; ++i) {                                                   // 163
    if (typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] !== 'undefined') {                                       // 164
      chunkSrc = typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] === 'string' ? chunkNames[global.__CHUNK_COLLECTOR__[i]] : chunkNames[global.__CHUNK_COLLECTOR__[i]][0];
      data = data.replace('</head>', '<script type="text/javascript" src="' + publicPath + chunkSrc + '"></script></head>');
    }                                                                                                             // 170
  }                                                                                                               // 171
                                                                                                                  //
  return data;                                                                                                    // 173
}                                                                                                                 // 174
                                                                                                                  //
function generateSSRData(clientOptions, serverOptions, req, res, renderProps) {                                   // 176
  var html = void 0,                                                                                              // 177
      css = void 0; // we're stealing all the code from FlowRouter SSR                                            // 177
  // https://github.com/kadirahq/flow-router/blob/ssr/server/route.js#L61                                         // 180
                                                                                                                  //
  var ssrContext = new SsrContext();                                                                              // 181
  ReactRouterSSR.ssrContext.withValue(ssrContext, function () {                                                   // 183
    try {                                                                                                         // 184
      var frData = InjectData.getData(res, 'fast-render-data');                                                   // 185
                                                                                                                  //
      if (frData) {                                                                                               // 186
        ssrContext.addData(frData.collectionData);                                                                // 187
      }                                                                                                           // 188
                                                                                                                  //
      if (serverOptions.preRender) {                                                                              // 189
        serverOptions.preRender(req, res);                                                                        // 190
      } // Uncomment these two lines if you want to easily trigger                                                // 191
      // multiple client requests from different browsers at the same time                                        // 194
      // console.log('sarted sleeping');                                                                          // 196
      // Meteor._sleepForMs(5000);                                                                                // 197
      // console.log('ended sleeping');                                                                           // 198
                                                                                                                  //
                                                                                                                  //
      global.__STYLE_COLLECTOR_MODULES__ = [];                                                                    // 200
      global.__STYLE_COLLECTOR__ = '';                                                                            // 201
      renderProps = (0, _extends3.default)({}, renderProps, serverOptions.props); // Instead of fetchComponentData we need to fetch from Apollo Data
      //fetchComponentData(serverOptions, renderProps);                                                           // 209
                                                                                                                  //
      var appGenerator = function (addProps) {                                                                    // 210
        return React.createElement(RouterContext, (0, _extends3.default)({}, renderProps, addProps));             // 210
      };                                                                                                          // 210
                                                                                                                  //
      var app = React.createElement(RouterContext, renderProps);                                                  // 212
                                                                                                                  //
      if (typeof clientOptions.wrapperHook === 'function') {                                                      // 213
        app = clientOptions.wrapperHook(appGenerator);                                                            // 214
      } // Adding new parameter dataLoader for loading data through Apollo                                        // 215
                                                                                                                  //
                                                                                                                  //
      if (serverOptions.dataLoader) {                                                                             // 218
        serverOptions.dataLoader(req, res, app);                                                                  // 219
      }                                                                                                           // 220
                                                                                                                  //
      if (!serverOptions.disableSSR) {                                                                            // 222
        html = ReactDOMServer.renderToString(app);                                                                // 223
      } else if (serverOptions.loadingScreen) {                                                                   // 224
        html = serverOptions.loadingScreen;                                                                       // 225
      }                                                                                                           // 226
                                                                                                                  //
      css = global.__STYLE_COLLECTOR__;                                                                           // 228
                                                                                                                  //
      if (typeof serverOptions.dehydrateHook === 'function') {                                                    // 230
        InjectData.pushData(res, 'dehydrated-initial-data', JSON.stringify(serverOptions.dehydrateHook()));       // 231
      }                                                                                                           // 232
                                                                                                                  //
      if (serverOptions.postRender) {                                                                             // 234
        serverOptions.postRender(req, res);                                                                       // 235
      } // I'm pretty sure this could be avoided in a more elegant way?                                           // 236
                                                                                                                  //
                                                                                                                  //
      var data = FastRender.frContext.get().getData();                                                            // 239
      InjectData.pushData(res, 'fast-render-data', merge(data, frData));                                          // 240
    } catch (err) {                                                                                               // 241
      console.error(new Date(), 'error while server-rendering', err.stack);                                       // 243
    }                                                                                                             // 244
  });                                                                                                             // 245
  return {                                                                                                        // 246
    html: html,                                                                                                   // 246
    css: css                                                                                                      // 246
  };                                                                                                              // 246
}                                                                                                                 // 247
                                                                                                                  //
function fetchComponentData(serverOptions, renderProps) {                                                         // 249
  var componentsWithFetch = renderProps.components.filter(function (component) {                                  // 250
    return !!component;                                                                                           // 251
  }).filter(function (component) {                                                                                // 251
    return component.fetchData;                                                                                   // 252
  });                                                                                                             // 252
                                                                                                                  //
  if (!componentsWithFetch.length) {                                                                              // 254
    return;                                                                                                       // 255
  }                                                                                                               // 256
                                                                                                                  //
  if (!Package.promise) {                                                                                         // 258
    console.error("react-router-ssr: Support for fetchData() static methods on route components requires the 'promise' package.");
    return;                                                                                                       // 260
  }                                                                                                               // 261
                                                                                                                  //
  var promises = serverOptions.fetchDataHook(componentsWithFetch);                                                // 263
  Promise.awaitAll(promises);                                                                                     // 264
}                                                                                                                 // 265
                                                                                                                  //
function moveScripts(data) {                                                                                      // 267
  var $ = Cheerio.load(data, {                                                                                    // 268
    decodeEntities: false                                                                                         // 269
  });                                                                                                             // 268
  var heads = $('head script');                                                                                   // 271
  $('body').append(heads);                                                                                        // 272
  $('head').html($('head').html().replace(/(^[ \t]*\n)/gm, ''));                                                  // 273
  return $.html();                                                                                                // 275
}                                                                                                                 // 276
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ssr_context.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactrouter_react-router-ssr/lib/ssr_context.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _extends2 = require("babel-runtime/helpers/extends");                                                         //
                                                                                                                  //
var _extends3 = _interopRequireDefault(_extends2);                                                                //
                                                                                                                  //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                     //
                                                                                                                  //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                            //
                                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                           //
                                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                  //
                                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                 //
                                                                                                                  //
module.export({                                                                                                   // 1
  "default": function () {                                                                                        // 1
    return SsrContext;                                                                                            // 1
  }                                                                                                               // 1
});                                                                                                               // 1
                                                                                                                  //
var SsrContext = function () {                                                                                    //
  function SsrContext() {                                                                                         // 5
    (0, _classCallCheck3.default)(this, SsrContext);                                                              // 5
    this._collections = {};                                                                                       // 6
  }                                                                                                               // 7
                                                                                                                  //
  SsrContext.prototype.getCollection = function () {                                                              //
    function getCollection(collName) {                                                                            //
      var collection = this._collections[collName];                                                               // 10
                                                                                                                  //
      if (!collection) {                                                                                          // 11
        var minimongo = Package.minimongo;                                                                        // 12
        collection = this._collections[collName] = new minimongo.LocalCollection();                               // 13
      }                                                                                                           // 14
                                                                                                                  //
      return collection;                                                                                          // 16
    }                                                                                                             // 17
                                                                                                                  //
    return getCollection;                                                                                         //
  }();                                                                                                            //
                                                                                                                  //
  SsrContext.prototype.addSubscription = function () {                                                            //
    function addSubscription(name, params) {                                                                      //
      var fastRenderContext = FastRender.frContext.get();                                                         // 20
                                                                                                                  //
      if (!fastRenderContext) {                                                                                   // 21
        throw new Error("Cannot add a subscription: " + name + " without FastRender Context");                    // 22
      }                                                                                                           // 25
                                                                                                                  //
      var data = fastRenderContext.subscribe.apply(fastRenderContext, [name].concat((0, _toConsumableArray3.default)(params)));
      this.addData(data);                                                                                         // 29
    }                                                                                                             // 30
                                                                                                                  //
    return addSubscription;                                                                                       //
  }();                                                                                                            //
                                                                                                                  //
  SsrContext.prototype.addData = function () {                                                                    //
    function addData(data) {                                                                                      //
      var _this = this;                                                                                           // 32
                                                                                                                  //
      _.each(data, function (collDataCollection, collectionName) {                                                // 33
        var collection = _this.getCollection(collectionName);                                                     // 34
                                                                                                                  //
        collDataCollection.forEach(function (collData) {                                                          // 35
          collData.forEach(function (item) {                                                                      // 36
            var existingDoc = collection.findOne(item._id);                                                       // 37
                                                                                                                  //
            if (existingDoc) {                                                                                    // 38
              var newDoc = (0, _extends3.default)({}, existingDoc, item);                                         // 39
              delete newDoc._id;                                                                                  // 40
              collection.update(item._id, {                                                                       // 41
                $set: newDoc                                                                                      // 41
              });                                                                                                 // 41
            } else {                                                                                              // 42
              collection.insert(item);                                                                            // 43
            }                                                                                                     // 44
          });                                                                                                     // 45
        });                                                                                                       // 46
      });                                                                                                         // 47
    }                                                                                                             // 48
                                                                                                                  //
    return addData;                                                                                               //
  }();                                                                                                            //
                                                                                                                  //
  return SsrContext;                                                                                              //
}();                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ssr_data.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactrouter_react-router-ssr/lib/ssr_data.js                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.export({                                                                                                   // 1
  "default": function () {                                                                                        // 1
    return patchSubscribeData;                                                                                    // 1
  }                                                                                                               // 1
});                                                                                                               // 1
                                                                                                                  //
function patchSubscribeData(ReactRouterSSR) {                                                                     // 4
  var _this = this;                                                                                               // 4
                                                                                                                  //
  var originalSubscribe = Meteor.subscribe;                                                                       // 5
                                                                                                                  //
  Meteor.subscribe = function (pubName) {                                                                         // 7
    var params = Array.prototype.slice.call(arguments, 1);                                                        // 8
    var ssrContext = ReactRouterSSR.ssrContext.get();                                                             // 10
                                                                                                                  //
    if (ssrContext) {                                                                                             // 11
      ReactRouterSSR.inSubscription.withValue(true, function () {                                                 // 12
        ssrContext.addSubscription(pubName, params);                                                              // 13
      });                                                                                                         // 14
    }                                                                                                             // 15
                                                                                                                  //
    if (originalSubscribe) {                                                                                      // 17
      originalSubscribe.apply(this, arguments);                                                                   // 18
    }                                                                                                             // 19
                                                                                                                  //
    return {                                                                                                      // 21
      ready: function () {                                                                                        // 22
        return true;                                                                                              // 22
      }                                                                                                           // 22
    };                                                                                                            // 21
  };                                                                                                              // 24
                                                                                                                  //
  var Mongo = Package.mongo.Mongo;                                                                                // 26
  var originalFind = Mongo.Collection.prototype.find;                                                             // 27
                                                                                                                  //
  Mongo.Collection.prototype.find = function () {                                                                 // 29
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                        // 29
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                         // 29
    selector = selector || {};                                                                                    // 30
    var ssrContext = ReactRouterSSR.ssrContext.get();                                                             // 31
                                                                                                                  //
    if (ssrContext && !ReactRouterSSR.inSubscription.get()) {                                                     // 32
      var collName = this._name; // this line is added just to make sure this works CollectionFS                  // 33
                                                                                                                  //
      if (typeof this._transform === 'function') {                                                                // 36
        options.transform = this._transform;                                                                      // 37
      }                                                                                                           // 38
                                                                                                                  //
      var collection = ssrContext.getCollection(collName);                                                        // 40
      var cursor = collection.find(selector, options);                                                            // 41
      return cursor;                                                                                              // 42
    }                                                                                                             // 43
                                                                                                                  //
    return originalFind.call(this, selector, options);                                                            // 45
  }; // We must implement this. Otherwise, it'll call the origin prototype's                                      // 46
  // find method                                                                                                  // 49
                                                                                                                  //
                                                                                                                  //
  Mongo.Collection.prototype.findOne = function (selector, options) {                                             // 50
    options = options || {};                                                                                      // 51
    options.limit = 1;                                                                                            // 52
    return this.find(selector, options).fetch()[0];                                                               // 53
  };                                                                                                              // 54
                                                                                                                  //
  var originalAutorun = Tracker.autorun;                                                                          // 56
                                                                                                                  //
  Tracker.autorun = function (fn) {                                                                               // 58
    // if autorun is in the ssrContext, we need fake and run the callback                                         // 59
    // in the same eventloop                                                                                      // 60
    if (ReactRouterSSR.ssrContext.get()) {                                                                        // 61
      var c = {                                                                                                   // 62
        firstRun: true,                                                                                           // 62
        stop: function () {}                                                                                      // 62
      };                                                                                                          // 62
      fn(c);                                                                                                      // 63
      return c;                                                                                                   // 64
    }                                                                                                             // 65
                                                                                                                  //
    return originalAutorun.call(Tracker, fn);                                                                     // 67
  }; // By default, Meteor[call,apply] also inherit SsrContext                                                    // 68
  // So, they can't access the full MongoDB dataset because of that                                               // 71
  // Then, we need to remove the SsrContext within Method calls                                                   // 72
                                                                                                                  //
                                                                                                                  //
  ['call', 'apply'].forEach(function (methodName) {                                                               // 73
    var original = Meteor[methodName];                                                                            // 74
                                                                                                                  //
    Meteor[methodName] = function () {                                                                            // 75
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {                      // 75
        args[_key] = arguments[_key];                                                                             // 75
      }                                                                                                           // 75
                                                                                                                  //
      var response = ReactRouterSSR.ssrContext.withValue(null, function () {                                      // 76
        return original.apply(_this, args);                                                                       // 77
      });                                                                                                         // 78
      return response;                                                                                            // 80
    };                                                                                                            // 81
  }); // This is not available in the server. But to make it work with SSR                                        // 82
  // We need to have it.                                                                                          // 85
                                                                                                                  //
  Meteor.loggingIn = function () {                                                                                // 86
    return false;                                                                                                 // 87
  };                                                                                                              // 88
}                                                                                                                 // 89
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"cookie-parser":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/reactrouter_react-router-ssr/node_modules/cookie-parser/index.js                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*!
 * cookie-parser
 * Copyright(c) 2014 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var cookie = require('cookie');
var signature = require('cookie-signature');

/**
 * Module exports.
 * @public
 */

module.exports = cookieParser;
module.exports.JSONCookie = JSONCookie;
module.exports.JSONCookies = JSONCookies;
module.exports.signedCookie = signedCookie;
module.exports.signedCookies = signedCookies;

/**
 * Parse Cookie header and populate `req.cookies`
 * with an object keyed by the cookie names.
 *
 * @param {string|array} [secret] A string (or array of strings) representing cookie signing secret(s).
 * @param {Object} [options]
 * @return {Function}
 * @public
 */

function cookieParser(secret, options) {
  return function cookieParser(req, res, next) {
    if (req.cookies) {
      return next();
    }

    var cookies = req.headers.cookie;
    var secrets = !secret || Array.isArray(secret)
      ? (secret || [])
      : [secret];

    req.secret = secrets[0];
    req.cookies = Object.create(null);
    req.signedCookies = Object.create(null);

    // no cookies
    if (!cookies) {
      return next();
    }

    req.cookies = cookie.parse(cookies, options);

    // parse signed cookies
    if (secrets.length !== 0) {
      req.signedCookies = signedCookies(req.cookies, secrets);
      req.signedCookies = JSONCookies(req.signedCookies);
    }

    // parse JSON cookies
    req.cookies = JSONCookies(req.cookies);

    next();
  };
}

/**
 * Parse JSON cookie string.
 *
 * @param {String} str
 * @return {Object} Parsed object or undefined if not json cookie
 * @public
 */

function JSONCookie(str) {
  if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
    return undefined;
  }

  try {
    return JSON.parse(str.slice(2));
  } catch (err) {
    return undefined;
  }
}

/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @public
 */

function JSONCookies(obj) {
  var cookies = Object.keys(obj);
  var key;
  var val;

  for (var i = 0; i < cookies.length; i++) {
    key = cookies[i];
    val = JSONCookie(obj[key]);

    if (val) {
      obj[key] = val;
    }
  }

  return obj;
}

/**
 * Parse a signed cookie string, return the decoded value.
 *
 * @param {String} str signed cookie string
 * @param {string|array} secret
 * @return {String} decoded value
 * @public
 */

function signedCookie(str, secret) {
  if (typeof str !== 'string') {
    return undefined;
  }

  if (str.substr(0, 2) !== 's:') {
    return str;
  }

  var secrets = !secret || Array.isArray(secret)
    ? (secret || [])
    : [secret];

  for (var i = 0; i < secrets.length; i++) {
    var val = signature.unsign(str.slice(2), secrets[i]);

    if (val !== false) {
      return val;
    }
  }

  return false;
}

/**
 * Parse signed cookies, returning an object containing the decoded key/value
 * pairs, while removing the signed key from obj.
 *
 * @param {Object} obj
 * @param {string|array} secret
 * @return {Object}
 * @public
 */

function signedCookies(obj, secret) {
  var cookies = Object.keys(obj);
  var dec;
  var key;
  var ret = Object.create(null);
  var val;

  for (var i = 0; i < cookies.length; i++) {
    key = cookies[i];
    val = obj[key];
    dec = signedCookie(val, secret);

    if (val !== dec) {
      ret[key] = dec;
      delete obj[key];
    }
  }

  return ret;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"cheerio":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// ../../.3.1.7.7ton6k++os+web.browser+web.cordova/npm/node_modules/cheerio/package.json                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
exports.name = "cheerio";
exports.version = "0.20.0";
exports.main = "./index.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/reactrouter_react-router-ssr/node_modules/cheerio/index.js                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/**
 * Export cheerio (with )
 */

exports = module.exports = require('./lib/cheerio');

/*
  Export the version
*/

exports.version = require('./package').version;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lodash":{"merge.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/reactrouter_react-router-ssr/node_modules/lodash/merge.js                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
var exports = require("./node_modules/meteor/reactrouter:react-router-ssr/lib/react-router-ssr.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['reactrouter:react-router-ssr'] = exports, {
  ReactRouterSSR: ReactRouterSSR
});

})();

//# sourceMappingURL=reactrouter_react-router-ssr.js.map
