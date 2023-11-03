const core = require("@actions/core");
const core = require("@actions/github");
const core = require("@actions/exec");

function run() {
  core.notice("Hello from my custom Javascript Action!");
}

run();
