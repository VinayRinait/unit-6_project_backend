const express = require("express");
const LaptopRouter = express.Router();

const { Laptopmodel } = require("../models/Laptop.model");
const { converter } = require("../middlewares/Imageconverter");

LaptopRouter.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.brand) query.brand = req.query.brand;
    if (req.query.model) query.model = req.query.model;
    if (req.query.city) query.city = req.query.city;
    if (req.query.id) query._id = req.query.id; // Use _id instead of id

    // Pagination

    const laptop = await Laptopmodel.find(query).sort(
      req.query.sort === "asc"
        ? { price: 1 }
        : req.query.sort === "desc"
        ? { price: -1 }
        : query
    );

    res.send(laptop);
  } catch (error) {
    res.send(error);
  }
});

LaptopRouter.post("/post", converter, async (req, res) => {
  const paylode = req.body;
  try {
    const new_bike = new Laptopmodel(paylode);
    await new_bike.save();
    res.status(200).json({ msg: "uploaded Laptop Data" });
  } catch (error) {
    res.send(error);
  }
});
LaptopRouter.put("/update/:id", converter, async (req, res) => {
  const paylode = req.body;
  const update = req.params.id;
  const bike = await Laptopmodel.findOne({ _id: update });
  const userId_in_data = bike.userID;
  const userId_in_req = req.body.userID;
  try {
    if (userId_in_req !== userId_in_data) {
      res.send({ msg: "Your not Authorized" });
    } else {
      const v = await Laptopmodel.findByIdAndUpdate({ _id: update }, paylode);
      res.send(`updated the data of laptop id ${v}`);
    }
  } catch (error) {
    res.send(error);
  }
});

LaptopRouter.delete("/delete/:id", async (req, res) => {
  const update = req.params.id;
  const bike = await Laptopmodel.findOne({ _id: update });
  const userId_in_data = bike.userID;
  const userId_in_req = req.body.userID;
  try {
    if (userId_in_req !== userId_in_data) {
      res.send({ msg: "Your not Authorized" });
    } else {
      const v = await Laptopmodel.findByIdAndDelete({ _id: update });
      res.send(`deleted the data of laptop id ${v}`);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = {
  LaptopRouter,
};
