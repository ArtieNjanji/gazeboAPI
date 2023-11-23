const router = require('express').Router();

const {
  getAllUsers,
  getUser,
  signup,
  signin,
} = require('../controllers/usersController');

router.get('/get-users', getAllUsers);
router.get('/get-user/:id', getUser);
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
