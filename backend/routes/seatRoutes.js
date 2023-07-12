// seatRoutes.js
const express = require('express');
const seatController = require('../controllers/seatController');

const router = express.Router();

router.post('/addSeats', seatController.createSeats);
router.get('/seats', seatController.getSeats);
router.post('/resetAllSeats', seatController.resetAllSeats);
router.post('/reserveSeats', seatController.reserveSeats);

module.exports = router;
