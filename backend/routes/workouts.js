const express = require('express')
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  getWorkoutsByTitle,
  deleteWorkout,
  updateWorkout
} = require('../controllers/workoutController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getWorkouts)

//GET a single workout
router.get('/:id', getWorkout)

//GET workouts by title
router.get('/title/:title', getWorkoutsByTitle)

// POST a new workout
router.post('/', createWorkout)

// DELETE a workout
router.delete('/:id', deleteWorkout)

// UPDATE a workout
router.patch('/:id', updateWorkout)


module.exports = router