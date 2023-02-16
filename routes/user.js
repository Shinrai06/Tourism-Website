const express = require("express");
const router = express.Router();
const Customer = require("../Public/js/models/Customer");
const Plans = require("../Public/js/models/Plans");
const Billings = require("../Public/js/models/Billings");
const Attractions = require("../Public/js/models/Attractions");
const Vehicles = require("../Public/js/models/Vehicles");
const Reviews = require("../Public/js/models/Reviews");

function removeItemOnce(arr, value) {
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]._id.toString() == value) index = i;
  }
  arr.splice(index, 1);
  return arr;
}

router
  .route("/login")
  .get((req, res) => {
    let ref = "user";
    res.render("components/login", { ref });
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    let id = await Customer.validate(email, password);
    if (id != 0) res.redirect(`/user/${id}`);
    else res.render("SQLerror", { err: "Invalid Credentials" });
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("components/user/register");
  })
  .post(async (req, res) => {
    const { name, email, password, contact, address } = req.body;
    const newUser = new Customer(name, email, contact, address, password);
    const id = await newUser.save();
    if (id[0] == 0) res.render("SQLerror", { err: id[1] });
    else res.redirect(`/user/${id[0]}`);
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    const { id } = req.params;
    const [data, _] = await Plans.findAllWithAdminName();
    res.render("components/user/plans", { data, id });
  })
  .post(async (req, res) => {
    const { id } = req.params;
    const { peopleSelected } = req.body;
    const [data, _] = await Plans.getByNoOfPeople(peopleSelected);
    res.render("components/user/plans", { id, data });
  });

router
  .route("/:id/:P_id")
  .get(async (req, res, next) => {
    const { id, P_id } = req.params;
    const [data, setData] = await Attractions.getById(P_id);
    const [vehicles, setvehicles] = await Vehicles.getById(P_id);
    const reviews = await Reviews.find({ P_id: P_id });
    res.render("components/user/attractions", {
      id,
      P_id,
      data,
      vehicles,
      reviews,
    });
  })
  .post(async (req, res, next) => {
    const { id, P_id } = req.params;
    const { rating, comment } = req.body;
    const data = await Reviews.findOne({ U_id: id, P_id: P_id }).exec();
    if (data == null) {
      const newReview = new Reviews({
        U_id: id,
        P_id: P_id,
        reviews: [{ comments: comment, rating }],
      });
      try {
        await newReview.save();
      } catch (err) {
        res.render("SQLerror", { err: id[1] });
      }
    } else {
      data.reviews.push({ comments: comment, rating });
      await new Reviews(data).save();
    }
    res.redirect(`/user/${id}/${P_id}`);
  });

router
  .route("/:id/:P_id/bill")
  .get(async (req, res) => {
    const { id, P_id } = req.params;
    let [cost, setCost] = await Plans.getCostById(P_id);
    const [peopleSelected, setPeopleSelected] = await Plans.getAvailSlotsById(
      P_id
    );
    const totAmount = cost[0].expense * peopleSelected[0].availSlots;
    res.render("components/user/bill", {
      id,
      P_id,
      peopleSelected: peopleSelected[0].availSlots,
      cost: cost[0].expense,
      totAmount: +totAmount.toFixed(2),
    });
  })
  .post(async (req, res) => {
    const { id, P_id } = req.params;
    const { cost, peopleSelected, type, ref_no } = req.body;
    const [userDetails, setUserDeatails] = await Customer.getNameAndEmailById(
      id
    );
    const [planDeatils, setPlanDetails] = await Plans.findPlanWithAdminDetails(
      P_id
    );
    const billDetails = {
      totAmount: cost,
      peopleSelected,
      type,
      ref_no,
      userDetails: userDetails[0],
      planDetails: planDeatils[0],
    };
    res.render("components/user/previewBill", { id, P_id, billDetails });
  });

router.post("/:id/:P_id/bill/finish", async (req, res, next) => {
  const { peopleSelected, ref_no, type, coupon, cost } = req.body;
  const { id, P_id } = req.params;
  const newBill = new Billings(
    id,
    P_id,
    ref_no,
    type,
    coupon,
    cost,
    peopleSelected
  );
  try {
    await newBill.save();
    let x = await Plans.updateSlots(P_id, peopleSelected);
    if (!x) {
      res.render("SQLerror", { err });
      next();
    }
    res.redirect(`/user/${id}`);
  } catch (err) {
    res.render("SQLerror", { err });
  }
});

router.route("/:id/:P_id/:R_id").delete(async (req, res) => {
  const { id, P_id, R_id } = req.params;
  try {
    const data = await Reviews.findOne({ U_id: id, P_id }).exec();
    data.reviews = removeItemOnce(data.reviews, R_id);
    await new Reviews(data).save();
    res.redirect(`/user/${id}/${P_id}`);
  } catch (err) {
    res.render("SQLerror", { err });
  }
});

module.exports = router;
