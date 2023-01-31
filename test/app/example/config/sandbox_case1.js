"use strict";

const path = require("path");

module.exports = {
  plugins: {
    pluginStaticPages: {
      contextPath: "/homepage",
      publicDir: path.join(__dirname, "../public/case1"),
    },
    pluginWebweaver: {
      defaultRedirectUrl: "/homepage/index.html"
    }
  }
};
