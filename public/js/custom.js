$(document).ready(function() {
  $("#thumbnailupload").change(function(event) {
    $("#home-preview").css({ display: "block" });
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#thumbnail").attr("src", tmppath);
  });
  $("#videoupload").change(function(event) {
    $("#video-preview").css({ display: "block" });
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#video-src").attr("src", tmppath);
    $("#video-src")
      .parent()[0]
      .load();
  });
  $("#title").keyup(function(event) {
    if (event.target.value === "") {
      $("#preview-title").text("Title");
    } else {
      $("#preview-title").text(event.target.value);
    }
  });
});
