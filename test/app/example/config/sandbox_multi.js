"use strict";

const path = require("path");

module.exports = {
  plugins: {
    pluginStaticPages: {
      entrypoints: [
        {
          contextPath: "multi",
          publicDir: path.join(__dirname, "../public/case1"),
          defaultIndex: "index.html",
        },
        {
          contextPath: "/multi",
          publicDir: path.join(__dirname, "../public/case2"),
          defaultIndex: "index.html",
        }
      ],
      publicDir: path.join(__dirname, "../public/multi"),
    },
    pluginWebweaver: {
      defaultRedirectUrl: "/multi"
    }
  }
};
