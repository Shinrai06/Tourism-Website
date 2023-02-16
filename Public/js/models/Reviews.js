const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviews: [
    {
      comments: {
        type: String,
        default: "No Comments",
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  U_id: {
    type: Number,
    required: true,
  },
  P_id: {
    type: Number,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
