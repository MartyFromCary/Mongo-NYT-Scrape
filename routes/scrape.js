const cheerio = require("cheerio");
const rp = require("request-promise");
const Article = require("../models/article");

module.exports = app => {
  app.get("/scrape", (req, res) => {
    //configuring options object for request-promist
    const options = {
      uri: "https://www.nytimes.com/section/us",
      transform: function(body) {
        return cheerio.load(body);
      }
    };
    //calling the database to return all saved articles
    Article.find({})
      .then(savedArticles => {
        //creating an array of saved article headlines
        let savedHeadlines = savedArticles.map(article => article.headline);

        //calling request promist with options object
        rp(options)
          .then(function($) {
            let newArticleArr = [];
            //iterating over returned articles, and creating a newArticle object from the data
            $("#latest-panel article.story.theme-summary").each(
              (i, element) => {
                let newArticle = new Article({
                  storyUrl: $(element)
                    .find(".story-body>.story-link")
                    .attr("href"),
                  headline: $(element)
                    .find("h2.headline")
                    .text()
                    .trim(),
                  summary: $(element)
                    .find("p.summary")
                    .text()
                    .trim(),
                  imgUrl: $(element)
                    .find("img")
                    .attr("src"),
                  byLine: $(element)
                    .find("p.byline")
                    .text()
                    .trim()
                });
                //checking to make sure newArticle contains a storyUrl
                if (newArticle.storyUrl) {
                  //checking if new article matches any saved article, if not add it to array
                  //of new articles
                  if (!savedHeadlines.includes(newArticle.headline)) {
                    newArticleArr.push(newArticle);
                  }
                }
              }
            ); //end of each function

            //adding all new articles to database
            Article.create(newArticleArr)
              .then(result => res.json({ count: newArticleArr.length })) //returning count of new articles to front end
              .catch(err => {});
          })
          .catch(err => console.log(err)); //end of rp method
      })
      .catch(err => console.log(err));
  }); 
};
