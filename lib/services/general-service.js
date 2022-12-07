'use strict';

const path = require('path');

function Service (params = {}) {
  const { sandboxConfig, loggingFactory, webweaverService } = params || {};
  const express = webweaverService.express;

  const layers = [
    webweaverService.getDefaultRedirectLayer(),
  ];

  if (sandboxConfig.entrypoints) {
    layers.push(...buildLayers(express, sandboxConfig.entrypoints));
  } else {
    layers.push(buildLayer(express, extractEntrypoint(sandboxConfig)));
  }

  webweaverService.push(layers, sandboxConfig.priority);
};

function extractEntrypoint (sandboxConfig) {
  return {
    name: createLabel(),
    contextPath: sandboxConfig.contextPath || "/",
    defaultIndex: sandboxConfig.defaultIndex || "index.html",
    publicDir: sandboxConfig.publicDir
      || sandboxConfig.staticDir
      || path.join(__dirname, '../../public'),
  }
}

function buildLayer (express, entrypoint) {
  return {
    name: entrypoint.name,
    path: path.join("/", entrypoint.contextPath),
    middleware: express.static(entrypoint.publicDir, {
      index: entrypoint.defaultIndex,
    })
  }
}

function buildLayers (express, entrypoints) {
  const layers = [];
  if (Array.isArray(entrypoints) && entrypoints.length > 0) {
    for (let [index, entrypoint] of entrypoints.entries()) {
      entrypoint.name = createLabel(index + 1);
      layers.push(buildLayer(express, entrypoint));
    }
  }
  return layers;
}

function createLabel (index) {
  const label = index ? String(index).padStart(3, "0") : "default";
  return "app-static-pages-" + label;
}

Service.referenceHash = {
  webweaverService: 'app-webweaver/webweaverService'
};

module.exports = Service;
