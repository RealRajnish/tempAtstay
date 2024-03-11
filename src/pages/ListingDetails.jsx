import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Footer from "../components/Footer";
import { API_10, API_11, API_3, API_9 } from "../api/api";
import { setBookingData, setTempHostData } from "../redux/state";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [selectRoom, setSelectedRoom] = useState("standard");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [datesArray, setDatesArray] = useState([]);
  const [listing, setListing] = useState(null);
  const [availability, setAvailability] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [roomCountErr, setRoomCountErr] = useState();
  const [dayCountErr, setDayCountErr] = useState();
  const [image, setImage] = useState();
  // const [date,setDate]=useState([])

  const dispatch = useDispatch();

  const { listingId } = useParams();
  const getHostInfo = async () => {
    try {
      const resp = await axios.post(API_11, { id: listing.hostId });
      dispatch(setTempHostData({ tempHost: resp.data }));
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getHostInfo();
  }, [listing]);

  const getListingDetails = async () => {
    try {
      const response = await fetch(`${API_9}${listingId}`, {
        method: "GET",
      });

      const data = await response.json();
      // console.log(data[0]);
      setListing(data[0]);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };
  console.log("listing details ", listing);

  useEffect(() => {
    getListingDetails();
  }, []);

  // console.log(listing);

  const handleAvailability = async () => {
    try {
      if (datesArray) {
        if (listing?.type === "An entire place") {
          const resp = await axios.post(API_10, {
            date: datesArray,
            type: "An entire place",
            hotelId: "2bmiyu1e0slsylsju",
          });
          // console.log("resp", resp?.data);
          if (resp?.data.code == 2) {
            // console.log(resp?.data);
            // console.log("inside availability not found");
            setAvailability("Not Available");
          }
          if (resp?.data?.availability[0].bookingStatus === false) {
            setAvailability("Available");
          } else if (resp?.data?.availability[0].bookingStatus) {
            setAvailability("Not Available");
          }

          // console.log("Response", listing);
        } else if (listing?.type === "Rooms") {
          const response = await axios.post(API_10, {
            date: datesArray,
            type: "Rooms",
            hotelId: "2bmiyu1e0slsylsj0u",
            roomType: "Standard",
            roomNum: 6,
          });
          if (response) {
            console.log(response);
          }
        }
      } else {
        window.alert("please select date range");
      }
      // console.log("listing", listing);
    } catch (error) {
      console.log(error);
    }
  };

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);
  const tempHost = useSelector((state) => state?.tempHost);

  const navigate = useNavigate();

  useEffect(() => {
    if (roomCount < 1) {
      setRoomCountErr("Room Count must be greater than 0");
    } else {
      setRoomCountErr(null);
      setAvailability(null);
    }
    if (dayCount < 1) {
      setDayCountErr("Please Select proper date range");
    } else {
      setDayCountErr(null);
      setAvailability("null");
    }
    if (roomCount > 0 && dayCount > 0) {
      checkAvailability();
    }
  }, [roomCount, dayCount, datesArray, selectRoom]);
  // useEffect(() => {
  //   console.log("roomCount", roomCount);
  //   if (roomCount > 0 && dayCount > 0) {
  //     checkAvailability();
  //   }
  // }, [roomCount, dayCount, datesArray, selectRoom]);

  const checkAvailability = async () => {
    try {
      console.log("roomCount in api", roomCount);
      const resp = await axios.post(API_10, {
        date: datesArray,
        hotelId: listing.hotelId,
        roomType: selectRoom,
        roomNum: roomCount,
        type: listing.type,
      });
      console.log("Response ", resp.data);
      if (resp.data.roomAvailability) {
        setAvailability("Available");
      } else {
        setAvailability("Not Available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    // console.log("startDate", startDateObj);
    // console.log("endDate", endDateObj);
    const dates = [];
    let currentDate = startDateObj;

    // Loop through each date until the day before the end date
    while (currentDate < endDateObj) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dates.push(formattedDate);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDatesArray(dates);
  }, [startDate, endDate]);
  useEffect(() => {
    console.log("Dates Array", datesArray);
  }, [datesArray]);

  useEffect(() => {
    const startdate = new Date(dateRange[0].startDate);
    const startyear = startdate.getFullYear();
    const startmonth = String(startdate.getMonth() + 1).padStart(2, "0");
    const startday = String(startdate.getDate()).padStart(2, "0");
    const startformattedDate = `${startyear}-${startmonth}-${startday}`;
    setStartDate(startformattedDate);
    const enddate = new Date(dateRange[0].endDate);
    const endyear = enddate.getFullYear();
    const endmonth = String(enddate.getMonth() + 1).padStart(2, "0");
    const endday = String(enddate.getDate()).padStart(2, "0");
    const endformattedDate = `${endyear}-${endmonth}-${endday}`;
    setEndDate(endformattedDate);
  }, [dateRange]);

  const handleSubmit = async () => {
    try {
      if (dayCount > 0 && roomCount > 0) {
        const bookingForm = {
          customerId,
          listingId,
          hostId: listing.hostId,
          startDate: dateRange[0].startDate.toDateString(),
          endDate: dateRange[0].endDate.toDateString(),
          totalPrice: listing.price * dayCount,
          type: listing.type,
          roomType: selectRoom,
          roomCount,
          totalRoomPrice: price * dayCount,
          dayCount: dayCount,
          perRoomPrice: price,
          img: listing.listingPhotoPaths[0],
          listing: listing,
          dates: { startDate, endDate },
        };
        console.log("dayCount", dayCount);
        console.log("handleSubmit button clicked", bookingForm);
        dispatch(
          setBookingData({
            bookingData: bookingForm,
          })
        );

        // const response = await fetch("http://localhost:3001/bookings/create", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(bookingForm),
        // });

        // if (response.ok) {
        //   navigate(`/${customerId}/trips`);
        // }
        // navigate("/bookingPage");
        navigate("/cartDetailspage");
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  useEffect(() => {
    // console.log("listing", listing.rooms[0].price);
    if (listing) {
      if (listing.type === "Rooms") {
        if (selectRoom === "standard") {
          setPrice(listing.rooms[0].price);
          // console.log("listing", listing.rooms[0].price);
        } else if (selectRoom === "double") {
          setPrice(listing.rooms[1].price);
          // console.log("listing", listing.rooms[1].price);
        } else if (selectRoom === "deluxe") {
          setPrice(listing.rooms[2].price);
          // console.log("listing", listing.rooms[2].price);
        }
      } else if (listing.type === "An entire place") {
        setPrice(listing.price);
      }
    }
  }, [selectRoom, listing]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="listing-details">
        <div className="title">
          <h1>{listing && listing.title}</h1>
        </div>

        <div className=" imageset d-flex" id="pc">
          <div className="outerimage">
            <img
              src={`${API_3}${listing.listingPhotoPaths[0].replace(
                "public",
                ""
              )}`}
            />
          </div>

          <div className="innerimage">
            <img
              src={`${API_3}${listing.listingPhotoPaths[1].replace(
                "public",
                ""
              )}`}
            />
            <img
              src={`${API_3}${listing.listingPhotoPaths[2].replace(
                "public",
                ""
              )}`}
            />
          </div>

          <div className="innerimage2">
            <img
              src={`${API_3}${listing.listingPhotoPaths[3].replace(
                "public",
                ""
              )}`}
            />
            <img
              src={`${API_3}${listing.listingPhotoPaths[4].replace(
                "public",
                ""
              )}`}
            />
          </div>
          {/* {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`${API_3}${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))} */}
        </div>

        <div className="mob-img-container" id="mob">
          <div className="main-img">
            <img
              src={
                image ||
                `${API_3}${listing.listingPhotoPaths[0].replace("public", "")}`
              }
              alt=""
              srcset=""
            />
          </div>
          <div className="short-img-container">
            {listing.listingPhotoPaths?.map((item, id) => (
              <div
                className="img"
                key={id}
                onClick={() =>
                  setImage(`${API_3}${item.replace("public", "")}`)
                }
              >
                <img
                  src={`${API_3}${item.replace("public", "")}`}
                  alt=""
                  srcset=""
                />
              </div>
            ))}
          </div>
        </div>
        {/* <div className="photos" >
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`${API_3}${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div> */}
        <div
          className="details"
          style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}
        >
          <div className="property-details" style={{ maxWidth: "60%" }}>
            <h2>
              {listing.type} in {listing.city}, {listing.province},{" "}
              {listing.country}
            </h2>

            <p style={{ display: listing.type === "Rooms" ? "none" : "" }}>
              {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
              {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
            </p>
            <hr />

            <div className="profile">
              {/*<img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />*/}
              <h3>
                Hosted by {tempHost ? tempHost.firstName : "firstname"}{" "}
                {tempHost ? tempHost.lastName : "lastNAme"}
              </h3>
            </div>
            <hr />

            <h3>Description</h3>
            <p>{listing.description}</p>
            <hr />

            <h3>{listing.highlight}</h3>
            <p>{listing.highlightDesc}</p>
            <hr />

            <div className="booking">
              <div>
                <h2>What this place offers?</h2>
                <div className="amenities">
                  {listing.amenities[0].split(",").map((item, index) => (
                    <div className="facility" key={index}>
                      <div className="facility_icon">
                        {
                          facilities.find((facility) => facility.name === item)
                            ?.icon
                        }
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  Rs. {price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  Rs. {price} x {dayCount} night
                </h2>
              )}

              <div className="error-container">
                {dayCountErr && <p style={{ color: "red" }}>{dayCountErr}</p>}
              </div>
              <div
                className="div room-type"
                style={{ display: listing.type === "Rooms" ? "" : "none" }}
              >
                <div className="rooms-type">
                  <button
                    onClick={() => setSelectedRoom("standard")}
                    style={{
                      background:
                        selectRoom === "standard" ? "#66cccc" : "white",
                      color: selectRoom === "standard" ? "white" : "#66cccc",
                    }}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setSelectedRoom("double")}
                    style={{
                      background: selectRoom === "double" ? "#66cccc" : "white",
                      color: selectRoom === "double" ? "white" : "#66cccc",
                      display: listing.rooms[1].price !== 0 ? "" : "none",
                    }}
                  >
                    Double
                  </button>
                  <button
                    onClick={() => setSelectedRoom("deluxe")}
                    style={{
                      background: selectRoom === "deluxe" ? "#66cccc" : "white",
                      color: selectRoom === "deluxe" ? "white" : "#66cccc",
                      display: listing.rooms[2].price !== 0 ? "" : "none",
                    }}
                  >
                    Deluxe
                  </button>
                </div>
                <div className="rooms-count">
                  <div className="text">Rooms</div>
                  <div className="value">
                    <div
                      className="decrement"
                      onClick={() => {
                        if (parseInt(roomCount) > 1) {
                          console.log("inside if", roomCount);
                          setRoomCount(parseInt(roomCount) - 1);
                        }
                      }}
                    >
                      -
                    </div>
                    {/* <input
                      type="number"
                      min={1}
                      value={roomCount}
                      onChange={(e) => setRoomCount(e.target.value)}
                    /> */}
                    <div className="input">{roomCount}</div>
                    <div
                      className="increment"
                      onClick={() => setRoomCount(parseInt(roomCount) + 1)}
                    >
                      +
                    </div>
                  </div>
                </div>
                <div className="error-container">
                  {roomCountErr && (
                    <p style={{ color: "red" }}>{roomCountErr}</p>
                  )}
                </div>
              </div>

              <div className="availability-container">
                {/* <div className="button" style={{ backgroundColor: "white" }}>
                  <button onClick={() => handleAvailability()}>
                    Check Availability
                  </button>
                </div> */}
                <div
                  className="text"
                  style={{
                    color: availability === "Available" ? "#66cccc" : "red",
                  }}
                >
                  {availability}
                </div>
              </div>
              <h2>Total price: Rs. {price * dayCount * roomCount}</h2>
              <p>CheckIn Date: {dateRange[0].startDate.toDateString()}</p>
              <p>CheckOut Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                className="button"
                type="submit"
                onClick={handleSubmit}
                disabled={!(availability === "Available")}
                style={{
                  background: availability === "Available" ? "" : "grey",
                }}
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
