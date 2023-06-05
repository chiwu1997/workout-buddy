const Workout = require('../models/workoutModel')
const Dropdown = require('../models/dropdownModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id

  const workouts = await Workout.find({user_id}).sort({createdAt: -1})

  res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({error: 'No such workout'})
  }
  
  res.status(200).json(workout)
}

// get workouts by title
const getWorkoutsByTitle = async (req, res) => {
  const { title } = req.params

  const workout = await Workout.find({title}).sort({createdAt: -1})

  if (!workout) {
    return res.status(404).json({error: 'No such workout named as this title'})
  }
  
  res.status(200).json(workout)
}


// create new workout
const createWorkout = async (req, res) => {
  const {title, load, reps} = req.body

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }
  if(!load) {
    emptyFields.push('load')
  }
  if(!reps) {
    emptyFields.push('reps')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const workout = await Workout.create({title, load, reps, user_id})
    
    const titleSearch = await Dropdown.find({title: title})
    if (titleSearch.length === 0) {
      Dropdown.create({title, user_id})
    }
    
    res.status(200).json({workout, titleSearch})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findOneAndDelete({_id: id})

  if (!workout) {
    return res.status(400).json({error: 'No such workout'})
  }

  const titleSearch = await Workout.find({title: workout.title})
  if (titleSearch.length === 0) {
    const deletedDropdown = await Dropdown.findOneAndDelete({title: workout.title})
    if (!deletedDropdown) {
      console.log('No such title in dropdown')
    }
  }

  res.status(200).json({workout, titleSearch})
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params
  const user_id = req.user._id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const originalWorkout = await Workout.findOne({_id: id})

  const workout = await Workout.findOneAndUpdate({_id: id}, {
    ...req.body
  }, {
    returnOriginal: false
  })

  if (!workout) {
    return res.status(400).json({error: 'No such workout'})
  }

  const originalTitleSearch = await Workout.find({title: originalWorkout.title})
  if (originalTitleSearch.length === 0) {
    const deletedDropdown = await Dropdown.findOneAndDelete({title: originalWorkout.title})
    if (!deletedDropdown) {
      console.log('No such title in dropdown')
    }
  }

  const updatedTitleSearch = await Dropdown.find({title: workout.title})
  if (updatedTitleSearch.length === 0) {
    Dropdown.create({title: workout.title, user_id})
  }

  res.status(200).json({workout, originalTitleSearch, originalTitle: originalWorkout, updatedTitleSearch})
}


module.exports = {
  getWorkouts,
  getWorkout,
  getWorkoutsByTitle,
  createWorkout,
  deleteWorkout,
  updateWorkout
}