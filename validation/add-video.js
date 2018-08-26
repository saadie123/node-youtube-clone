const validator = require("validator");
module.exports = body => {
  let errors = {
    video: [],
    thumbnail: [],
    title: [],
    description: []
  };
  let isValid = true;
  if (!body.video) {
    errors.video.push({ message: "Video is required" });
  }
  if (body.video) {
    let size = body.video.data.length / 1024 / 1024;
    if (size > 20) {
      errors.video.push({ message: "Video size cannot be more than 20MB" });
    }
  }
  if (!body.thumbnail) {
    errors.thumbnail.push({ message: "Thumbnail is required" });
  }
  if (body.thumbnail) {
    let size = body.thumbnail.data.length / 1024 / 1024;
    if (size > 5) {
      errors.thumbnail.push({
        message: "Thumbnail size cannot be more than 5MB"
      });
    }
  }
  if (validator.isEmpty(body.title)) {
    errors.title.push({ message: "Title is required" });
  }
  if (validator.isEmpty(body.description)) {
    errors.description.push({ message: "Description is required" });
  }
  for (let key in errors) {
    if (errors[key].length > 0) {
      isValid = false;
    }
  }
  return {
    errors,
    isValid
  };
};
