import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
// import { productData1 } from "./Atstaynextdata";
// import { productData6 } from "./Atstaynextprice";
// import Footers from "./Footer";
import { setBookingData } from "../../redux/state";
// import Footer from "./Footer";

import { useNavigate } from "react-router-dom";
import "./CartDetailspage.css";
import { API_15, API_16, API_17, API_18, API_22, API_3 } from "../../api/api";
import { useSelector } from "react-redux";
import "../../styles/form.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import Footer from "../../components/Footer";

export default function CartDetailsPage() {
  const bookingData = useSelector((state) => state.bookingData);
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const [paymentResp, setPaymentResp] = useState();
  // console.log(user);
  // console.log(bookingData);
  const [mm, setMM] = useState(bookingData);
  const params = useParams();
  //   const mm1 = mm.filter((datas) => datas.id == params.id);
  const mm1 = bookingData;

  const adult = localStorage.getItem("adult");
  const child = localStorage.getItem("child");
  const room = localStorage.getItem("room");
  const checkinn = localStorage.getItem("checkin");
  const checkoutt = localStorage.getItem("checkout");
  const diff = localStorage.getItem("numberOfDays");

  const navigate = useNavigate();

  const amunt = room * diff;
  console.log(amunt);
  const amunt2 =
    amunt *
    (bookingData.type === "Rooms"
      ? bookingData.totalRoomPrice
      : bookingData.totalPrice);
  // console.log(amunt2);
  //   console.log(mm1[0].price);

  localStorage.setItem("amunt", amunt2);

  //Form Code

  const [clientName, setClientName] = useState(
    user?.firstName + " " + user?.lastName
  );
  const [email, setEmail] = useState(user?.email);
  const [phone, setphone] = useState(user?.contact);
  const [add, setadd] = useState("");
  const [street, setstreet] = useState("");
  const [pin, setpin] = useState("");
  const [country, setcountry] = useState("");
  const adult1 = parseInt(localStorage.getItem("adult")) || 0;
  const children = parseInt(localStorage.getItem("child")) || 0;
  const selectedDate = localStorage.getItem("selectedDate") || "";
  const amount = bookingData.perRoomPrice * bookingData.dayCount;
  const adds = localStorage.setItem("add", add) || "";
  const mails = localStorage.setItem("mail", email) || "";
  const phones = localStorage.setItem("phone", phone) || "";
  const namess = localStorage.setItem("namess", clientName);
  const tripname = localStorage.getItem("trip");
  const checkoutDate = localStorage.getItem("checkout");
  const checkin = localStorage.getItem("checkin");
  const rooms = localStorage.getItem("room");
  // console.log(adds);
  // console.log(selectedDate, "ll");

  // const navigate = useNavigate()

  useEffect(() => {
    const show = document.querySelector(".showsss");
    show.style.display = "none";
  }, []);
  const showsss = () => {
    const show = document.querySelector(".showsss");
    show.style.display = "flex";
    show.style.overflow = "hidden"; // Enable scrolling for the specific element
  };

  const closeee = () => {
    const show = document.querySelector(".showsss");
    show.style.display = "none";
  };

  const checkout = async (amount) => {
    localStorage.setItem("amount", amount);
    console.log(amount);
    // dispatch(
    //   setBookingData({
    //     bookingData: {
    //       ...bookingData,
    //       email,
    //       phone,
    //       add,
    //       pin,
    //       country,
    //       clientName,
    //     },
    //   })
    // );

    // Set the 'amount' in localStorage\
    try {
      if (phone.length === 10) {
        var data1 = await fetch(API_15, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        if (data1.success) {
          const responseData = await data1.json();
          // console.log('yyyy',responseData.order.id)
          const orderrr = localStorage.setItem("orderr", responseData.order.id);
        }
        // const orderid=responseData.order.id;

        var keys = await fetch(API_16, {
          method: "GET",
        });
        keys = await keys.json();
        console.log(keys, "yes");
        data1 = await data1.json();

        // const keys='rzp_test_OmCfFJhnp3Fztn'
        // console.log(keys);
        // console.log(data1.amount);
        // console.log(data1.id);
        // console.log(data1);
      } else {
        alert("Please Enter Valid Number");
      }
      if (data1.success) {
        const options = {
          key: keys.key, // Enter the Key ID generated from the Dashboard
          amount: data1.order.tot, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Atstay", //your business name
          description: "Test Transaction",
          // image: "https://example.com/your_logo",
          order_id: data1.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: API_17,
          handler: function (response) {
            // Handle the payment success callback here
            console.log("Payment successful: ", response);
            try {
              // dispatch(
              //   setBookingData({
              //     bookingData: {
              //       ...bookingData,
              //       response: response,
              //       email,
              //       phone,
              //       add,
              //       pin,
              //       country,
              //       clientName,
              //     },
              //   })
              // );
              saveDataToDatabase(response);
              navigate("/invoice");
            } catch (error) {
              console.error("Navigation error:", error);
            }
            // You can navigate to a success page or perform further actions here

            // Save data to the database (you need to implement this on your backend)
          },
          // prefill: {
          //   //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          //   name: "Gaurav Kumar", //your customer's name
          //   email: "gaurav.kumar@example.com",
          //   contact: "9000090000", //Provide the customer's phone number for better conversion rates
          // },

          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);

        rzp1.on("payment.success", function (response) {
          // Payment was successful, now save data to the database
          // console.log("response ", response);
          // if (response) {
          //   saveDataToDatabase(response);
          //   setPaymentResp(response);
          // }
          console.log("Payment successful: ", response);
          // You can navigate to a success page or perform further actions here
        });

        rzp1.open();
      } else {
        console.error("Error creating Razorpay order:", data1.error);
        // Handle the error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const saveDataToDatabase = async (resp) => {
    try {
      const paisa = localStorage.getItem("amunt2");
      const formData = {
        email: email,
        hostId: bookingData.hostId,
        listingId: bookingData.listingId,
        roomType: bookingData.roomType,
        type: bookingData.type,
        roomCount: bookingData.roomCount,
        contact: phone,
        userId: user._id,
        adult,
        children,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: bookingData.dayCount * bookingData.perRoomPrice,
        status: "booked",
        paymentStatus: "success",
        razorpay_payment_id: resp.razorpay_payment_id,
        razorpay_order_id: resp.razorpay_order_id,
      };

      // Send a request to your server to save data to the databases
      const response = await axios.post(API_22, formData);

      console.log(response);

      if (response.status === 200) {
        console.log("Data saved successfully:", response.data);
        dispatch(
          setBookingData({
            bookingData: {
              ...bookingData,
              bookingNo: response.data._id,
              email,
              phone,
              add,
              pin,
              country,
              clientName,
            },
          })
        );
        // You can show a success message to the user
      } else {
        console.error("Error saving data:", response.data.error);
        // Handle the error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <div className="container p-5">
        {Array.isArray([mm1]) &&
          [mm1].map((elm) => {
            return (
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                }}
              >
                <div className="col-md-7">
                  <div
                    className="heading-1"
                    style={{ borderBottom: "1px solid grey", fontSize: "25px" }}
                  >
                    <h3>Cart Items</h3>
                  </div>

                  <div className="cartDetails my-4 d-flex">
                    <div className="Images">
                      <img
                        src={`${API_3}${elm.img.replace("public", "")}`}
                        alt="sklfjls"
                        style={{ width: "150px", height: "150px" }}
                      ></img>
                    </div>
                    <div className="Details mx-5">
                      <h6
                        style={{
                          textTransform: "uppercase",
                          color: "blue",
                          letterSpacing: "3px",
                        }}
                      >
                        {elm.roomtype}
                      </h6>

                      <div
                        className="locationtrip my-3"
                        style={{ display: "flex", gap: "10px" }}
                      >
                        <i className="fa-solid fa-location-dot" />
                        <span>{elm.place}</span>
                      </div>

                      {/* <div className="tourtype">
                            <p>Type Tour : Daliy Tour</p> 
                            </div> */}

                      <div className="departurDate">
                        <p>
                          Checkin : <span>{elm.startDate}</span>
                        </p>
                      </div>

                      <div className="Duration">
                        <p>Checkout : {elm.endDate}</p>
                      </div>

                      <div className="numberofdaysss">
                        {diff} Days to Stay = {elm.dayCount} x{" "}
                        {elm.perRoomPrice} = {elm.dayCount * elm.perRoomPrice}
                      </div>

                      <div className="bookingDetails my-3">
                        <p>Adult : 2 </p>
                        <p>Children : 1</p>
                        {/* <p>
                          Number of Room : {room} = {room} x {diff * elm.price}{" "}
                          = {room * diff * elm.price}
                        </p> */}
                        <div className="total">
                          Total amount : ₹ {elm.dayCount * elm.perRoomPrice}
                        </div>
                      </div>
                    </div>
                    <div
                      className="Pricesss "
                      style={{ fontSize: "25px", marginLeft: "45px" }}
                    >
                      {elm.price}
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mx-5">
                  <div className="carttotal">
                    <h3>Cart totals</h3>
                  </div>

                  <div
                    className="cardtotalbox p-3"
                    style={{ border: "1px solid grey" }}
                  >
                    <div
                      className="box3"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div className="d-flex justify-content-between my-3">
                        <span>Subtotal</span>
                        <span>₹ {elm.dayCount * elm.perRoomPrice}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Total</span>
                        <span>₹ {elm.dayCount * elm.perRoomPrice}</span>
                      </div>

                      <center>
                        <button
                          className="btn btn-primary my-3"
                          onClick={showsss}
                        >
                          Proceed to checkout
                        </button>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="showsss" id="form-container">
        <div className="inner-div">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkout(amount);
            }}
          >
            <div class="form-group">
              <h2 class="heading">Fill Your Details</h2>
              <div class="controls">
                <input
                  type="text"
                  placeholder="Name"
                  value={clientName}
                  required
                  onChange={(e) => {
                    setClientName(e.target.value);
                  }}
                  style={{}}
                />
              </div>
              <div class="controls">
                <input
                  type="text"
                  id="email"
                  class="floatLabel"
                  name="email"
                  value={email}
                  required
                  placeholder="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label for="email"></label>
              </div>
              <div class="controls">
                <input
                  type="tel"
                  id="phone"
                  class="floatLabel"
                  name="phone"
                  value={phone}
                  required
                  placeholder="Phone"
                  onChange={(e) => {
                    setphone(e.target.value);
                  }}
                />
                <label for="phone"></label>
              </div>
              <div class="grid">
                <div class="col-2-3">
                  <div class="controls">
                    <input
                      type="text"
                      id="street"
                      class="floatLabel"
                      name="street"
                      required
                      value={add}
                      placeholder="Adress"
                      onChange={(e) => {
                        setadd(e.target.value);
                      }}
                    />
                    <label for="street"></label>
                  </div>
                </div>
              </div>
              <div class="grid">
                {/* <div class="col-2-3">
          <div class="controls">
            <input type="text" id="city" class="floatLabel" name="city" placeholder='City' />
            <label for="city"></label>
          </div>         
        </div> */}
                <div class="col-1-3">
                  <div class="controls">
                    <input
                      type="text"
                      id="post-code"
                      class="floatLabel"
                      name="post-code"
                      required
                      value={pin}
                      placeholder="Pin-code"
                      onChange={(e) => {
                        setpin(e.target.value);
                      }}
                    />
                    <label for="post-code"></label>
                  </div>
                </div>
              </div>
              <div class="controls">
                <input
                  type="text"
                  id="country"
                  class="floatLabel"
                  name="country"
                  placeholder="Country"
                  required
                  value={country}
                  onChange={(e) => {
                    setcountry(e.target.value);
                  }}
                />
                <label for="country"></label>
              </div>
            </div>
            <div className="d-flex" style={{ width: "30%", gap: "20px" }}>
              <button type="submit" value="Submit" class="col-1-4 w-100">
                Submit
              </button>
              <span
                class="col-1-4 w-100 closebtn"
                style={{ background: "red" }}
                onClick={closeee}
              >
                Cancel
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
