const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const passportConfig = require("./config/passport");
const config = require("./config/config");

const authRoutes = require("./routes/auth");

mongoose.connect(
  config.mongodbUri,
  { useNewUrlParser: true },
  () => console.log("Connected to db")
);
const server = express();
server.use(express.static(path.resolve(__dirname, "public")));
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");
server.use(flash());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: config.secret
  })
);
server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
passportConfig(passport);
server.use(authRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`app running on port ${port}`);
});
