const router = require('express').Router();
const { getAllCards, getCardById, createNewCard, deleteCard, updateCard, getMyCards,likeAcard, changeBizNumber } = require('../controllers/cardsControllers');
const { mustLogin, allowedRoles } = require('../controllers/authControllers');
const { Router } = require('express');



  //  base path = "/api/cards"

  router.get('/', getAllCards)
  router.get('/mycards', mustLogin, getMyCards)
  router.patch('/biz/:id',allowedRoles(['admin']),changeBizNumber)
  router.get('/:id', getCardById)
  router.post('/' ,allowedRoles(['business']),createNewCard)
  router.delete('/:id',mustLogin,allowedRoles(['business']), deleteCard)
  router.put('/:id',mustLogin, updateCard)
  router.patch('/:id',mustLogin,likeAcard)


module.exports = router;