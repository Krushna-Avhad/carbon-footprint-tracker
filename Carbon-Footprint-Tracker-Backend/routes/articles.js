const express = require('express');
const router  = express.Router();
const { createArticle, getArticles, getArticleById, deleteArticle } = require('../controller/articleController');
const auth = require('../middleware/authMiddleware');

router.get('/',        getArticles);
router.get('/:id',     getArticleById);
router.post('/',       auth, createArticle);
router.delete('/:id',  auth, deleteArticle);

module.exports = router;
