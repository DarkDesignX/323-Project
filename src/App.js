const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const { deleteCardMsg } = require("./Update.js");
const R = require('ramda');


function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg){
    if (msg.type === "ANSWER_SHOW") {
      const updatedModel = update(msg, model);
      model = updatedModel;
      const updatedView = view(dispatch, model);
      const patches = diff(currentView, updatedView);
      rootNode = patch(rootNode, patches);
      currentView = updatedView;
      dispatch(deleteCardMsg(updatedModel.nextId-1));
    } else {
      model = update(msg, model);
      const newModel = model.cards;
      const trueCardsSequence = R.sortBy(R.prop('rank'), newModel);
      model.cards = trueCardsSequence;
      const updatedView = view(dispatch, model);
      const patches = diff(currentView, updatedView);
      rootNode = patch(rootNode, patches);
      currentView = updatedView;
    }
  }
}

module.exports = {app};