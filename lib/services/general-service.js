'use strict';

const path = require('path');

function Service (params = {}) {
  const { sandboxConfig, loggingFactory, webweaverService } = params || {};

  const contextPath = sandboxConfig.contextPath || "/";
  const defaultIndex = sandboxConfig.defaultIndex || "index.html";
  const publicDir = sandboxConfig.publicDir
      || sandboxConfig.staticDir
      || path.join(__dirname, '../../public');

  const express = webweaverService.express;

  webweaverService.push([
    webweaverService.getDefaultRedirectLayer(),
    {
      name: 'app-static-pages-resources',
      path: contextPath,
      middleware: express.static(publicDir, { index: defaultIndex })
    },
  ], sandboxConfig.priority);
};

Service.referenceHash = {
  webweaverService: 'app-webweaver/webweaverService'
};

module.exports = Service;
