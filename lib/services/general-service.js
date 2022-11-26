'use strict';

const path = require('path');

function Service(params = {}) {
  const { sandboxConfig, loggingFactory, webweaverService } = params || {};

  const contextPath = sandboxConfig.contextPath || '/';
  const publicDir = sandboxConfig.publicDir || path.join(__dirname, '../../public');

  const express = webweaverService.express;

  webweaverService.push([
    webweaverService.getDefaultRedirectLayer(),
    {
      name: 'app-static-pages-resources',
      path: contextPath,
      middleware: express.static(publicDir)
    },
  ], sandboxConfig.priority);
};

Service.referenceHash = {
  webweaverService: 'app-webweaver/webweaverService'
};

module.exports = Service;