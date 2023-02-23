const Photos = require("../models/Photos");

exports.getDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};

exports.setAttractionsForRender = async (temp) => {
  let ref = [];
  for (let sight of temp) {
    let images = await Photos.find({ T_id: sight.T_id }, { images: 1, _id: 0 });
    let x = {
      T_id: sight.T_id,
      name: sight.name,
      description: sight.description,
      hotel: sight.hotel,
      M_location: sight.M_location,
      Plan_id: sight.Plan_id,
      images: images.length == 0 ? [] : images[0].images,
    };
    ref.push(x);
  }
  return ref;
};

exports.getFileName = async (T_id) => {
  let { images } = await Photos.findOne({ T_id: T_id }, { images: 1, _id: 0 });
  let fileNames = images.map((img) => img.filename);
  return fileNames;
};
