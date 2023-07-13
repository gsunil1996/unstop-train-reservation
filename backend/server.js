const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/database');
const cors = require('cors');
const seatRoutes = require('./routes/seatRoutes');

dotenv.config();


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(cors({
  // origin: 'http://localhost:3000',
  origin: 'https://unstop-train-reservation.vercel.app',
  credentials: true
}));

app.options('*', cors());

// Routes
app.use('/', seatRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT: ${process.env.PORT}`);
});