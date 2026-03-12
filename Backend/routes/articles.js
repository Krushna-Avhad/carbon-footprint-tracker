const express = require('express');
const router = express.Router();
const { createArticle, getArticles, deleteArticle } = require('../controller/articleController');

// Admin
router.post('/', createArticle);
router.delete('/:id', deleteArticle);

// Knowledge Hub
router.get('/', getArticles);

module.exports = router;