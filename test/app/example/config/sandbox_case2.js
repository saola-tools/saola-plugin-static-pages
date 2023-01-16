"use strict";

const path = require("path");

module.exports = {
  plugins: {
    appStaticPages: {
      publicDir: path.join(__dirname, "../public/case2"),
      defaultIndex: "info.html",
    },
    appWebweaver: {
    }
  }
};
