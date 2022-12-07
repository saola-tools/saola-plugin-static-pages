'use strict';

const path = require('path');

function Service (params = {}) {
  const { sandboxConfig, loggingFactory, webweaverService } = params || {};

  const layers = [
    webweaverService.getDefaultRedirectLayer(),
  ];

  const express = webweaverService.express;

  const defaultEntryPoint = {
    contextPath: sandboxConfig.contextPath || "/",
    defaultIndex: sandboxConfig.defaultIndex || "index.html",
    publicDir: sandboxConfig.publicDir
      || sandboxConfig.staticDir
      || path.join(__dirname, '../../public'),
  }

  layers.push({
    name: 'app-static-pages-resources',
    path: defaultEntryPoint.contextPath,
    middleware: express.static(defaultEntryPoint.publicDir, {
      index: defaultEntryPoint.defaultIndex,
    })
  });

  webweaverService.push(layers, sandboxConfig.priority);
};

Service.referenceHash = {
  webweaverService: 'app-webweaver/webweaverService'
};

module.exports = Service;
