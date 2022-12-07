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

function transformEntrypoint (entrypoint, index) {
  entrypoint = entrypoint || {};
  const ep = {};
  ep.name = createLabel(index + 1);
  ep.contextPath = entrypoint.contextPath || "/";
  ep.defaultIndex = entrypoint.defaultIndex || "index.html";
  ep.publicDir = entrypoint.publicDir || entrypoint.publicDir;
  return ep;
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
      layers.push(buildLayer(express, transformEntrypoint(entrypoint, index)));
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
