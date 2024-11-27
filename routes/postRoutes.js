const express = require('express');
const router = express.Router();
//const postController = require('../controllers/post.controller');
const upload = require('../middleware/upload');
const { createBlogPost, getBlogPosts, deleteBlogPost, updateBlogPost, getBlogPostById } = require('../controllers/postController');

router.post('/createblog',  createBlogPost);
router.get('/getblog', getBlogPosts);
router.get('/getblogbyId/:id', getBlogPostById);
router.delete('/deleteblog/:id', deleteBlogPost)
router.delete('/updateblog/:id', updateBlogPost)
//router.get('/deleteblog/:id', deleteBlogPost)
// router.get('/', postController.getAllPosts);   deleteblog
// router.get('/:id', postController.getPostById);
// router.put('/:id', upload.single('image'), postController.updatePost);
// router.delete('/:id', postController.deletePost);

module.exports = router;
