
require("../config.js");

window.setupRenderer = function() {
  require("./graphic");
};
window.setupSimpleGraphic = function() {
  require("./simple");
};

window.setupControl = function() {
  require("./control");
};

window.setupLT = function() {
  require("./lt");
};
