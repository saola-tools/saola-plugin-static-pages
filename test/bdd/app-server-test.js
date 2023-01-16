"use strict";

const app = require("../app/simplest");

describe("app-static-pages", function() {
  describe("start/stop app.server", function() {
    it("app.server should be started/stopped properly", function() {
      return app.server.start().then(function() {
        return app.server.stop();
      });
    });
  });
});
