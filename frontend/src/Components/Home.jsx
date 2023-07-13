import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { styles } from './HomeStyles';
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Card, CardContent, CircularProgress, Grid, LinearProgress } from "@mui/material";
import Lottie from "lottie-react";
import trainLogo from "../assets/animation_ljyqlqf2.json";

const Home = () => {
  const theme = useTheme();
  const classes = styles(theme);

  const [seatsLoading, setSeatsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataError, setDataError] = useState("");
  const [resetLoader, setResetLoader] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [reserveSeatsLoader, setReserveSeatsLoader] = useState(false);

  // const serverURL = "http://localhost:4000"
  const serverURL = "https://unstop-train-reservation.vercel.app"

  const fetchData = async () => {
    setSeatsLoading(true);
    setData([])
    try {
      const response = await axios.get(`${serverURL}/seats`);
      setData(response.data);
      setSeatsLoading(false);
    } catch (error) {
      setDataError(error.response.data.message)
      setSeatsLoading(false);
    }
  };

  const handleReset = async () => {
    setResetLoader(true);
    try {
      await axios.post(`${serverURL}/resetAllSeats`);
      toast.success("All seats reset successfully")
      fetchData();
      setResetLoader(false);
    } catch (error) {
      toast.error(error.response.data.message)
      setResetLoader(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReserveSeatsLoader(true);
    try {
      await axios.post(`${serverURL}/reserveSeats`, { numOfSeatsToReserve: selectedSeats });
      toast.success("seats reserved successfully")
      fetchData();
      setReserveSeatsLoader(false);
    } catch (error) {
      toast.error(error.response.data.message)
      setReserveSeatsLoader(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }} >
        <div>
          <Lottie animationData={trainLogo} loop={true} style={{ width: "100px" }} />
        </div>
        <div style={{ textAlign: "center" }} >
          <h1>Seat Reservation</h1>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} >
          {seatsLoading ? <div>
            <h1>Loading...</h1>
            <div><LinearProgress /></div>
          </div> : dataError ? <div><h1>{dataError}</h1></div> :
            <Box sx={classes.seatContainer}>
              {data?.seats?.map((item) => (
                <div key={item._id}>
                  <Card sx={classes.cardStyles}
                    style={{ background: item.isBooked ? "#990011FF" : "#2C5F2DFF", color: item.isBooked ? "#FCF6F5FF" : "#FFE77AFF" }} >
                    <CardContent sx={classes.cardContent}>
                      <Box sx={classes.seatNumber}>
                        {item.seatNo}
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Box>
          }
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box sx={classes.info} >
            <Card variant='outlined' style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", background: "#C7D3D4FF" }} >
              <CardContent>
                <Box sx={classes.main} >
                  <Box sx={classes.bookedSeats}></Box>
                  <Box sx={classes.f600}>
                    Booked Seats: {data?.numOfSeatsBooked}
                  </Box>
                </Box>
                <Box sx={classes.main}>
                  <Box sx={classes.availableSeats}></Box>
                  <Box sx={classes.f600}>
                    Available Seats: {data?.numOfAvailableSeats}
                  </Box>
                </Box>

                <div style={{ marginTop: "20px" }} >
                  <Card>
                    <CardContent>
                      <Box sx={classes.bookingContainer} >
                        <Box sx={classes.f600}>
                          Current Seats booked:
                        </Box>
                        <div>
                          {data?.numOfSeatsBooked === 0 ?

                            <Box sx={classes.f600}>
                              All seats are Avialable
                            </Box>
                            :
                            <Box sx={classes.bookingCard}>
                              <Card sx={classes.cardStyles}
                                style={{ background: "#990011FF", color: "#FCF6F5FF" }} >
                                <CardContent sx={classes.cardContent}>
                                  <Box sx={classes.seatNumber}>
                                    1
                                  </Box>
                                </CardContent>
                              </Card>
                            </Box>}
                        </div>
                      </Box>
                    </CardContent>
                  </Card>
                </div>

                <Box sx={classes.enterContainer}>
                  <Box sx={classes.example}>
                    Enter Number of Seats : example: 4
                  </Box>
                  <Grid xs={12} >
                    <form onSubmit={handleSubmit} >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                          <input
                            type="number"
                            placeholder='seats'
                            min="1"
                            max="7"
                            style={{ width: "100%", height: "30px" }}
                            onChange={(e) => setSelectedSeats(e.target.value)}
                            required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <Button
                            variant="contained" color="primary" type='submit' fullWidth disabled={reserveSeatsLoader ? true : false}>
                            {reserveSeatsLoader ? <CircularProgress style={{ color: "#1976D2" }} /> : "Reserve Seats"}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Box>

                <Box sx={classes.submit}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Button
                      onClick={handleReset}
                      variant="contained" color="secondary" fullWidth disabled={resetLoader ? true : false} >
                      {resetLoader ? <CircularProgress style={{ color: "#DC004E" }} /> : "Reset All Seats"}
                    </Button>
                  </Grid>
                </Box>

              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home