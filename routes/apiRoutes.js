const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/article");
const Note = require("../models/note");

module.exports = app => {
  
  app.get("/scrape", (req, res) => {
    Article.find({}).then(articles => {
      const storyUrls = articles.map(article => article.storyUrl);

      request("https://www.nytimes.com/section/us", (error, response, html) => {
        const $ = cheerio.load(html);

        let count = 0;
        $("article.story").each((i, element) => {
          const storyUrl = $(element)
            .find(".story-body>.story-link")
            .attr("href");

          if (!storyUrl || storyUrls.includes(storyUrl)) {
            return;
          }
          
          Article.create({
            storyUrl,
            headline: $(element).find("h2.headline").text().trim(),
            summary:  $(element).find("p.summary").text().trim(),
            imgUrl:   $(element).find("img").attr("src"),
            byLine:   $(element).find("p.byline").text().trim()
          }).then(article => {
            /*count++;*/
          });
          count++;
        });
        res.json({ count });
      });
    });
  });

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
