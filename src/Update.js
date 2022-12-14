const R = require('ramda');

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  QUESTION_INPUT: 'QUESTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
  SAVE_CARD: 'SAVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  ANSWER_SHOW: 'ANSWER_SHOW'
};

function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

function questionInputMsg(question) {
  return {
    type: MSGS.QUESTION_INPUT,
    question,
  };
}

function answerInputMsg(answers) {
  return {
    type: MSGS.ANSWER_INPUT,
    answers,
  };
}

const saveCardMsg = { type: MSGS.SAVE_CARD };

function deleteCardMsg(id) {
  return {
    type: MSGS.DELETE_CARD,
    id,
  };
}

function answerShow(id, answerShow = "", changeTextStatus = 1, changedQuestion = "", changedAnswer = "") {
  if (changedAnswer=== "") {
    return {
      type: MSGS.ANSWER_SHOW,
      id,
      answerShow,
      changeTextStatus,
      changedValue: changedQuestion,
      changeType: 1
    };
  } 
  return {
    type: MSGS.ANSWER_SHOW,
    id,
    answerShow,
    changeTextStatus,
    changedValue: changedAnswer,
    changeType: 2
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ANSWER_SHOW: {
      const id = msg.id ;

      const estimateData = msg.answerShow;
      const estimate = estimateData.split(' ');
      const estimateText = estimate[0];
      const estimateRank = estimate[1];

      const toogle = msg.changeTextStatus;
      const neuValue = msg.changedValue;
      const oneCard = R.filter(
        card => card.id == id
      , model.cards);
      if (neuValue === "") {
        const card = {id:oneCard[oneCard.length - 1].id + 1, question:oneCard[0].question, answers:oneCard[0].answers, toogle: toogle, statusAnswer: estimateText, rank: estimateRank};
        const cards = [...model.cards, card]
        return {...model, cards, nextId: card.id, question: '',
        answers: 0,
        showForm: false,
        toogle: toogle,
        statusAnswer: ""
        };
      } else if (msg.changeType == 1) {
        const card = {id:oneCard[oneCard.length - 1].id + 1, question:neuValue, answers:oneCard[0].answers, toogle: toogle, statusAnswer: estimateText, rank: estimateRank};
        const cards = [...model.cards, card]
        console.log(cards);
        return {...model, cards, nextId: card.id, question: '',
        answers: 0,
        showForm: false,
        toogle: toogle,
        statusAnswer: ""
        };
      }
      const card = {id:oneCard[oneCard.length - 1].id + 1, question:oneCard[0].question, answers:neuValue, toogle: toogle, statusAnswer: estimateText, rank: estimateRank};
      const cards = [...model.cards, card]
      console.log(cards);
      return {...model, cards, nextId: card.id, question: '',
      answers: 0,
      showForm: false,
      toogle: toogle,
      statusAnswer: ""
      };
    }
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return { ...model, showForm, question: '', answers: 0 };
    }
    case MSGS.QUESTION_INPUT: {
      const { question } = msg;
      return { ...model, question };
    }
    case MSGS.ANSWER_INPUT: {
      const answers = R.pipe( 
        R.defaultTo(0),
      )(msg.answers);
      return { ...model, answers };
    }
    case MSGS.SAVE_CARD: {
      const updatedModel = add(model);
      return updatedModel;
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter(
        card => card.id !== id
      , model.cards);
      return { ...model, cards };
    }
  }
  return model;
}

function add(model) {
  const { nextId, question, answers, toogle } = model;
  const card = { id: nextId + 1, question, answers, toogle:0};
  const cards = [...model.cards, card]
  return {
    ...model,
    cards,
    nextId: nextId + 1,
    question: '',
    answers: 0,
    showForm: false,
    toogle: 0,
    rank: 0
  };
}

module.exports = {update, MSGS, add, showFormMsg, questionInputMsg, answerInputMsg, saveCardMsg, deleteCardMsg, answerShow};