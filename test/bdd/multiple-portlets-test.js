"use strict";

const axios = require("axios");
const { assert } = require("liberica");

const Devebot = require("devebot");
const Promise = Devebot.require("bluebird");
const chores = Devebot.require("chores");
const lodash = Devebot.require("lodash");

const path = require("path");
const freshy = require("freshy");

function requireFresh (moduleName, basePath) {
  const modulePath = path.join(basePath, moduleName);
  freshy.unload(modulePath);
  return require(modulePath);
}

describe("app-static-pages", function() {
  describe("multiple-portlets", function() {
    const example = requireFresh("../app/example", __dirname);
    //
    before(function() {
      chores.setEnvironments({
        DEVEBOT_SANDBOX: "multi",
        DEVEBOT_FORCING_SILENT: "devebot,webserver",
        LOGOLITE_FULL_LOG_MODE: "false",
        LOGOLITE_ALWAYS_ENABLED: "all",
        LOGOLITE_ALWAYS_MUTED: "all"
      });
    });
    //
    after(function() {
      chores.clearCache();
    });
    //
    it("Request and response smoothly", function() {
      const expected = [
        {
          status: 200,
          data: {
            "page": "static-pages/info1"
          }
        },
        {
          status: 200,
          data: {
            "page": "static-pages/info2"
          }
        },
      ];
      //
      return example.server.start().then(function() {
        return Promise.all([
          axios.request({
            url: "http://localhost:7979/multi/info1.json",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            data: undefined,
            responseType: "json",
          }),
          axios.request({
            url: "http://localhost:7979/multi/info2.json",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            data: undefined,
            responseType: "json",
          }),
        ]);
      })
      .then(function(resps) {
        const output = lodash.map(resps, function(resp) {
          return {
            status: resp.status,
            data: resp.data
          };
        });
        false && console.log(JSON.stringify(output, null, 2));
        assert.sameDeepMembers(output, expected);
      })
      .catch(function(err) {
        console.log(err);
        assert.fail("This testcase must complete successfully");
      })
      .finally(function() {
        return example.server.stop();
      });
    });
  });
});
