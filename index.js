const express = require("express");
const exphbs = require("express-handlebars");

const server = express();
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`app running on port ${port}`);
});
