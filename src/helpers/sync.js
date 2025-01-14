"use strict";

const mongoose = require("mongoose");
const Token = require("../models/token");
const User = require("../models/user");
const Topping = require("../models/topping");
const Pizza = require("../models/pizza");
const Order = require("../models/order");

// sync():

module.exports = async function () {
  
  /* CLEAR DATABASE */

  // await mongoose.connection.dropDatabase();
  await User.deleteMany();
  await Topping.deleteMany();
  await Pizza.deleteMany();
  await Token.deleteMany();
  await Order.deleteMany();
  console.log("- Database and all data DELETED!");
  /* CLEAR DATABASE */
  try {
    const users = require("./user.json");

    await User.insertMany(users);
    console.log("users added");
  } catch (error) {
    console.log("user couldn't be added");
    console.log(error);
  }
  try {
    const toppings = require("./topping.json");

    await Topping.insertMany(toppings);
    console.log("toppings added");
  } catch (error) {
    console.log("toppings couldn't be added");
    console.log(error);
  }
  try {
    const pizzas = require("./pizza.json");

    await Pizza.insertMany(pizzas);
    console.log("pizzas added");
  } catch (error) {
    console.log("pizzas couldn't be added");
    console.log(error);
  }
};
