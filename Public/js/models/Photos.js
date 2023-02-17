const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photosSchema = new Schema({
  images: [
    {
      url: String,
      filename: String,
    },
  ],
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
