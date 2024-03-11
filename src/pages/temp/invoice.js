import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
// import logo from "../images/atstaylogo.webp";
import "./invoice.css";
import { API_19, API_3 } from "../../api/api";
import { useSelector } from "react-redux";

function Invoice() {
  const bookingData = useSelector((state) => state.bookingData);
  const tempHost = useSelector((state) => state.tempHost);
  const user = useSelector((state) => state.user);
  console.log("user", user);
  console.log("bookingData", bookingData);
  const name = localStorage.getItem("NAME");
  const add = localStorage.getItem("add");

  const mail = localStorage.getItem("mail");
  const phone = localStorage.getItem("phone");
  const amount = localStorage.getItem("amount");
  const namess = localStorage.getItem("namess");
  const trips = localStorage.getItem("trip");

  const handleDownload = () => {
    const element = document.getElementById("invoice-container");
    html2pdf(element);
    // sendInvoiceByEmail(element.innerHTML);
    const s = element.innerHTML; // Send invoice HTML to the server
    localStorage.setItem("html", s);
    console.log(s);
  };
  useEffect(() => {
    const element = document.getElementById("invoice-container");

    sendInvoiceByEmail(element.innerHTML);
  });
  const sendInvoiceByEmail = async (invoiceHTML) => {
    try {
      const response = await fetch(API_19, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: mail,
          invoiceHTML: invoiceHTML,
          hostEmail: tempHost.email,
        }),
      });
      console.log("kkkkk");

      const result = await response.json();

      if (result.success) {
        console.log("Email sent successfully");
      } else {
        console.error("Error sending email:", result.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = currentDate.getDate();
    day = day < 10 ? "0" + day : day;
    return `${day}-${month}-${year}`;
  }

  const date = localStorage.setItem("curdate", selectedDate);
  const date1 = localStorage.getItem("curdate");
  const mmmm = localStorage.getItem("orderr");

  return (
    <>
      {/* <div id="invoice-container"> */}
      <div className="" id="invoice-container">
        <table
          width="90%"
          className=""
          style={{ margin: "auto", marginBottom: "60px" }}
        >
          <img
            src="/assets/logo.webp"
            // src={`${API_3}assets/logo.webp`}
            // src="https://atstay.in/static/media/atstaylogo.906f76c7ef404c420b3b.webp"
            height="80px"
            width="80px"
            style={{ textAlign: "left" }}
          />
          <tr style={{ textAlign: "left", height: "100px" }}>
            <th>
              Atstay <br />
              640, Second floor, 262, Westend Marg, Saidulajab New Delhi -
              110030
              <br />
              India
              <br />
              VAT Reg #: 9919SGP29004OSJ
            </th>

            <th style={{ textAlign: "right" }}>
              Invoice # HSG-841693
              <br />
              Invoice Date # {date1}
              <br />
              Invoice Amount # ₹
              {bookingData.dayCount * bookingData.perRoomPrice}.00 (INR)
              <br />
              Order Nr. # {mmmm}
              <br />
              PAID
            </th>
          </tr>

          <tr style={{ textAlign: "left", height: "200px" }}>
            <th>
              BILLED TO
              <br />
              {bookingData.clientName}
              <br />
              IN19CCDPD5287P1ZY
              <br />
              {bookingData.add + " " + bookingData.pin}
              <br />
              India
              <br />
              {bookingData.email}
              <br />
              {bookingData.phone}
              Booking No: {bookingData.bookingNo}
            </th>
          </tr>
        </table>

        <table
          width="100%"
          style={{ textAlign: "center", border: "1px solid black" }}
        >
          <tr>
            <td
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              Description
            </td>
            <td
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              Price
            </td>
            <td
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              TOTAL EXCL. VAT
            </td>
            <td
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              AMOUNT (INR)
            </td>
          </tr>

          <tr>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              {bookingData.listing.title}
            </th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              {bookingData.dayCount * bookingData.perRoomPrice}
            </th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              -----
            </th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              {bookingData.dayCount * bookingData.perRoomPrice}
            </th>
          </tr>

          <tr>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            ></th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            ></th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              0
            </th>
            <th
              className="jsm"
              style={{
                width: "200px",
                border: "1px solid black",
                padding: "15px",
              }}
            >
              ₹{bookingData.dayCount * bookingData.perRoomPrice}.00 (INR)
            </th>
          </tr>
        </table>
      </div>

      {/* </div> */}

      <button onClick={handleDownload}>Download PDF</button>
    </>
  );
}
export default Invoice;
