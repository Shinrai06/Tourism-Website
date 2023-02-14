const express = require("express");
const router = express.Router();
const Admin = require("../Public/js/models/Admin");
const Plans = require("../Public/js/models/Plans");
const Attractions = require("../Public/js/models/Attractions");
const Vehicles = require("../Public/js/models/Vehicles");

router
  .route("/register")
  .get((req, res) => {
    res.render("components/admin/register");
  })
  .post(async (req, res, next) => {
    const { name, email, password, contact1, contact2 } = req.body;
    const newAdmin = new Admin(name, email, contact1, contact2, password);
    let id = await newAdmin.save();
    res.redirect(`/admin/${id}`);
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("components/login");
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    let id = await Admin.validate(email, password);
    if (id != 0) res.redirect(`/admin/${id}`);
    else res.send("Invalid Credentials");
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
    const { title, type, loc, cost, Photo, days } = req.body;
    const { id } = req.params;
    const plan = new Plans(title, type, loc, cost, Photo, days, id);
    await plan.save();
    res.redirect(`/admin/${id}`);
  });

router
  .route("/:id/:P_id")
  .get(async (req, res, next) => {
    const { id, P_id } = req.params;
    const [data, dummy] = await Attractions.getById(P_id);
    const [vehicles, dummy2] = await Vehicles.getById(P_id);
    res.render("components/admin/attractions", { id, P_id, data, vehicles });
  })
  .post(async (req, res) => {
    const { P_id, id } = req.params;
    const vehicle = new Vehicles(req.body.vehicle, P_id);
    await vehicle.save();
    res.redirect(`${P_id}`);
  })
  .delete(async (req, res) => {
    const { P_id, id } = req.params;
    const [success, _] = await Plans.removeById(P_id);
    res.redirect(`/admin/${id}`);
  });

router
  .route("/:id/:P_id/new")
  .get((req, res) => {
    const { id, P_id } = req.params;
    res.render("components/admin/addSight", { id, P_id });
  })
  .post(async (req, res, next) => {
    const { name, description, cost, hotel, M_location } = req.body;
    const { id, P_id } = req.params;
    const site = new Attractions(
      name,
      description,
      M_location,
      cost,
      hotel,
      P_id
    );
    await site.save();
    res.redirect(`/admin/${id}/${P_id}`);
  });

router.route("/:id/:P_id/:T_id").delete(async (req, res, next) => {
  const { P_id, id, T_id } = req.params;
  const [success, _] = await Attractions.removeById(T_id);
  res.redirect(`/admin/${id}/${P_id}`);
});

module.exports = router;
