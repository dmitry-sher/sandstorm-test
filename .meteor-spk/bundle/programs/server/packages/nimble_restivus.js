(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg, Restivus;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/auth.coffee.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getUserQuerySelector, passwordValidator, userValidator;                                                          // 1
                                                                                                                     //
this.Auth || (this.Auth = {});                                                                                       // 1
                                                                                                                     //
                                                                                                                     // 3
/*                                                                                                                   // 3
  A valid user will have exactly one of the following identification fields: id, username, or email                  //
 */                                                                                                                  //
                                                                                                                     //
userValidator = Match.Where(function(user) {                                                                         // 1
  check(user, {                                                                                                      // 7
    id: Match.Optional(String),                                                                                      // 8
    username: Match.Optional(String),                                                                                // 8
    email: Match.Optional(String)                                                                                    // 8
  });                                                                                                                //
  if (_.keys(user).length === !1) {                                                                                  // 12
    throw new Match.Error('User must have exactly one identifier field');                                            // 13
  }                                                                                                                  //
  return true;                                                                                                       // 15
});                                                                                                                  // 6
                                                                                                                     //
                                                                                                                     // 17
/*                                                                                                                   // 17
  A password can be either in plain text or hashed                                                                   //
 */                                                                                                                  //
                                                                                                                     //
passwordValidator = Match.OneOf(String, {                                                                            // 1
  digest: String,                                                                                                    // 21
  algorithm: String                                                                                                  // 21
});                                                                                                                  //
                                                                                                                     //
                                                                                                                     // 24
/*                                                                                                                   // 24
  Return a MongoDB query selector for finding the given user                                                         //
 */                                                                                                                  //
                                                                                                                     //
getUserQuerySelector = function(user) {                                                                              // 1
  if (user.id) {                                                                                                     // 28
    return {                                                                                                         // 29
      '_id': user.id                                                                                                 // 29
    };                                                                                                               //
  } else if (user.username) {                                                                                        //
    return {                                                                                                         // 31
      'username': user.username                                                                                      // 31
    };                                                                                                               //
  } else if (user.email) {                                                                                           //
    return {                                                                                                         // 33
      'emails.address': user.email                                                                                   // 33
    };                                                                                                               //
  }                                                                                                                  //
  throw new Error('Cannot create selector from invalid user');                                                       // 36
};                                                                                                                   // 27
                                                                                                                     //
                                                                                                                     // 38
/*                                                                                                                   // 38
  Log a user in with their password                                                                                  //
 */                                                                                                                  //
                                                                                                                     //
this.Auth.loginWithPassword = function(user, password) {                                                             // 1
  var authToken, authenticatingUser, authenticatingUserSelector, hashedToken, passwordVerification, ref;             // 42
  if (!user || !password) {                                                                                          // 42
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 43
  }                                                                                                                  //
  check(user, userValidator);                                                                                        // 42
  check(password, passwordValidator);                                                                                // 42
  authenticatingUserSelector = getUserQuerySelector(user);                                                           // 42
  authenticatingUser = Meteor.users.findOne(authenticatingUserSelector);                                             // 42
  if (!authenticatingUser) {                                                                                         // 53
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 54
  }                                                                                                                  //
  if (!((ref = authenticatingUser.services) != null ? ref.password : void 0)) {                                      // 55
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 56
  }                                                                                                                  //
  passwordVerification = Accounts._checkPassword(authenticatingUser, password);                                      // 42
  if (passwordVerification.error) {                                                                                  // 60
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 61
  }                                                                                                                  //
  authToken = Accounts._generateStampedLoginToken();                                                                 // 42
  hashedToken = Accounts._hashLoginToken(authToken.token);                                                           // 42
  Accounts._insertHashedLoginToken(authenticatingUser._id, {                                                         // 42
    hashedToken: hashedToken                                                                                         // 66
  });                                                                                                                //
  return {                                                                                                           // 68
    authToken: authToken.token,                                                                                      // 68
    userId: authenticatingUser._id                                                                                   // 68
  };                                                                                                                 //
};                                                                                                                   // 41
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/iron-router-error-to-response.js                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// We need a function that treats thrown errors exactly like Iron Router would.
// This file is written in JavaScript to enable copy-pasting Iron Router code.

// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L3
var env = process.env.NODE_ENV || 'development';

// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L47
ironRouterSendErrorToResponse = function (err, req, res) {
  if (res.statusCode < 400)
    res.statusCode = 500;

  if (err.status)
    res.statusCode = err.status;

  if (env === 'development')
    msg = (err.stack || err.toString()) + '\n';
  else
    //XXX get this from standard dict of error messages?
    msg = 'Server error.';

  console.error(err.stack || err.toString());

  if (res.headersSent)
    return req.socket.destroy();

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(msg));
  if (req.method === 'HEAD')
    return res.end();
  res.end(msg);
  return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/route.coffee.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
share.Route = (function() {                                                                                          // 1
  function Route(api, path, options, endpoints1) {                                                                   // 3
    this.api = api;                                                                                                  // 5
    this.path = path;                                                                                                // 5
    this.options = options;                                                                                          // 5
    this.endpoints = endpoints1;                                                                                     // 5
    if (!this.endpoints) {                                                                                           // 5
      this.endpoints = this.options;                                                                                 // 6
      this.options = {};                                                                                             // 6
    }                                                                                                                //
  }                                                                                                                  //
                                                                                                                     //
  Route.prototype.addToApi = (function() {                                                                           // 3
    var availableMethods;                                                                                            // 11
    availableMethods = ['get', 'post', 'put', 'patch', 'delete', 'options'];                                         // 11
    return function() {                                                                                              // 13
      var allowedMethods, fullPath, rejectedMethods, self;                                                           // 14
      self = this;                                                                                                   // 14
      if (_.contains(this.api._config.paths, this.path)) {                                                           // 18
        throw new Error("Cannot add a route at an existing path: " + this.path);                                     // 19
      }                                                                                                              //
      this.endpoints = _.extend({                                                                                    // 14
        options: this.api._config.defaultOptionsEndpoint                                                             // 22
      }, this.endpoints);                                                                                            //
      this._resolveEndpoints();                                                                                      // 14
      this._configureEndpoints();                                                                                    // 14
      this.api._config.paths.push(this.path);                                                                        // 14
      allowedMethods = _.filter(availableMethods, function(method) {                                                 // 14
        return _.contains(_.keys(self.endpoints), method);                                                           //
      });                                                                                                            //
      rejectedMethods = _.reject(availableMethods, function(method) {                                                // 14
        return _.contains(_.keys(self.endpoints), method);                                                           //
      });                                                                                                            //
      fullPath = this.api._config.apiPath + this.path;                                                               // 14
      _.each(allowedMethods, function(method) {                                                                      // 14
        var endpoint;                                                                                                // 39
        endpoint = self.endpoints[method];                                                                           // 39
        return JsonRoutes.add(method, fullPath, function(req, res) {                                                 //
          var doneFunc, endpointContext, error, responseData, responseInitiated;                                     // 42
          responseInitiated = false;                                                                                 // 42
          doneFunc = function() {                                                                                    // 42
            return responseInitiated = true;                                                                         //
          };                                                                                                         //
          endpointContext = {                                                                                        // 42
            urlParams: req.params,                                                                                   // 47
            queryParams: req.query,                                                                                  // 47
            bodyParams: req.body,                                                                                    // 47
            request: req,                                                                                            // 47
            response: res,                                                                                           // 47
            done: doneFunc                                                                                           // 47
          };                                                                                                         //
          _.extend(endpointContext, endpoint);                                                                       // 42
          responseData = null;                                                                                       // 42
          try {                                                                                                      // 58
            responseData = self._callEndpoint(endpointContext, endpoint);                                            // 59
          } catch (_error) {                                                                                         //
            error = _error;                                                                                          // 62
            ironRouterSendErrorToResponse(error, req, res);                                                          // 62
            return;                                                                                                  // 63
          }                                                                                                          //
          if (responseInitiated) {                                                                                   // 65
            res.end();                                                                                               // 67
            return;                                                                                                  // 68
          } else {                                                                                                   //
            if (res.headersSent) {                                                                                   // 70
              throw new Error("Must call this.done() after handling endpoint response manually: " + method + " " + fullPath);
            } else if (responseData === null || responseData === void 0) {                                           //
              throw new Error("Cannot return null or undefined from an endpoint: " + method + " " + fullPath);       // 73
            }                                                                                                        //
          }                                                                                                          //
          if (responseData.body && (responseData.statusCode || responseData.headers)) {                              // 76
            return self._respond(res, responseData.body, responseData.statusCode, responseData.headers);             //
          } else {                                                                                                   //
            return self._respond(res, responseData);                                                                 //
          }                                                                                                          //
        });                                                                                                          //
      });                                                                                                            //
      return _.each(rejectedMethods, function(method) {                                                              //
        return JsonRoutes.add(method, fullPath, function(req, res) {                                                 //
          var headers, responseData;                                                                                 // 83
          responseData = {                                                                                           // 83
            status: 'error',                                                                                         // 83
            message: 'API endpoint does not exist'                                                                   // 83
          };                                                                                                         //
          headers = {                                                                                                // 83
            'Allow': allowedMethods.join(', ').toUpperCase()                                                         // 84
          };                                                                                                         //
          return self._respond(res, responseData, 405, headers);                                                     //
        });                                                                                                          //
      });                                                                                                            //
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
                                                                                                                     // 88
  /*                                                                                                                 // 88
    Convert all endpoints on the given route into our expected endpoint object if it is a bare                       //
    function                                                                                                         //
                                                                                                                     //
    @param {Route} route The route the endpoints belong to                                                           //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._resolveEndpoints = function() {                                                                   // 3
    _.each(this.endpoints, function(endpoint, method, endpoints) {                                                   // 95
      if (_.isFunction(endpoint)) {                                                                                  // 96
        return endpoints[method] = {                                                                                 //
          action: endpoint                                                                                           // 97
        };                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 101
  /*                                                                                                                 // 101
    Configure the authentication and role requirement on all endpoints (except OPTIONS, which must                   //
    be configured directly on the endpoint)                                                                          //
                                                                                                                     //
    Authentication can be required on an entire route or individual endpoints. If required on an                     //
    entire route, that serves as the default. If required in any individual endpoints, that will                     //
    override the default.                                                                                            //
                                                                                                                     //
    After the endpoint is configured, all authentication and role requirements of an endpoint can be                 //
    accessed at <code>endpoint.authRequired</code> and <code>endpoint.roleRequired</code>,                           //
    respectively.                                                                                                    //
                                                                                                                     //
    @param {Route} route The route the endpoints belong to                                                           //
    @param {Endpoint} endpoint The endpoint to configure                                                             //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._configureEndpoints = function() {                                                                 // 3
    _.each(this.endpoints, function(endpoint, method) {                                                              // 117
      var ref, ref1;                                                                                                 // 118
      if (method !== 'options') {                                                                                    // 118
        if (!((ref = this.options) != null ? ref.roleRequired : void 0)) {                                           // 120
          this.options.roleRequired = [];                                                                            // 121
        }                                                                                                            //
        if (!endpoint.roleRequired) {                                                                                // 122
          endpoint.roleRequired = [];                                                                                // 123
        }                                                                                                            //
        endpoint.roleRequired = _.union(endpoint.roleRequired, this.options.roleRequired);                           // 120
        if (_.isEmpty(endpoint.roleRequired)) {                                                                      // 126
          endpoint.roleRequired = false;                                                                             // 127
        }                                                                                                            //
        if (endpoint.authRequired === void 0) {                                                                      // 130
          if (((ref1 = this.options) != null ? ref1.authRequired : void 0) || endpoint.roleRequired) {               // 131
            endpoint.authRequired = true;                                                                            // 132
          } else {                                                                                                   //
            endpoint.authRequired = false;                                                                           // 134
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
    }, this);                                                                                                        //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 140
  /*                                                                                                                 // 140
    Authenticate an endpoint if required, and return the result of calling it                                        //
                                                                                                                     //
    @returns The endpoint response or a 401 if authentication fails                                                  //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._callEndpoint = function(endpointContext, endpoint) {                                              // 3
    var auth;                                                                                                        // 147
    auth = this._authAccepted(endpointContext, endpoint);                                                            // 147
    if (auth.success) {                                                                                              // 148
      if (this._roleAccepted(endpointContext, endpoint)) {                                                           // 149
        return endpoint.action.call(endpointContext);                                                                // 150
      } else {                                                                                                       //
        return {                                                                                                     // 151
          statusCode: 403,                                                                                           // 151
          body: {                                                                                                    // 151
            status: 'error',                                                                                         // 153
            message: 'You do not have permission to do this.'                                                        // 153
          }                                                                                                          //
        };                                                                                                           //
      }                                                                                                              //
    } else {                                                                                                         //
      if (auth.data) {                                                                                               // 156
        return auth.data;                                                                                            // 156
      } else {                                                                                                       //
        return {                                                                                                     // 157
          statusCode: 401,                                                                                           // 157
          body: {                                                                                                    // 157
            status: 'error',                                                                                         // 159
            message: 'You must be logged in to do this.'                                                             // 159
          }                                                                                                          //
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 163
  /*                                                                                                                 // 163
    Authenticate the given endpoint if required                                                                      //
                                                                                                                     //
    Once it's globally configured in the API, authentication can be required on an entire route or                   //
    individual endpoints. If required on an entire endpoint, that serves as the default. If required                 //
    in any individual endpoints, that will override the default.                                                     //
                                                                                                                     //
    @returns An object of the following format:                                                                      //
                                                                                                                     //
        {                                                                                                            //
          success: Boolean                                                                                           //
          data: String or Object                                                                                     //
        }                                                                                                            //
                                                                                                                     //
      where `success` is `true` if all required authentication checks pass and the optional `data`                   //
      will contain the auth data when successful and an optional error response when auth fails.                     //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._authAccepted = function(endpointContext, endpoint) {                                              // 3
    if (endpoint.authRequired) {                                                                                     // 181
      return this._authenticate(endpointContext);                                                                    // 182
    } else {                                                                                                         //
      return {                                                                                                       // 183
        success: true                                                                                                // 183
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 186
  /*                                                                                                                 // 186
    Verify the request is being made by an actively logged in user                                                   //
                                                                                                                     //
    If verified, attach the authenticated user to the context.                                                       //
                                                                                                                     //
    @returns An object of the following format:                                                                      //
                                                                                                                     //
        {                                                                                                            //
          success: Boolean                                                                                           //
          data: String or Object                                                                                     //
        }                                                                                                            //
                                                                                                                     //
      where `success` is `true` if all required authentication checks pass and the optional `data`                   //
      will contain the auth data when successful and an optional error response when auth fails.                     //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._authenticate = function(endpointContext) {                                                        // 3
    var auth, userSelector;                                                                                          // 203
    auth = this.api._config.auth.user.call(endpointContext);                                                         // 203
    if (!auth) {                                                                                                     // 205
      return {                                                                                                       // 205
        success: false                                                                                               // 205
      };                                                                                                             //
    }                                                                                                                //
    if (auth.userId && auth.token && !auth.user) {                                                                   // 208
      userSelector = {};                                                                                             // 209
      userSelector._id = auth.userId;                                                                                // 209
      userSelector[this.api._config.auth.token] = auth.token;                                                        // 209
      auth.user = Meteor.users.findOne(userSelector);                                                                // 209
    }                                                                                                                //
    if (auth.error) {                                                                                                // 214
      return {                                                                                                       // 214
        success: false,                                                                                              // 214
        data: auth.error                                                                                             // 214
      };                                                                                                             //
    }                                                                                                                //
    if (auth.user) {                                                                                                 // 217
      endpointContext.user = auth.user;                                                                              // 218
      endpointContext.userId = auth.user._id;                                                                        // 218
      return {                                                                                                       // 220
        success: true,                                                                                               // 220
        data: auth                                                                                                   // 220
      };                                                                                                             //
    } else {                                                                                                         //
      return {                                                                                                       // 221
        success: false                                                                                               // 221
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 224
  /*                                                                                                                 // 224
    Authenticate the user role if required                                                                           //
                                                                                                                     //
    Must be called after _authAccepted().                                                                            //
                                                                                                                     //
    @returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the                     //
             endpoint                                                                                                //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._roleAccepted = function(endpointContext, endpoint) {                                              // 3
    if (endpoint.roleRequired) {                                                                                     // 233
      if (_.isEmpty(_.intersection(endpoint.roleRequired, endpointContext.user.roles))) {                            // 234
        return false;                                                                                                // 235
      }                                                                                                              //
    }                                                                                                                //
    return true;                                                                                                     //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 239
  /*                                                                                                                 // 239
    Respond to an HTTP request                                                                                       //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._respond = function(response, body, statusCode, headers) {                                         // 3
    var defaultHeaders, delayInMilliseconds, minimumDelayInMilliseconds, randomMultiplierBetweenOneAndTwo, sendResponse;
    if (statusCode == null) {                                                                                        //
      statusCode = 200;                                                                                              //
    }                                                                                                                //
    if (headers == null) {                                                                                           //
      headers = {};                                                                                                  //
    }                                                                                                                //
    defaultHeaders = this._lowerCaseKeys(this.api._config.defaultHeaders);                                           // 245
    headers = this._lowerCaseKeys(headers);                                                                          // 245
    headers = _.extend(defaultHeaders, headers);                                                                     // 245
    if (headers['content-type'].match(/json|javascript/) !== null) {                                                 // 250
      if (this.api._config.prettyJson) {                                                                             // 251
        body = JSON.stringify(body, void 0, 2);                                                                      // 252
      } else {                                                                                                       //
        body = JSON.stringify(body);                                                                                 // 254
      }                                                                                                              //
    }                                                                                                                //
    sendResponse = function() {                                                                                      // 245
      response.writeHead(statusCode, headers);                                                                       // 258
      response.write(body);                                                                                          // 258
      return response.end();                                                                                         //
    };                                                                                                               //
    if (statusCode === 401 || statusCode === 403) {                                                                  // 261
      minimumDelayInMilliseconds = 500;                                                                              // 268
      randomMultiplierBetweenOneAndTwo = 1 + Math.random();                                                          // 268
      delayInMilliseconds = minimumDelayInMilliseconds * randomMultiplierBetweenOneAndTwo;                           // 268
      return Meteor.setTimeout(sendResponse, delayInMilliseconds);                                                   //
    } else {                                                                                                         //
      return sendResponse();                                                                                         //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 275
  /*                                                                                                                 // 275
    Return the object with all of the keys converted to lowercase                                                    //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._lowerCaseKeys = function(object) {                                                                // 3
    return _.chain(object).pairs().map(function(attr) {                                                              //
      return [attr[0].toLowerCase(), attr[1]];                                                                       //
    }).object().value();                                                                                             //
  };                                                                                                                 //
                                                                                                                     //
  return Route;                                                                                                      //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/restivus.coffee.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var                                                                                                                  // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
this.Restivus = (function() {                                                                                        // 1
  function Restivus(options) {                                                                                       // 3
    var corsHeaders;                                                                                                 // 4
    this._routes = [];                                                                                               // 4
    this._config = {                                                                                                 // 4
      paths: [],                                                                                                     // 6
      useDefaultAuth: false,                                                                                         // 6
      apiPath: 'api/',                                                                                               // 6
      version: null,                                                                                                 // 6
      prettyJson: false,                                                                                             // 6
      auth: {                                                                                                        // 6
        token: 'services.resume.loginTokens.hashedToken',                                                            // 12
        user: function() {                                                                                           // 12
          var token;                                                                                                 // 14
          if (this.request.headers['x-auth-token']) {                                                                // 14
            token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                  // 15
          }                                                                                                          //
          return {                                                                                                   //
            userId: this.request.headers['x-user-id'],                                                               // 16
            token: token                                                                                             // 16
          };                                                                                                         //
        }                                                                                                            //
      },                                                                                                             //
      defaultHeaders: {                                                                                              // 6
        'Content-Type': 'application/json'                                                                           // 19
      },                                                                                                             //
      enableCors: true                                                                                               // 6
    };                                                                                                               //
    _.extend(this._config, options);                                                                                 // 4
    if (this._config.enableCors) {                                                                                   // 25
      corsHeaders = {                                                                                                // 26
        'Access-Control-Allow-Origin': '*',                                                                          // 27
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'                             // 27
      };                                                                                                             //
      if (this._config.useDefaultAuth) {                                                                             // 30
        corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token';                                  // 31
      }                                                                                                              //
      _.extend(this._config.defaultHeaders, corsHeaders);                                                            // 26
      if (!this._config.defaultOptionsEndpoint) {                                                                    // 36
        this._config.defaultOptionsEndpoint = function() {                                                           // 37
          this.response.writeHead(200, corsHeaders);                                                                 // 38
          return this.done();                                                                                        //
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
    if (this._config.apiPath[0] === '/') {                                                                           // 42
      this._config.apiPath = this._config.apiPath.slice(1);                                                          // 43
    }                                                                                                                //
    if (_.last(this._config.apiPath) !== '/') {                                                                      // 44
      this._config.apiPath = this._config.apiPath + '/';                                                             // 45
    }                                                                                                                //
    if (this._config.version) {                                                                                      // 49
      this._config.apiPath += this._config.version + '/';                                                            // 50
    }                                                                                                                //
    if (this._config.useDefaultAuth) {                                                                               // 53
      this._initAuth();                                                                                              // 54
    } else if (this._config.useAuth) {                                                                               //
      this._initAuth();                                                                                              // 56
      console.warn('Warning: useAuth API config option will be removed in Restivus v1.0 ' + '\n    Use the useDefaultAuth option instead');
    }                                                                                                                //
    return this;                                                                                                     // 60
  }                                                                                                                  //
                                                                                                                     //
                                                                                                                     // 63
  /**                                                                                                                // 63
    Add endpoints for the given HTTP methods at the given path                                                       //
                                                                                                                     //
    @param path {String} The extended URL path (will be appended to base path of the API)                            //
    @param options {Object} Route configuration options                                                              //
    @param options.authRequired {Boolean} The default auth requirement for each endpoint on the route                //
    @param options.roleRequired {String or String[]} The default role required for each endpoint on the route        //
    @param endpoints {Object} A set of endpoints available on the new route (get, post, put, patch, delete, options)
    @param endpoints.<method> {Function or Object} If a function is provided, all default route                      //
        configuration options will be applied to the endpoint. Otherwise an object with an `action`                  //
        and all other route config options available. An `action` must be provided with the object.                  //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype.addRoute = function(path, options, endpoints) {                                                 // 3
    var route;                                                                                                       // 77
    route = new share.Route(this, path, options, endpoints);                                                         // 77
    this._routes.push(route);                                                                                        // 77
    route.addToApi();                                                                                                // 77
    return this;                                                                                                     // 82
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 85
  /**                                                                                                                // 85
    Generate routes for the Meteor Collection with the given name                                                    //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype.addCollection = function(collection, options) {                                                 // 3
    var collectionEndpoints, collectionRouteEndpoints, endpointsAwaitingConfiguration, entityRouteEndpoints, excludedEndpoints, methods, methodsOnCollection, path, routeOptions;
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    methods = ['get', 'post', 'put', 'patch', 'delete', 'getAll'];                                                   // 89
    methodsOnCollection = ['post', 'getAll'];                                                                        // 89
    if (collection === Meteor.users) {                                                                               // 93
      collectionEndpoints = this._userCollectionEndpoints;                                                           // 94
    } else {                                                                                                         //
      collectionEndpoints = this._collectionEndpoints;                                                               // 96
    }                                                                                                                //
    endpointsAwaitingConfiguration = options.endpoints || {};                                                        // 89
    routeOptions = options.routeOptions || {};                                                                       // 89
    excludedEndpoints = options.excludedEndpoints || [];                                                             // 89
    path = options.path || collection._name;                                                                         // 89
    collectionRouteEndpoints = {};                                                                                   // 89
    entityRouteEndpoints = {};                                                                                       // 89
    if (_.isEmpty(endpointsAwaitingConfiguration) && _.isEmpty(excludedEndpoints)) {                                 // 109
      _.each(methods, function(method) {                                                                             // 111
        if (indexOf.call(methodsOnCollection, method) >= 0) {                                                        // 113
          _.extend(collectionRouteEndpoints, collectionEndpoints[method].call(this, collection));                    // 114
        } else {                                                                                                     //
          _.extend(entityRouteEndpoints, collectionEndpoints[method].call(this, collection));                        // 115
        }                                                                                                            //
      }, this);                                                                                                      //
    } else {                                                                                                         //
      _.each(methods, function(method) {                                                                             // 120
        var configuredEndpoint, endpointOptions;                                                                     // 121
        if (indexOf.call(excludedEndpoints, method) < 0 && endpointsAwaitingConfiguration[method] !== false) {       // 121
          endpointOptions = endpointsAwaitingConfiguration[method];                                                  // 124
          configuredEndpoint = {};                                                                                   // 124
          _.each(collectionEndpoints[method].call(this, collection), function(action, methodType) {                  // 124
            return configuredEndpoint[methodType] = _.chain(action).clone().extend(endpointOptions).value();         //
          });                                                                                                        //
          if (indexOf.call(methodsOnCollection, method) >= 0) {                                                      // 133
            _.extend(collectionRouteEndpoints, configuredEndpoint);                                                  // 134
          } else {                                                                                                   //
            _.extend(entityRouteEndpoints, configuredEndpoint);                                                      // 135
          }                                                                                                          //
        }                                                                                                            //
      }, this);                                                                                                      //
    }                                                                                                                //
    this.addRoute(path, routeOptions, collectionRouteEndpoints);                                                     // 89
    this.addRoute(path + "/:id", routeOptions, entityRouteEndpoints);                                                // 89
    return this;                                                                                                     // 143
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 146
  /**                                                                                                                // 146
    A set of endpoints that can be applied to a Collection Route                                                     //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._collectionEndpoints = {                                                                        // 3
    get: function(collection) {                                                                                      // 150
      return {                                                                                                       //
        get: {                                                                                                       // 151
          action: function() {                                                                                       // 152
            var entity;                                                                                              // 153
            entity = collection.findOne(this.urlParams.id);                                                          // 153
            if (entity) {                                                                                            // 154
              return {                                                                                               //
                status: 'success',                                                                                   // 155
                data: entity                                                                                         // 155
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 157
                body: {                                                                                              // 157
                  status: 'fail',                                                                                    // 158
                  message: 'Item not found'                                                                          // 158
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    put: function(collection) {                                                                                      // 150
      return {                                                                                                       //
        put: {                                                                                                       // 160
          action: function() {                                                                                       // 161
            var entity, entityIsUpdated;                                                                             // 162
            entityIsUpdated = collection.update(this.urlParams.id, this.bodyParams);                                 // 162
            if (entityIsUpdated) {                                                                                   // 163
              entity = collection.findOne(this.urlParams.id);                                                        // 164
              return {                                                                                               //
                status: 'success',                                                                                   // 165
                data: entity                                                                                         // 165
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 167
                body: {                                                                                              // 167
                  status: 'fail',                                                                                    // 168
                  message: 'Item not found'                                                                          // 168
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    patch: function(collection) {                                                                                    // 150
      return {                                                                                                       //
        patch: {                                                                                                     // 170
          action: function() {                                                                                       // 171
            var entity, entityIsUpdated;                                                                             // 172
            entityIsUpdated = collection.update(this.urlParams.id, {                                                 // 172
              $set: this.bodyParams                                                                                  // 172
            });                                                                                                      //
            if (entityIsUpdated) {                                                                                   // 173
              entity = collection.findOne(this.urlParams.id);                                                        // 174
              return {                                                                                               //
                status: 'success',                                                                                   // 175
                data: entity                                                                                         // 175
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 177
                body: {                                                                                              // 177
                  status: 'fail',                                                                                    // 178
                  message: 'Item not found'                                                                          // 178
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    "delete": function(collection) {                                                                                 // 150
      return {                                                                                                       //
        "delete": {                                                                                                  // 180
          action: function() {                                                                                       // 181
            if (collection.remove(this.urlParams.id)) {                                                              // 182
              return {                                                                                               //
                status: 'success',                                                                                   // 183
                data: {                                                                                              // 183
                  message: 'Item removed'                                                                            // 183
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 185
                body: {                                                                                              // 185
                  status: 'fail',                                                                                    // 186
                  message: 'Item not found'                                                                          // 186
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    post: function(collection) {                                                                                     // 150
      return {                                                                                                       //
        post: {                                                                                                      // 188
          action: function() {                                                                                       // 189
            var entity, entityId;                                                                                    // 190
            entityId = collection.insert(this.bodyParams);                                                           // 190
            entity = collection.findOne(entityId);                                                                   // 190
            if (entity) {                                                                                            // 192
              return {                                                                                               //
                statusCode: 201,                                                                                     // 193
                body: {                                                                                              // 193
                  status: 'success',                                                                                 // 194
                  data: entity                                                                                       // 194
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 400,                                                                                     // 196
                body: {                                                                                              // 196
                  status: 'fail',                                                                                    // 197
                  message: 'No item added'                                                                           // 197
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    getAll: function(collection) {                                                                                   // 150
      return {                                                                                                       //
        get: {                                                                                                       // 199
          action: function() {                                                                                       // 200
            var entities;                                                                                            // 201
            entities = collection.find().fetch();                                                                    // 201
            if (entities) {                                                                                          // 202
              return {                                                                                               //
                status: 'success',                                                                                   // 203
                data: entities                                                                                       // 203
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 205
                body: {                                                                                              // 205
                  status: 'fail',                                                                                    // 206
                  message: 'Unable to retrieve items from collection'                                                // 206
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 209
  /**                                                                                                                // 209
    A set of endpoints that can be applied to a Meteor.users Collection Route                                        //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._userCollectionEndpoints = {                                                                    // 3
    get: function(collection) {                                                                                      // 213
      return {                                                                                                       //
        get: {                                                                                                       // 214
          action: function() {                                                                                       // 215
            var entity;                                                                                              // 216
            entity = collection.findOne(this.urlParams.id, {                                                         // 216
              fields: {                                                                                              // 216
                profile: 1                                                                                           // 216
              }                                                                                                      //
            });                                                                                                      //
            if (entity) {                                                                                            // 217
              return {                                                                                               //
                status: 'success',                                                                                   // 218
                data: entity                                                                                         // 218
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 220
                body: {                                                                                              // 220
                  status: 'fail',                                                                                    // 221
                  message: 'User not found'                                                                          // 221
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    put: function(collection) {                                                                                      // 213
      return {                                                                                                       //
        put: {                                                                                                       // 223
          action: function() {                                                                                       // 224
            var entity, entityIsUpdated;                                                                             // 225
            entityIsUpdated = collection.update(this.urlParams.id, {                                                 // 225
              $set: {                                                                                                // 225
                profile: this.bodyParams                                                                             // 225
              }                                                                                                      //
            });                                                                                                      //
            if (entityIsUpdated) {                                                                                   // 226
              entity = collection.findOne(this.urlParams.id, {                                                       // 227
                fields: {                                                                                            // 227
                  profile: 1                                                                                         // 227
                }                                                                                                    //
              });                                                                                                    //
              return {                                                                                               //
                status: "success",                                                                                   // 228
                data: entity                                                                                         // 228
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 230
                body: {                                                                                              // 230
                  status: 'fail',                                                                                    // 231
                  message: 'User not found'                                                                          // 231
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    "delete": function(collection) {                                                                                 // 213
      return {                                                                                                       //
        "delete": {                                                                                                  // 233
          action: function() {                                                                                       // 234
            if (collection.remove(this.urlParams.id)) {                                                              // 235
              return {                                                                                               //
                status: 'success',                                                                                   // 236
                data: {                                                                                              // 236
                  message: 'User removed'                                                                            // 236
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 238
                body: {                                                                                              // 238
                  status: 'fail',                                                                                    // 239
                  message: 'User not found'                                                                          // 239
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    post: function(collection) {                                                                                     // 213
      return {                                                                                                       //
        post: {                                                                                                      // 241
          action: function() {                                                                                       // 242
            var entity, entityId;                                                                                    // 244
            entityId = Accounts.createUser(this.bodyParams);                                                         // 244
            entity = collection.findOne(entityId, {                                                                  // 244
              fields: {                                                                                              // 245
                profile: 1                                                                                           // 245
              }                                                                                                      //
            });                                                                                                      //
            if (entity) {                                                                                            // 246
              return {                                                                                               //
                statusCode: 201,                                                                                     // 247
                body: {                                                                                              // 247
                  status: 'success',                                                                                 // 248
                  data: entity                                                                                       // 248
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              ({                                                                                                     // 250
                statusCode: 400                                                                                      // 250
              });                                                                                                    //
              return {                                                                                               //
                status: 'fail',                                                                                      // 251
                message: 'No user added'                                                                             // 251
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    getAll: function(collection) {                                                                                   // 213
      return {                                                                                                       //
        get: {                                                                                                       // 253
          action: function() {                                                                                       // 254
            var entities;                                                                                            // 255
            entities = collection.find({}, {                                                                         // 255
              fields: {                                                                                              // 255
                profile: 1                                                                                           // 255
              }                                                                                                      //
            }).fetch();                                                                                              //
            if (entities) {                                                                                          // 256
              return {                                                                                               //
                status: 'success',                                                                                   // 257
                data: entities                                                                                       // 257
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 259
                body: {                                                                                              // 259
                  status: 'fail',                                                                                    // 260
                  message: 'Unable to retrieve users'                                                                // 260
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 263
  /*                                                                                                                 // 263
    Add /login and /logout endpoints to the API                                                                      //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._initAuth = function() {                                                                        // 3
    var logout, self;                                                                                                // 267
    self = this;                                                                                                     // 267
                                                                                                                     // 268
    /*                                                                                                               // 268
      Add a login endpoint to the API                                                                                //
                                                                                                                     //
      After the user is logged in, the onLoggedIn hook is called (see Restfully.configure() for                      //
      adding hook).                                                                                                  //
     */                                                                                                              //
    this.addRoute('login', {                                                                                         // 267
      authRequired: false                                                                                            // 274
    }, {                                                                                                             //
      post: function() {                                                                                             // 275
        var auth, e, extraData, password, ref, ref1, response, searchQuery, user;                                    // 277
        user = {};                                                                                                   // 277
        if (this.bodyParams.user) {                                                                                  // 278
          if (this.bodyParams.user.indexOf('@') === -1) {                                                            // 279
            user.username = this.bodyParams.user;                                                                    // 280
          } else {                                                                                                   //
            user.email = this.bodyParams.user;                                                                       // 282
          }                                                                                                          //
        } else if (this.bodyParams.username) {                                                                       //
          user.username = this.bodyParams.username;                                                                  // 284
        } else if (this.bodyParams.email) {                                                                          //
          user.email = this.bodyParams.email;                                                                        // 286
        }                                                                                                            //
        password = this.bodyParams.password;                                                                         // 277
        if (this.bodyParams.hashed) {                                                                                // 289
          password = {                                                                                               // 290
            digest: password,                                                                                        // 291
            algorithm: 'sha-256'                                                                                     // 291
          };                                                                                                         //
        }                                                                                                            //
        try {                                                                                                        // 295
          auth = Auth.loginWithPassword(user, password);                                                             // 296
        } catch (_error) {                                                                                           //
          e = _error;                                                                                                // 298
          return {                                                                                                   // 298
            statusCode: e.error,                                                                                     // 299
            body: {                                                                                                  // 299
              status: 'error',                                                                                       // 300
              message: e.reason                                                                                      // 300
            }                                                                                                        //
          };                                                                                                         //
        }                                                                                                            //
        if (auth.userId && auth.authToken) {                                                                         // 304
          searchQuery = {};                                                                                          // 305
          searchQuery[self._config.auth.token] = Accounts._hashLoginToken(auth.authToken);                           // 305
          this.user = Meteor.users.findOne({                                                                         // 305
            '_id': auth.userId                                                                                       // 308
          }, searchQuery);                                                                                           //
          this.userId = (ref = this.user) != null ? ref._id : void 0;                                                // 305
        }                                                                                                            //
        response = {                                                                                                 // 277
          status: 'success',                                                                                         // 312
          data: auth                                                                                                 // 312
        };                                                                                                           //
        extraData = (ref1 = self._config.onLoggedIn) != null ? ref1.call(this) : void 0;                             // 277
        if (extraData != null) {                                                                                     // 316
          _.extend(response.data, {                                                                                  // 317
            extra: extraData                                                                                         // 317
          });                                                                                                        //
        }                                                                                                            //
        return response;                                                                                             //
      }                                                                                                              //
    });                                                                                                              //
    logout = function() {                                                                                            // 267
      var authToken, extraData, hashedToken, index, ref, response, tokenFieldName, tokenLocation, tokenPath, tokenRemovalQuery, tokenToRemove;
      authToken = this.request.headers['x-auth-token'];                                                              // 323
      hashedToken = Accounts._hashLoginToken(authToken);                                                             // 323
      tokenLocation = self._config.auth.token;                                                                       // 323
      index = tokenLocation.lastIndexOf('.');                                                                        // 323
      tokenPath = tokenLocation.substring(0, index);                                                                 // 323
      tokenFieldName = tokenLocation.substring(index + 1);                                                           // 323
      tokenToRemove = {};                                                                                            // 323
      tokenToRemove[tokenFieldName] = hashedToken;                                                                   // 323
      tokenRemovalQuery = {};                                                                                        // 323
      tokenRemovalQuery[tokenPath] = tokenToRemove;                                                                  // 323
      Meteor.users.update(this.user._id, {                                                                           // 323
        $pull: tokenRemovalQuery                                                                                     // 333
      });                                                                                                            //
      response = {                                                                                                   // 323
        status: 'success',                                                                                           // 335
        data: {                                                                                                      // 335
          message: 'You\'ve been logged out!'                                                                        // 335
        }                                                                                                            //
      };                                                                                                             //
      extraData = (ref = self._config.onLoggedOut) != null ? ref.call(this) : void 0;                                // 323
      if (extraData != null) {                                                                                       // 339
        _.extend(response.data, {                                                                                    // 340
          extra: extraData                                                                                           // 340
        });                                                                                                          //
      }                                                                                                              //
      return response;                                                                                               //
    };                                                                                                               //
                                                                                                                     // 344
    /*                                                                                                               // 344
      Add a logout endpoint to the API                                                                               //
                                                                                                                     //
      After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for                    //
      adding hook).                                                                                                  //
     */                                                                                                              //
    return this.addRoute('logout', {                                                                                 //
      authRequired: true                                                                                             // 350
    }, {                                                                                                             //
      get: function() {                                                                                              // 351
        console.warn("Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead.");         // 352
        console.warn("    See https://github.com/kahmali/meteor-restivus/issues/100");                               // 352
        return logout.call(this);                                                                                    // 354
      },                                                                                                             //
      post: logout                                                                                                   // 351
    });                                                                                                              //
  };                                                                                                                 //
                                                                                                                     //
  return Restivus;                                                                                                   //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
Restivus = this.Restivus;                                                                                            // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['nimble:restivus'] = {}, {
  Restivus: Restivus
});

})();

//# sourceMappingURL=nimble_restivus.js.map
