const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/login', userController.loginUser);

router.post('/register', userController.registerUser);

router.get('/search/:key', verifyToken, userController.searchUser);

router.get('/getId', verifyToken, userController.getId);

router.get('/:id/posts', verifyToken, userController.getUserPosts);

module.exports = router;
