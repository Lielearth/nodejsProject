const router = require('express').Router();
const { register, login } = require('../controllers/authControllers');

  //  base path = "/api/auth"
  
  router.post('/register', register)
  router.post('/login', login)

module.exports = router;