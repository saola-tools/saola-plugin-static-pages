"use strict";

const path = require("path");

module.exports = {
  plugins: {
    appStaticPages: {
      contextPath: "/homepage",
      publicDir: path.join(__dirname, "../public/case1"),
    },
    appWebweaver: {
      defaultRedirectUrl: "/homepage/index.html"
    }
  }
};
