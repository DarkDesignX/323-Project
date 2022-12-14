const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
const R = require('ramda');
const { showFormMsg, questionInputMsg, answerInputMsg, saveCardMsg, deleteCardMsg, answerShow } = require("./Update.js");

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

const { div, button, form, label, input, table, tbody, tr, td, textarea } = hh(h);

function diva(tag, className, value) {
  return tag({ className }, value);
}

function cardRow(dispatch, className, card) {
  if (card.toogle == 0) {
    return tr({ className }, [
      div({className: "bg-zinc-200"}, [
      diva(div, "p-5 underline", "Question"),
      diva(div, "p-5", card.question),
      div({className:"p-5 cursor-pointer underline", onclick: () => dispatch(answerShow(card.id))}, "Show Answer"),
      diva(div, "p-5", ""),
      ]),
      diva(td, "text-center", [button({
            className: `${btnStyle} bg-zinc-500 hover:bg-zinc-700`,
            onclick: () => dispatch(deleteСardMsg(card.id)),
          },
          "Delete"
        ),
      ]),
    ]);
  } else if (card.toogle == 1) {
    return tr({ className }, [
      div({className: "bg-zinc-200"}, [
      diva(div, "p-5 underline", "Question"),
      div({className:"p-5", onclick: () => dispatch(answerShow(card.id, card.statusAnswer, 2)) }, card.question),
      div({className:"p-5 underline"}, "Answer"),
      div({className:"p-5", onclick: () => dispatch(answerShow(card.id, card.statusAnswer, 2)) }, card.answers),
      diva(div, "p-5", "Answer status: " + card.statusAnswer),
      div({className:"p-5"},[ 
        button({
          className: `${btnStyle} bg-green-500 hover:bg-green-700`,
          onclick: () => dispatch(answerShow(card.id,"Great 2"))
        }, "Great"),
        button({
          className: `${btnStyle} bg-yellow-500 hover:bg-yellow-700`,
          onclick: () => dispatch(answerShow(card.id,"Good 1"))
        }, "Good"),
        button({
          className: `${btnStyle} bg-red-500 hover:bg-red-700`,
          onclick: () => dispatch(answerShow(card.id,"Bad 0"))
        }, "Bad"),
      ]),
      ]),
      diva(td, "text-center", [button({
            className: `${btnStyle} bg-zinc-500 hover:bg-zinc-700`,
            onclick: () => dispatch(deleteCardMsg(card.id)),
          },
          "Delete"
        ),
      ]),
    ]);
  } 
  return tr({ className }, [
    div({className: "bg-zinc-200"}, [
    diva(div, "p-5 underline", "Question"),//(e) => dispatch(questionInputMsg(e.target.value))
    textarea({className:"p-5", onchange: (e) => dispatch(answerShow(card.id, card.statusAnswer, 1, e.target.value))}, card.question),
    div({className:"p-5 underline"}, "Answer"),
    textarea({className:"p-5", onchange: (e) => dispatch(answerShow(card.id, card.statusAnswer, 1, "", e.target.value))}, card.answers),
    diva(div, "p-5", "Answer status: " + card.statusAnswer),
    div({className:"p-5"},[ 
      button({
        className: `${btnStyle} bg-green-500 hover:bg-green-700`,
        onclick: () => dispatch(answerShow(card.id,"Great 2"))
      }, "Great"),
      button({
        className: `${btnStyle} bg-yellow-500 hover:bg-yellow-700`,
        onclick: () => dispatch(answerShow(card.id,"Good 1"))
      }, "Good"),
      button({
        className: `${btnStyle} bg-red-500 hover:bg-red-700`,
        onclick: () => dispatch(answerShow(card.id,"Bad 0"))
      }, "Bad"),
    ]),
    ]),
    diva(td, "text-center", [button({
          className: `${btnStyle} bg-zinc-500 hover:bg-zinc-700`,
          onclick: () => dispatch(deleteCardMsg(card.id)),
        },
        "Delete"
      ),
    ]),
  ]);
}

function cardsBody(dispatch, className, cards) {
  const rows = R.map(R.partial(cardRow, [dispatch, "border-t-[20px] border-b-[20px]"]), cards);
  return tbody({ className }, rows);
}

function tableView(dispatch, cards) {
  if (cards.length === 0) {
    return div({ className: "p-5 text-center" }, "no cards...");
  }
  return table({ className: "mt-4" }, [cardsBody(dispatch, "", cards)]);
}

function fieldSet(labelText, inputValue, placeholder, oninput) {
  return div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({ className: "flex gap-4 justify-end" }, [
    button(
      {
        className: `${btnStyle} bg-green-500 hover:bg-green-700`,
        type: "submit",
      },
      "Save"
    ),
    button(
      {
        className: `${btnStyle} bg-red-500 hover:bg-red-700`,
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel"
    ),
  ]);
}

function formView(dispatch, model) {
  const { question, answers, showForm } = model;
  if (showForm) {
    return form(
      {
        className: "flex flex-col gap-4",
        onsubmit: (e) => {
          e.preventDefault();
          dispatch(saveCardMsg);
        },
      },
      [
        div({ className: "flex gap-4" }, [
          fieldSet("Question", question, "Enter your question", (e) => dispatch(questionInputMsg(e.target.value))),
          fieldSet("Answer", answers || "", "Enter the answer", (e) => dispatch(answerInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
      ]
    );
  }
  return button({
      className: `${btnStyle} text-center`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "Add Flashcard"
  );
}

function view(dispatch, model) {
  return div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.cards)]);
}

module.exports = {view, tableView};