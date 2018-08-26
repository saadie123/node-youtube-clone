const router = require("express").Router();
const Video = require("../models/Video");

router.get("/", async (req, res) => {
  try {
    if (!req.query.search || req.query.search === "") {
      let videos = await Video.find().populate("user");
      return res.render("home", { videos });
    }
    const search = req.query.search;
    let videos = await Video.find({ title: new RegExp(search, "i") }).populate(
      "user"
    );
    res.render("home", { videos, search });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
