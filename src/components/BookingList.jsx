import React from "react";
import { Link } from "react-router-dom";
import "./BookingList.scss";

const BookingList = ({ data = [] }) => {
  // Debug: Log the data to see what we're receiving
  console.log("BookingList received data:", data);
  
  return (
    <div className="container">
      <div className="table-container">
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
              {data.map((item) => {
                // Debug: Log each item to see its structure
                console.log("Booking item:", item);
                
                return (
                  <tr key={item._id}>
                    <td className="booking-name">{item.name || item.customerName || item.userName || 'N/A'}</td>
                    <td>{item.email || 'N/A'}</td>
                    <td>{item.roomId?.name || item.room?.name || 'Unknown Room'}</td>
                    <td>{item.confirmed ? "Yes" : "No"}</td>
                    <td>
                      <Link to={`/bookings/${item._id}`}>View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingList;