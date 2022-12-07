"use strict";

const path = require("path");

module.exports = {
  plugins: {
    appStaticPages: {
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
    appWebweaver: {
      defaultRedirectUrl: "/multi"
    }
  }
};
