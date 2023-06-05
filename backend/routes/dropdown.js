const express = require('express')
const {
  getDropdown,
} = require('../controllers/dropdownController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all dropdown
router.get('/', getDropdown)

module.exports = router