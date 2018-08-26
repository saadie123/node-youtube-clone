const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/User");
const registerValidator = require("../validation/register");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.post("/register", async (req, res) => {
  try {
    let { errors, isValid } = registerValidator(req.body);
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser) {
      errors.email.push({ message: "Email is already in use" });
      isValid = false;
    }
    if (!isValid) {
      return res.render("register", { errors, form: req.body });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    await user.save();
    req.flash("success", "Registeration successful, You can login now");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: "Invalid email or password"
  })
);

// Social Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);
module.exports = router;
