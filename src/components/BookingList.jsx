import React from "react";
import { Link } from "react-router-dom";
import "./BookingList.scss";

const BookingList = ({ data = [] }) => {
  // Debug: Log the data to see what we're receiving
  console.log("BookingList received data:", data);
  
  return (
    <div className="container">
        {data.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Room</th>
                <th>Confirmed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
             {data.map((item) => (
               <tr key={item._id}>
                  <td data-label="Name" className="booking-name">
                    {item.name || item.customerName || item.userName || "N/A"}
                  </td>
                  <td data-label="Email">{item.email || "N/A"}</td>
                  <td data-label="Room">{item.roomId?.name || item.room?.name || "Unknown Room"}</td>
                  <td data-label="Confirmed">{item.confirmed ? "Yes" : "No"}</td>
                  <td data-label="Action">
                    <Link to={`/bookings/${item._id}`}>View</Link>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      
    </div>
  );
};

export default BookingList;
