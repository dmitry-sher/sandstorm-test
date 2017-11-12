(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Log = Package.logging.Log;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var Migrations;

var require = meteorInstall({"node_modules":{"meteor":{"percolate:migrations":{"migrations_server.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/percolate_migrations/migrations_server.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*                                                                                                              // 1
  Adds migration capabilities. Migrations are defined like:                                                     //
                                                                                                                //
  Migrations.add({                                                                                              //
    up: function() {}, //*required* code to run to migrate upwards                                              //
    version: 1, //*required* number to identify migration order                                                 //
    down: function() {}, //*optional* code to run to migrate downwards                                          //
    name: 'Something' //*optional* display name for the migration                                               //
  });                                                                                                           //
                                                                                                                //
  The ordering of migrations is determined by the version you set.                                              //
                                                                                                                //
  To run the migrations, set the MIGRATE environment variable to either                                         //
  'latest' or the version number you want to migrate to. Optionally, append                                     //
  ',exit' if you want the migrations to exit the meteor process, e.g if you're                                  //
  migrating from a script (remember to pass the --once parameter).                                              //
                                                                                                                //
  e.g:                                                                                                          //
  MIGRATE="latest" mrt # ensure we'll be at the latest version and run the app                                  //
  MIGRATE="latest,exit" mrt --once # ensure we'll be at the latest version and exit                             //
  MIGRATE="2,exit" mrt --once # migrate to version 2 and exit                                                   //
                                                                                                                //
  Note: Migrations will lock ensuring only 1 app can be migrating at once. If                                   //
  a migration crashes, the control record in the migrations collection will                                     //
  remain locked and at the version it was at previously, however the db could                                   //
  be in an inconsistant state.                                                                                  //
*/ // since we'll be at version 0 by default, we should have a migration set for                                //
// it.                                                                                                          // 30
var DefaultMigration = {                                                                                        // 31
  version: 0,                                                                                                   // 31
  up: function () {}                                                                                            // 31
};                                                                                                              // 31
Migrations = {                                                                                                  // 33
  _list: [DefaultMigration],                                                                                    // 34
  options: {                                                                                                    // 35
    // false disables logging                                                                                   // 36
    log: true,                                                                                                  // 37
    // null or a function                                                                                       // 38
    logger: null,                                                                                               // 39
    // enable/disable info log "already at latest."                                                             // 40
    logIfLatest: true,                                                                                          // 41
    // migrations collection name                                                                               // 42
    collectionName: 'migrations'                                                                                // 43
  },                                                                                                            // 35
  config: function (opts) {                                                                                     // 45
    this.options = _.extend({}, this.options, opts);                                                            // 46
  }                                                                                                             // 47
}; /*                                                                                                           // 33
     Logger factory function. Takes a prefix string and options object                                          //
     and uses an injected `logger` if provided, else falls back to                                              //
     Meteor's `Log` package.                                                                                    //
     Will send a log object to the injected logger, on the following form:                                      //
       message: String                                                                                          //
       level: String (info, warn, error, debug)                                                                 //
       tag: 'Migrations'                                                                                        //
   */                                                                                                           //
                                                                                                                //
function createLogger(prefix) {                                                                                 // 59
  check(prefix, String); // Return noop if logging is disabled.                                                 // 60
                                                                                                                //
  if (Migrations.options.log === false) {                                                                       // 63
    return function () {};                                                                                      // 64
  }                                                                                                             // 65
                                                                                                                //
  return function (level, message) {                                                                            // 67
    check(level, Match.OneOf('info', 'error', 'warn', 'debug'));                                                // 68
    check(message, String);                                                                                     // 69
    var logger = Migrations.options && Migrations.options.logger;                                               // 71
                                                                                                                //
    if (logger && _.isFunction(logger)) {                                                                       // 73
      logger({                                                                                                  // 74
        level: level,                                                                                           // 75
        message: message,                                                                                       // 76
        tag: prefix                                                                                             // 77
      });                                                                                                       // 74
    } else {                                                                                                    // 79
      Log[level]({                                                                                              // 80
        message: prefix + ': ' + message                                                                        // 80
      });                                                                                                       // 80
    }                                                                                                           // 81
  };                                                                                                            // 82
}                                                                                                               // 83
                                                                                                                //
var log;                                                                                                        // 85
Meteor.startup(function () {                                                                                    // 87
  var options = Migrations.options; // collection holding the control record                                    // 88
                                                                                                                //
  Migrations._collection = new Mongo.Collection(options.collectionName);                                        // 91
  log = createLogger('Migrations');                                                                             // 93
  ['info', 'warn', 'error', 'debug'].forEach(function (level) {                                                 // 95
    log[level] = _.partial(log, level);                                                                         // 96
  });                                                                                                           // 97
  if (process.env.MIGRATE) Migrations.migrateTo(process.env.MIGRATE);                                           // 99
}); // Add a new migration:                                                                                     // 100
// {up: function *required                                                                                      // 103
//  version: Number *required                                                                                   // 104
//  down: function *optional                                                                                    // 105
//  name: String *optional                                                                                      // 106
// }                                                                                                            // 107
                                                                                                                //
Migrations.add = function (migration) {                                                                         // 108
  if (typeof migration.up !== 'function') throw new Meteor.Error('Migration must supply an up function.');      // 109
  if (typeof migration.version !== 'number') throw new Meteor.Error('Migration must supply a version number.');
  if (migration.version <= 0) throw new Meteor.Error('Migration version must be greater than 0'); // Freeze the migration object to make it hereafter immutable
                                                                                                                //
  Object.freeze(migration);                                                                                     // 119
                                                                                                                //
  this._list.push(migration);                                                                                   // 121
                                                                                                                //
  this._list = _.sortBy(this._list, function (m) {                                                              // 122
    return m.version;                                                                                           // 123
  });                                                                                                           // 124
}; // Attempts to run the migrations using command in the form of:                                              // 125
// e.g 'latest', 'latest,exit', 2                                                                               // 128
// use 'XX,rerun' to re-run the migration at that version                                                       // 129
                                                                                                                //
                                                                                                                //
Migrations.migrateTo = function (command) {                                                                     // 130
  if (_.isUndefined(command) || command === '' || this._list.length === 0) throw new Error('Cannot migrate using invalid command: ' + command);
                                                                                                                //
  if (typeof command === 'number') {                                                                            // 134
    var version = command;                                                                                      // 135
  } else {                                                                                                      // 136
    var version = command.split(',')[0]; //.trim();                                                             // 137
                                                                                                                //
    var subcommand = command.split(',')[1]; //.trim();                                                          // 138
  }                                                                                                             // 139
                                                                                                                //
  if (version === 'latest') {                                                                                   // 141
    this._migrateTo(_.last(this._list).version);                                                                // 142
  } else {                                                                                                      // 143
    this._migrateTo(parseInt(version), subcommand === 'rerun');                                                 // 144
  } // remember to run meteor with --once otherwise it will restart                                             // 145
                                                                                                                //
                                                                                                                //
  if (subcommand === 'exit') process.exit(0);                                                                   // 148
}; // just returns the current version                                                                          // 149
                                                                                                                //
                                                                                                                //
Migrations.getVersion = function () {                                                                           // 152
  return this._getControl().version;                                                                            // 153
}; // migrates to the specific version passed in                                                                // 154
                                                                                                                //
                                                                                                                //
Migrations._migrateTo = function (version, rerun) {                                                             // 157
  var self = this;                                                                                              // 158
                                                                                                                //
  var control = this._getControl(); // Side effect: upserts control document.                                   // 159
                                                                                                                //
                                                                                                                //
  var currentVersion = control.version;                                                                         // 160
                                                                                                                //
  if (lock() === false) {                                                                                       // 162
    log.info('Not migrating, control is locked.');                                                              // 163
    return;                                                                                                     // 164
  }                                                                                                             // 165
                                                                                                                //
  if (rerun) {                                                                                                  // 167
    log.info('Rerunning version ' + version);                                                                   // 168
    migrate('up', this._findIndexByVersion(version));                                                           // 169
    log.info('Finished migrating.');                                                                            // 170
    unlock();                                                                                                   // 171
    return;                                                                                                     // 172
  }                                                                                                             // 173
                                                                                                                //
  if (currentVersion === version) {                                                                             // 175
    if (Migrations.options.logIfLatest) {                                                                       // 176
      log.info('Not migrating, already at version ' + version);                                                 // 177
    }                                                                                                           // 178
                                                                                                                //
    unlock();                                                                                                   // 179
    return;                                                                                                     // 180
  }                                                                                                             // 181
                                                                                                                //
  var startIdx = this._findIndexByVersion(currentVersion);                                                      // 183
                                                                                                                //
  var endIdx = this._findIndexByVersion(version); // log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);    // 184
                                                                                                                //
                                                                                                                //
  log.info('Migrating from version ' + this._list[startIdx].version + ' -> ' + this._list[endIdx].version); // run the actual migration
                                                                                                                //
  function migrate(direction, idx) {                                                                            // 195
    var migration = self._list[idx];                                                                            // 196
                                                                                                                //
    if (typeof migration[direction] !== 'function') {                                                           // 198
      unlock();                                                                                                 // 199
      throw new Meteor.Error('Cannot migrate ' + direction + ' on version ' + migration.version);               // 200
    }                                                                                                           // 203
                                                                                                                //
    function maybeName() {                                                                                      // 205
      return migration.name ? ' (' + migration.name + ')' : '';                                                 // 206
    }                                                                                                           // 207
                                                                                                                //
    log.info('Running ' + direction + '() on version ' + migration.version + maybeName());                      // 209
    migration[direction](migration);                                                                            // 217
  } // Returns true if lock was acquired.                                                                       // 218
                                                                                                                //
                                                                                                                //
  function lock() {                                                                                             // 221
    // This is atomic. The selector ensures only one caller at a time will see                                  // 222
    // the unlocked control, and locking occurs in the same update's modifier.                                  // 223
    // All other simultaneous callers will get false back from the update.                                      // 224
    return self._collection.update({                                                                            // 225
      _id: 'control',                                                                                           // 227
      locked: false                                                                                             // 227
    }, {                                                                                                        // 227
      $set: {                                                                                                   // 228
        locked: true,                                                                                           // 228
        lockedAt: new Date()                                                                                    // 228
      }                                                                                                         // 228
    }) === 1;                                                                                                   // 228
  } // Side effect: saves version.                                                                              // 231
                                                                                                                //
                                                                                                                //
  function unlock() {                                                                                           // 234
    self._setControl({                                                                                          // 235
      locked: false,                                                                                            // 235
      version: currentVersion                                                                                   // 235
    });                                                                                                         // 235
  }                                                                                                             // 236
                                                                                                                //
  if (currentVersion < version) {                                                                               // 238
    for (var i = startIdx; i < endIdx; i++) {                                                                   // 239
      migrate('up', i + 1);                                                                                     // 240
      currentVersion = self._list[i + 1].version;                                                               // 241
    }                                                                                                           // 242
  } else {                                                                                                      // 243
    for (var i = startIdx; i > endIdx; i--) {                                                                   // 244
      migrate('down', i);                                                                                       // 245
      currentVersion = self._list[i - 1].version;                                                               // 246
    }                                                                                                           // 247
  }                                                                                                             // 248
                                                                                                                //
  unlock();                                                                                                     // 250
  log.info('Finished migrating.');                                                                              // 251
}; // gets the current control record, optionally creating it if non-existant                                   // 252
                                                                                                                //
                                                                                                                //
Migrations._getControl = function () {                                                                          // 255
  var control = this._collection.findOne({                                                                      // 256
    _id: 'control'                                                                                              // 256
  });                                                                                                           // 256
                                                                                                                //
  return control || this._setControl({                                                                          // 258
    version: 0,                                                                                                 // 258
    locked: false                                                                                               // 258
  });                                                                                                           // 258
}; // sets the control record                                                                                   // 259
                                                                                                                //
                                                                                                                //
Migrations._setControl = function (control) {                                                                   // 262
  // be quite strict                                                                                            // 263
  check(control.version, Number);                                                                               // 264
  check(control.locked, Boolean);                                                                               // 265
                                                                                                                //
  this._collection.update({                                                                                     // 267
    _id: 'control'                                                                                              // 268
  }, {                                                                                                          // 268
    $set: {                                                                                                     // 269
      version: control.version,                                                                                 // 269
      locked: control.locked                                                                                    // 269
    }                                                                                                           // 269
  }, {                                                                                                          // 269
    upsert: true                                                                                                // 270
  });                                                                                                           // 270
                                                                                                                //
  return control;                                                                                               // 273
}; // returns the migration index in _list or throws if not found                                               // 274
                                                                                                                //
                                                                                                                //
Migrations._findIndexByVersion = function (version) {                                                           // 277
  for (var i = 0; i < this._list.length; i++) {                                                                 // 278
    if (this._list[i].version === version) return i;                                                            // 279
  }                                                                                                             // 280
                                                                                                                //
  throw new Meteor.Error("Can't find migration version " + version);                                            // 282
}; //reset (mainly intended for tests)                                                                          // 283
                                                                                                                //
                                                                                                                //
Migrations._reset = function () {                                                                               // 286
  this._list = [{                                                                                               // 287
    version: 0,                                                                                                 // 287
    up: function () {}                                                                                          // 287
  }];                                                                                                           // 287
                                                                                                                //
  this._collection.remove({});                                                                                  // 288
}; // unlock control                                                                                            // 289
                                                                                                                //
                                                                                                                //
Migrations.unlock = function () {                                                                               // 292
  this._collection.update({                                                                                     // 293
    _id: 'control'                                                                                              // 293
  }, {                                                                                                          // 293
    $set: {                                                                                                     // 293
      locked: false                                                                                             // 293
    }                                                                                                           // 293
  });                                                                                                           // 293
};                                                                                                              // 294
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/percolate:migrations/migrations_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['percolate:migrations'] = {}, {
  Migrations: Migrations
});

})();

//# sourceMappingURL=percolate_migrations.js.map
