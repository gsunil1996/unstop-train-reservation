// seatController.js
const Seat = require('../models/seatModel');

const seatController = {
  // create number of seats
  createSeats: async (req, res) => {
    const { numOfSeats } = req.body;

    try {
      // Delete all previous seat data
      await Seat.deleteMany();

      // Create new seat data
      const seats = [];
      for (let i = 1; i <= numOfSeats; i++) {
        seats.push({
          isBooked: false,
          seatNo: i,
        });
      }

      const createdSeats = await Seat.insertMany(seats);
      res.status(201).json(createdSeats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create seats' });
    }
  },

  // get all seats
  getSeats: async (req, res) => {
    try {
      const seats = await Seat.find();
      const totalSeats = seats.length;
      const numOfSeatsBooked = seats.filter(seat => seat.isBooked).length;
      const bookedSeatNumbers = seats
        .filter(seat => seat.isBooked)
        .map(seat => seat.seatNo);
      const numOfAvailableSeats = totalSeats - numOfSeatsBooked;

      res.json({
        totalSeats,
        numOfSeatsBooked,
        bookedSeatNumbers,
        numOfAvailableSeats,
        seats,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  },

  // reset all seats
  resetAllSeats: async (req, res) => {
    try {
      await Seat.updateMany({}, { $set: { isBooked: false } });
      res.json({ message: 'All seats reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset seats' });
    }
  },

  // reserve seats
  reserveSeats: async (req, res) => {
    const { numOfSeatsToReserve } = req.body;

    if (numOfSeatsToReserve < 1 || numOfSeatsToReserve > 7) {
      return res.status(400).json({ error: 'Invalid number of seats to reserve' });
    }

    try {
      const seatsToBook = await Seat.find({ isBooked: false }).sort('seatNo').limit(numOfSeatsToReserve);

      if (seatsToBook.length < numOfSeatsToReserve) {
        return res.status(400).json({ error: `Only ${seatsToBook.length} seat(s) available` });
      }

      for (const seat of seatsToBook) {
        seat.isBooked = true;
        await seat.save();
      }

      res.json({ message: 'Seats reserved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reserve seats' });
    }
  },
};

module.exports = seatController;