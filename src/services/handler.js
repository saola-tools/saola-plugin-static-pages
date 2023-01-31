"use strict";

const path = require("path");

const Devebot = require("@saola/core");
const chores = Devebot.require("chores");

const { PortletMixiner } = require("@saola/plugin-webserver").require("portlet");

function Handler (params = {}) {
  const { packageName, loggingFactory, configPortletifier, webweaverService } = params;

  const express = webweaverService.express;

  PortletMixiner.call(this, {
    portletDescriptors: configPortletifier.getPortletDescriptors(),
    portletReferenceHolders: { webweaverService },
    portletArguments: { packageName, loggingFactory, express },
    PortletConstructor: Portlet,
  });
}

Object.assign(Handler.prototype, PortletMixiner.prototype);

Handler.referenceHash = {
  configPortletifier: "portletifier",
  webweaverService: "@saola/plugin-webweaver/webweaverService",
};

function Portlet (params = {}) {
  const { packageName, loggingFactory, express, portletName, portletConfig, webweaverService } = params;

  const L = loggingFactory.getLogger();
  const T = loggingFactory.getTracer();
  const blockRef = chores.getBlockRef(__filename, packageName);

  L && L.has("silly") && L.log("silly", T && T.add({ portletName }).toMessage({
    tags: [ blockRef ],
    text: "The Portlet[${portletName}] is available"
  }));

  const layers = [
    webweaverService.getDefaultRedirectLayer(),
  ];

  if (portletConfig.entrypoints) {
    const this_buildLayers = buildLayers.bind({ L, T, blockRef });
    layers.push(...this_buildLayers(express, portletConfig.entrypoints));
  } else {
    layers.push(buildLayer(express, extractEntrypoint(portletConfig)));
  }

  webweaverService.push(layers, portletConfig.priority);
};

function extractEntrypoint (portletConfig) {
  return {
    name: createLabel(),
    contextPath: portletConfig.contextPath || "/",
    defaultIndex: portletConfig.defaultIndex || "index.html",
    publicDir: portletConfig.publicDir ||
      portletConfig.staticDir ||
      path.join(__dirname, "../../public"),
  };
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
  };
}

function buildLayers (express, entrypoints) {
  const { L, T, blockRef } = this || {};
  const layers = [];
  if (Array.isArray(entrypoints) && entrypoints.length > 0) {
    for (let [index, entrypoint] of entrypoints.entries()) {
      entrypoint = transformEntrypoint(entrypoint, index);
      //
      L && L.has("silly") && L.log("silly", T && T.add({ entrypoint }).toMessage({
        tags: [ blockRef ],
        text: "The Entrypoint[${entrypoint.contextPath}] is registered"
      }));
      //
      layers.push(buildLayer(express, entrypoint));
    }
  }
  return layers;
}

function createLabel (index) {
  const label = index ? String(index).padStart(3, "0") : "default";
  return "saola-plugin-static-pages-" + label;
}

module.exports = Handler;
