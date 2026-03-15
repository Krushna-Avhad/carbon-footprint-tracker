const Article = require('../models/ArticleM');

const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createArticle, getArticles, getArticleById, deleteArticle };
