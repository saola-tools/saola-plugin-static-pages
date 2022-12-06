'use strict';

const path = require('path');

function Service (params = {}) {
  const { sandboxConfig, loggingFactory, webweaverService } = params || {};

  const layers = [
    webweaverService.getDefaultRedirectLayer(),
  ];

  const express = webweaverService.express;

  const contextPath = sandboxConfig.contextPath || "/";
  const defaultIndex = sandboxConfig.defaultIndex || "index.html";
  const publicDir = sandboxConfig.publicDir
      || sandboxConfig.staticDir
      || path.join(__dirname, '../../public');

  layers.push({
    name: 'app-static-pages-resources',
    path: contextPath,
    middleware: express.static(publicDir, { index: defaultIndex })
  });

  webweaverService.push(layers, sandboxConfig.priority);
};

Service.referenceHash = {
  webweaverService: 'app-webweaver/webweaverService'
};

module.exports = Service;
