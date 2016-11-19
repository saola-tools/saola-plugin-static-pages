'use strict';

var events = require('events');
var util = require('util');
var path = require('path');
var Devebot = require('devebot');
var lodash = Devebot.require('lodash');
var debug = Devebot.require('debug');
var debuglog = debug('appHomepage:trailer');

var Service = function(params) {
  debuglog.isEnabled && debuglog(' + constructor begin ...');

  params = params || {};

  var self = this;

  self.logger = params.loggingFactory.getLogger();

  self.getSandboxName = function() {
    return params.sandboxName;
  };

  var pluginCfg = lodash.get(params, ['sandboxConfig', 'plugins', 'appHomepage'], {});
  debuglog.isEnabled && debuglog(' - appHomepage config: %s', JSON.stringify(pluginCfg));
  var homepageUrl = pluginCfg.homepageUrl || '/index';
  var contextPath = pluginCfg.contextPath || '/homepage';

  var webserverTrigger = params.webserverTrigger;
  var express = webserverTrigger.getExpress();
  var position = webserverTrigger.getPosition();

  var router = new express();
  router.set('views', __dirname + '/../../views');
  router.set('view engine', 'ejs');
  router.get('', function(req, res, next) {
    res.render('index', { contextPath: contextPath });
  });
  webserverTrigger.inject(router, homepageUrl, position.inRangeOfMiddlewares(), 'app-homepage-index');
  webserverTrigger.inject(express.static(path.join(__dirname, '../../public')),
      contextPath, position.inRangeOfStaticFiles(), 'app-homepage-public');

  self.getServiceInfo = function() {
    return {};
  };

  self.getServiceHelp = function() {
    return {};
  };

  debuglog.isEnabled && debuglog(' - constructor end!');
};

Service.argumentSchema = {
  "id": "homepageTrailer",
  "type": "object",
  "properties": {
    "sandboxName": {
      "type": "string"
    },
    "sandboxConfig": {
      "type": "object"
    },
    "profileConfig": {
      "type": "object"
    },
    "generalConfig": {
      "type": "object"
    },
    "loggingFactory": {
      "type": "object"
    },
    "webserverTrigger": {
      "type": "object"
    }
  }
};

module.exports = Service;
