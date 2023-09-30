const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../middleware/imageUpload');

router.get('/', verifyToken, postController.getAllPosts);

router.get('/:id', verifyToken, postController.getPostById);

router.post('/', verifyToken, postController.createPost);

router.patch('/', verifyToken, postController.updatePost);

router.delete('/:id', verifyToken, postController.deletePost);

router.post('/upload/:id', verifyToken, upload.single('file'), postController.uploadImage);

module.exports = router;
