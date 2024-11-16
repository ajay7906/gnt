const express = require('express');
const router = express.Router();
//const postController = require('../controllers/post.controller');
const upload = require('../middleware/upload');
const { createBlogPost, getBlogPosts } = require('../controllers/postController');

router.post('/createblog',  createBlogPost);
router.get('/getblog', getBlogPosts)
// router.get('/', postController.getAllPosts);
// router.get('/:id', postController.getPostById);
// router.put('/:id', upload.single('image'), postController.updatePost);
// router.delete('/:id', postController.deletePost);

module.exports = router;
