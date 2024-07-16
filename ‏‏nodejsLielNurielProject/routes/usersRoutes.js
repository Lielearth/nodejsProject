const router = require('express').Router();
const { getAllUsers, getUserById, createNewUser, deleteUser, updateUser, } = require('../controllers/usersControllers');
const { mustLogin, allowedRoles, changeStatus } = require('../controllers/authControllers');

  //  base path = "/api/users"
  
  router.get('/', mustLogin, allowedRoles(['admin']), getAllUsers)
  router.get('/:id', mustLogin, allowedRoles(['admin']) , getUserById)
  router.post('/', createNewUser)
  router.delete('/:id',mustLogin,allowedRoles(['admin']), deleteUser)
  router.put('/:id',mustLogin, updateUser)
  router.patch('/:id',mustLogin ,changeStatus)
module.exports = router;