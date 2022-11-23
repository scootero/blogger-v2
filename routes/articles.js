const router = require("express").Router();

const Article = require("../models/article");
const User = require("../models/user");
// const { isLoggedIn2 } = require("../middlewear");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.render("users/login");
  }

  next();
};

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render("../views/articles/index", { articles: articles });
});

router.get("/articles", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render("../views/articles/index", { articles: articles });
});

router.get("/articles/new", isLoggedIn, (req, res) => {
  res.render("../views/articles/new");
});

router.post("/articles/new", isLoggedIn, async (req, res) => {
  const newArticle = Article(req.body);
  // console.log(typeof req.user);
  newArticle.author = req.user._id;

  try {
    const savedArticle = await newArticle.save();

    return res.render("../views/articles/show", { article: savedArticle });
  } catch (err) {
    console.log("failed here");
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.render("../views/articles/show", { article: article });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body);

    const savedArticle = await article.save();
    console.log(savedArticle);

    res.render("../views/articles/show", { article: savedArticle });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/articles/edit/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    res.render("../views/articles/edit", { article: article });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
