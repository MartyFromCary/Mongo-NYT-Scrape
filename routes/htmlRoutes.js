const Article = require("../models/article");

module.exports = app => {
  app.get("/", (req, res) =>
    Article.find({ saved: false })
      .then(articles => res.render("index", { articles }))
      .catch(err => res.json(err))
  );
  
  app.get("/viewSaved", (req, res) =>
    Article.find({ saved: true })
      .then(articles => res.render("saved", { articles }))
      .catch(err => res.json(err))
  );
};
