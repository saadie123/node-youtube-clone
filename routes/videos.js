const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const ObjectId = require("mongoose").Types.ObjectId;
const addVideoValidator = require("../validation/add-video");
const Video = require("../models/Video");

router.get("/my-videos", async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).populate("user");
    res.render("my-videos", { videos });
  } catch (error) {
    console.log(error);
  }
});

router.get("/my-videos/new", (req, res) => {
  res.render("new-video");
});

router.post("/my-videos/new", async (req, res) => {
  const uploadDir = path.resolve(__dirname, "..", "uploads");
  const videosDir = path.resolve(uploadDir, "videos");
  const thumbnailsDir = path.resolve(uploadDir, "thumbnails");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
  }
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
  }
  let { errors, isValid } = addVideoValidator({ ...req.files, ...req.body });
  if (!isValid) {
    return res.render("new-video", { errors, form: req.body });
  }
  const videoFile = req.files.video;
  const thumbnailFile = req.files.thumbnail;
  const videoName = Date.now() + "-" + videoFile.name;
  const thumbnailName = Date.now() + "-" + thumbnailFile.name;
  try {
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      file: {
        fileName: videoName,
        filePath: videosDir + "/" + videoName
      },
      thumbnail: {
        thumbnailName: thumbnailName,
        thumbnailPath: thumbnailsDir + "/" + thumbnailName
      },
      user: req.user.id
    });
    const savedVideo = await video.save();
    savedVideo.file.fileUrl = `/videos/video/${savedVideo._id}`;
    savedVideo.thumbnail.thumbnailUrl = `/videos/thumbnail/${savedVideo._id}`;
    await savedVideo.save();
    req.user.videos.push(savedVideo._id);
    await req.user.save();
    videoFile.mv(`${videosDir}/${videoName}`, error => {
      if (error) {
        console.log(error);
      }
    });
    thumbnailFile.mv(`${thumbnailsDir}/${thumbnailName}`, error => {
      if (error) {
        console.log(error);
      }
    });
    res.redirect("/my-videos");
  } catch (error) {
    console.log(error);
  }
});

router.get("/watch/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Id");
    }
    const videos = await Video.find(
      { _id: { $ne: id } },
      {},
      { count: 10 }
    ).populate("user");
    const video = await Video.findById(id);
    res.render("watch-video", { video, videos, containerFluid: true });
  } catch (error) {
    console.log(error);
  }
});

router.get("/videos/thumbnail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Id");
    }
    const video = await Video.findById(id);
    res.sendFile(video.thumbnail.thumbnailPath);
  } catch (error) {
    console.log(error);
  }
});

router.get("/videos/video/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Id");
    }
    const video = await Video.findById(id);
    const file = video.file.filePath;
    const stats = fs.statSync(file);
    const range = req.headers.range;
    if (!range) {
      return res.sendFile(file);
    }
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = end - start + 1;
    var maxChunk = 1024 * 1024; // 1MB at a time
    if (chunksize > maxChunk) {
      end = start + maxChunk - 1;
      chunksize = end - start + 1;
    }
    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });
    var stream = fs.createReadStream(file, { start: start, end: end });
    stream.on("open", function() {
      stream.pipe(res);
    });
    stream.on("error", function(err) {
      res.end(err);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
