const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_300");
});

const photosSchema = new Schema({
  images: [imageSchema],
  A_id: {
    type: Number,
    required: true,
  },
  T_id: {
    type: Number,
    required: true,
  },
});

const Photos = mongoose.model("Photos", photosSchema);

module.exports = Photos;
