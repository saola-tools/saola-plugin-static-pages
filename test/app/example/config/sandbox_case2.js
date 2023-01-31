"use strict";

const path = require("path");

module.exports = {
  plugins: {
    pluginStaticPages: {
      publicDir: path.join(__dirname, "../public/case2"),
      defaultIndex: "info.html",
    },
    pluginWebweaver: {
    }
  }
};
