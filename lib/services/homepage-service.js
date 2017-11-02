'use strict';

var events = require('events');
var util = require('util');
var path = require('path');
var Devebot = require('devebot');
var lodash = Devebot.require('lodash');
var debugx = Devebot.require('debug')('appHomepage:service');

var Service = function(params) {
  debugx.enabled && debugx(' + constructor begin ...');

  params = params || {};

  var self = this;

  self.logger = params.loggingFactory.getLogger();

  self.getSandboxName = function() {
    return params.sandboxName;
  };

  var pluginCfg = lodash.get(params, ['sandboxConfig', 'plugins', 'appHomepage'], {});
  debugx.enabled && debugx(' - appHomepage config: %s', JSON.stringify(pluginCfg));
  var homepageUrl = pluginCfg.homepageUrl || '/index';
  var contextPath = pluginCfg.contextPath || '/homepage';
  var express = params.webweaverService.express;

  var router = new express();
  router.set('views', __dirname + '/../../views');
  router.set('view engine', 'ejs');
  router.get('', function(req, res, next) {
    res.render('index', { contextPath: contextPath });
  });

  params.webweaverService.push([
    params.webweaverService.getDefaultRedirectLayer(),
    {
      name: 'app-homepage-public',
      path: contextPath,
      middleware: express.static(path.join(__dirname, '../../public'))
    },
    {
      name: 'app-homepage-index',
      path: homepageUrl,
      middleware: router
    }
  ], pluginCfg.priority);

  debugx.enabled && debugx(' - constructor end!');
};

Service.argumentSchema = {
  "id": "homepageService",
  "type": "object",
  "properties": {
    "sandboxName": {
      "type": "string"
    },
    "sandboxConfig": {
      "type": "object"
    },
    "loggingFactory": {
      "type": "object"
    },
    "webweaverService": {
      "type": "object"
    }
  }
};

module.exports = Service;
