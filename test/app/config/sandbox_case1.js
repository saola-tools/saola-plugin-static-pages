"use strict";

module.exports = {
  plugins: {
    appStaticPages: {
      contextPath: "/homepage",
    },
    appWebweaver: {
      defaultRedirectUrl: "/homepage/index.html"
    }
  }
};
