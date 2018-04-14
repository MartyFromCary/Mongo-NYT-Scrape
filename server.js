const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraperdb";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
