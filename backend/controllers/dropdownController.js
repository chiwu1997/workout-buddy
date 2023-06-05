const Dropdown = require('../models/dropdownModel')
const mongoose = require('mongoose')

// get all workouts
const getDropdown = async (req, res) => {
  const user_id = req.user._id

  const dropdown = await Dropdown.find({user_id}).sort({createdAt: -1})

  res.status(200).json(dropdown)
}

module.exports = {
  getDropdown
}