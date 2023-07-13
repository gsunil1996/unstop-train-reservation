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
      const seats = await Seat.find().sort("seatNo");
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
      return res
        .status(400)
        .json({ error: "Invalid number of seats to reserve" });
    }

    let allSeats = await Seat.find({}, { isBooked: true, _id: false });
    let seatsfu = allSeats.map((item) => (item.isBooked == true ? 1 : 0));
    const totalSeats = await Seat.find().sort("seatNo");
    let totalLen = Math.floor(Number(totalSeats.length) / 7);
    let remainLen = Number(totalSeats.length) % 7;
    let obj = {};
    for (let i = 0; i < 11; i++) {
      obj[i] = seatsfu.slice(7 * i + 0, 7 * i + 7);
    }
    obj[totalLen] = seatsfu.slice(
      7 * totalLen,
      7 * totalLen + Number(remainLen)
    );

    try {
      const seatsToBook = await Seat.find({ isBooked: false })
        .sort("seatNo")
        .limit(numOfSeatsToReserve);

      let alreadybooedSeats = await Seat.find({ isBooked: true }).sort(
        "seatNo"
      );
      if (seatsToBook.length < numOfSeatsToReserve) {
        return res
          .status(400)
          .json({ error: `Only ${seatsToBook.length} seat(s) available` });
      }

      if (alreadybooedSeats.length == 0) {
        for (const seat of seatsToBook) {
          seat.isBooked = true;
          await seat.save();
        }
        res.json({ message: "Seats reserved successfully" });
      } else {
        let bookseats = numOfSeatsToReserve;

        for (let row in obj) {
          let item = obj[row];

          let available = item.filter((r) => r == 0);
          console.log(row, totalLen, "checking", bookseats, available.length);
          if (row == totalLen) {
            if (Number(bookseats) > Number(available.length)) {
              throw new Error("limit exceeded");
              break;
            }
          }
          if (Number(bookseats) <= Number(available.length)) {
            let rowbooked = item.filter((r) => r == 1);

            for (let j = 0; j < Number(bookseats); j++) {
              let ot1 = Number(row) * 7 + 1 + j + Number(rowbooked.length) - 1;
              totalSeats[ot1].isBooked = true;
              await totalSeats[ot1].save();
            }
            res.json({ message: "Seats reserved successfully" });
            break;
          }
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to reserve seats" });
    }
  },

};

module.exports = seatController;