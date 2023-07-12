const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  isBooked: {
    type: Boolean,
    default: false,
  },
  seatNo: {
    type: Number,
    required: true,
  },
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
