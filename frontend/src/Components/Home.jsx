import React, { useEffect, useState } from 'react';
import useStyles from "./Home.styles";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { toast } from "react-toastify";

const Home = () => {
  const classes = useStyles();
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataError, setDataError] = useState("");
  const [resetLoader, setResetLoader] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

  const fetchData = async () => {
    setSeatsLoading(true);
    setData([])
    try {
      const response = await axios.get('http://localhost:4000/seats');
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
      await axios.post('http://localhost:4000/resetAllSeats');
      toast.success("All seats reset successfully")
      fetchData();
      setResetLoader(false);
    } catch (error) {
      toast.error(error.response.data.message)
      setResetLoader(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`submitted: ${selectedSeats}`)
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <h1>Seat Reservation</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} >
          {seatsLoading ? <div>
            <h1>Loading...</h1>
            <div><LinearProgress /></div>
          </div> : dataError ? <div><h1>{dataError}</h1></div> :
            <div className={classes.seatContainer}>
              {data?.seats?.map((item) => (
                <div key={item._id}>
                  {console.log(item)}
                  <Card className={classes.cardStyles}
                    style={{ background: item.isBooked ? "#990011FF" : "#2C5F2DFF", color: item.isBooked ? "#FCF6F5FF" : "#FFE77AFF" }} >
                    <CardContent className={classes.cardContent}>
                      <div className={classes.seatNumber}>
                        {item.seatNo}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          }
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <div className={classes.info} >
            <Card variant='outlined' style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", background: "#C7D3D4FF" }} >
              <CardContent>
                <div className={classes.main} >
                  <div className={classes.bookedSeats}></div>
                  <div>
                    <p className={classes.f600} >Booked Seats : {data?.numOfSeatsBooked}</p>
                  </div>
                </div>
                <div className={classes.main}>
                  <div className={classes.availableSeats}></div>
                  <div>
                    <p className={classes.f600} >Available Seats: {data?.numOfAvailableSeats}</p>
                  </div>
                </div>

                <div style={{ marginTop: "20px" }} >
                  <Card>
                    <CardContent>
                      <div className={classes.bookingContainer} >
                        <div className={classes.f600} >
                          Current Seats booked:
                        </div>
                        <div>
                          {data?.numOfSeatsBooked === 0 ?
                            <div className={classes.f600} >
                              All seats are Avialable
                            </div> :
                            <div className={classes.bookingCard}>
                              <Card className={classes.cardStyles}
                                style={{ background: "#990011FF", color: "#FCF6F5FF" }} >
                                <CardContent className={classes.cardContent}>
                                  <div className={classes.seatNumber}>
                                    1
                                  </div>
                                </CardContent>
                              </Card>
                            </div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className={classes.enterContainer}>
                  <div className={classes.example}>
                    Enter Number of Seats : example: 4
                  </div>
                  <Grid xs={12} >
                    <form onSubmit={handleSubmit} >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                          <input
                            type="number"
                            placeholder='seats'
                            min="1"
                            max="7"
                            className={classes.input}
                            onChange={(e) => setSelectedSeats(e.target.value)}
                            required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <Button variant="contained" color="primary" type='submit' fullWidth>
                            Reserve Seats
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </div>

                <div className={classes.submit}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Button
                      onClick={handleReset}
                      variant="contained" color="secondary" fullWidth disabled={resetLoader ? true : false} >
                      {resetLoader ? <CircularProgress style={{ color: "#DC004E" }} /> : "Reset All Seats"}
                    </Button>
                  </Grid>
                </div>

              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
