import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  seatContainer: {
    width: '95%',
    display: 'grid',
    margin: 'auto',
    justifyContent: 'center',
    gridTemplateColumns: 'auto auto auto auto auto auto auto',
    gridGap: '20px',
    padding: '20px',
    boxSizing: 'border-box',
    [theme.breakpoints.down("xs")]: {
      gridGap: '5px',
      padding: '0px',
      justifyContent: 'space-between',
    },
  },
  cardStyles: {
    width: "50px",
    height: "50px",
    [theme.breakpoints.down("xs")]: {
      width: "35px",
      height: "35px"
    },
  },
  cardContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  seatNumber: {
    [theme.breakpoints.down("xs")]: {
      marginTop: "-10px"
    },
  },
  info: {
    width: "95%",
    margin: "auto"
  },
  main: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  bookedSeats: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#990011FF"
  },
  f600: {
    fontWeight: 600
  },
  availableSeats: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2C5F2DFF"
  },
  enterContainer: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  example: {
    fontWeight: 600,
    fontSize: "18px"
  },
  input: {
    width: "100%",
    height: "30px"
  },
  submit: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center"
  },
  bookingContainer: {
    display: 'flex',
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  bookingCard: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  }
}));

export default useStyles;
