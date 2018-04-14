const Article = require("../models/article");
const Note = require("../models/note");

module.exports = app => {
  app.get("/notsaved", (req, res) => {
    Article.find({ saved: false })
      .then(articles => res.json(articles))
      .catch(err => res.json(err));
  });

  app.get("/saved", (req, res) => {
    Article.find({ saved: true })
      .then(articles => res.json(articles))
      .catch(err => res.json(err));
  });

  app.post("/saveArticle", (req, res) =>
    Article.update({ _id: req.body._id }, { saved: true })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  );

  app.delete("/deleteArticle", (req, res) =>
    Article.remove({ _id: req.body._id })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  );

  app.get("/notes/:id", (req, res) =>
    Article.findOne({ _id: req.params.id })
      .populate("notes")
      .then(results => res.json(results))
      .catch(err => res.json(err))
  );

  app.get("/note/:id", (req, res) =>
    Note.findOne({ _id: req.params.id })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  );

  app.post("/createNote", (req, res) =>
    Note.create({
      title: req.body.title,
      body: req.body.body
    })
      .then(result => {
        Article.findOneAndUpdate(
          { _id: req.body._id },
          {
            $push: { notes: result._id },
            new: true
          }
        )
          .then(data => res.json(result))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err))
  );

  app.delete("/deleteNote", (req, res) =>
    Note.remove({ _id: req.body._id })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  );
};
