const express = require("express");
const router = express.Router();
const Admin = require("../Public/js/models/Admin");
const Plans = require("../Public/js/models/Plans");
const Attractions = require("../Public/js/models/Attractions");
const Vehicles = require("../Public/js/models/Vehicles");
const Billings = require("../Public/js/models/Billings");
const Reviews = require("../Public/js/models/Reviews");
const Photos = require("../Public/js/models/Photos");
const { storage } = require("../config/Cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const getDate = require("../Public/js/controllers/getDate");

router
  .route("/register")
  .get((req, res) => {
    res.render("components/admin/register");
  })
  .post(async (req, res, next) => {
    const { name, email, password, contact1, contact2 } = req.body;
    const newAdmin = new Admin(name, email, contact1, contact2, password);
    let id = await newAdmin.save();
    if (id[0] == 0) res.render("SQLerror", { err: id[1] });
    else res.redirect(`/admin/${id[0]}`);
  });

router
  .route("/login")
  .get((req, res) => {
    let ref = "admin";
    res.render("components/login", { ref });
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    let id = await Admin.validate(email, password);
    if (id != 0) res.redirect(`/admin/${id}`);
    else res.render("SQLerror", { err: "Invalid Credentials" });
  });

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const [data, _] = await Plans.getById(id);
  res.render("components/admin/plans", { id, data });
});

router
  .route("/:id/new")
  .get((req, res) => {
    let { id } = req.params;
    res.render("components/admin/addPlan", { id });
  })
  .post(async (req, res) => {
    const { title, loc, expense, photo, days, date, maxPeople } = req.body;
    const { id } = req.params;
    const plan = new Plans(
      id,
      title,
      loc,
      expense,
      photo,
      days,
      date,
      maxPeople
    );
    try {
      await plan.save();
      res.redirect(`/admin/${id}`);
    } catch (err) {
      res.render("SQLerror", { err });
    }
  });

router
  .route("/:id/:P_id")
  .get(async (req, res, next) => {
    const { id, P_id } = req.params;
    const [sights, setSights] = await Attractions.getById(P_id);
    const [vehicles, setvehicles] = await Vehicles.getById(P_id);
    const [users, setUsers] = await Billings.getUserInfoById(P_id);
    const reviews = await Reviews.find({ P_id: P_id });
    const data = await getDate.setAttractionsForRender(sights);
    res.render("components/admin/attractions", {
      id,
      P_id,
      data,
      vehicles,
      users,
      reviews,
    });
  })
  .post(async (req, res) => {
    const { P_id, id } = req.params;
    const { vehicle, query_contact, details } = req.body;
    const V = new Vehicles(vehicle, query_contact, details, P_id);
    try {
      await V.save();
      res.redirect(`${P_id}`);
    } catch (err) {
      res.render("SQLerror", { err });
    }
  })
  .delete(async (req, res) => {
    const { P_id, id } = req.params;
    try {
      await Plans.removeById(P_id);
      res.redirect(`/admin/${id}`);
    } catch (err) {
      res.render("SQLerror", { err });
    }
  });

router
  .route("/:id/:P_id/new")
  .get((req, res) => {
    const { id, P_id } = req.params;
    res.render("components/admin/addSight", { id, P_id });
  })
  .post(upload.array("images", 10), async (req, res, next) => {
    const { name, description, hotel, M_location } = req.body;
    const { id, P_id } = req.params;
    const site = new Attractions(name, description, M_location, hotel, P_id);
    const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    try {
      const T_id = await site.save();
      if (T_id == 0) {
        res.render("SQLerror", { err });
      }
      await new Photos({ A_id: id, T_id: T_id[0], images: images }).save();
      res.redirect(`/admin/${id}/${P_id}`);
    } catch (err) {
      res.render("SQLerror", { err });
    }
  });

router.delete("/:id/:P_id/vehicle/:V_id", async (req, res) => {
  let { id, V_id, P_id } = req.params;
  try {
    await Vehicles.removeById(V_id);
    res.redirect(`/admin/${id}/${P_id}`);
  } catch (err) {
    res.render("SQLerror", { err });
  }
});

router.delete("/:id/:P_id/:T_id", async (req, res, next) => {
  const { P_id, id, T_id } = req.params;
  const [success, _] = await Attractions.removeById(T_id);
  try {
    await Photos.deleteOne({ T_id: T_id });
  } catch (err) {
    res.render("SQLerror", { err });
  }
  res.redirect(`/admin/${id}/${P_id}`);
});

module.exports = router;
