const { initModel } = require("./Model.js");
const { update } = require("./Update.js");
const { view } = require("./View.js");
const { app } = require("./App.js");

const node = document.getElementById('app');

app(initModel, update, view, node);