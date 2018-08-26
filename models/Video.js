const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  file: {
    fileName: String,
    fileUrl: String,
    filePath: String
  },
  thumbnail: {
    thumbnailName: String,
    thumbnailUrl: String,
    thumbnailPath: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

module.exports = mongoose.model("videos", videoSchema);
