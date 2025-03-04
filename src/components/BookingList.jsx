import React from "react";
import { Link } from "react-router-dom";
import "./BookingList.scss";

const BookingList = ({ data = [] }) => {
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
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.name || 'N/A'}</td>
                  <td>{item.email || 'N/A'}</td>
                  <td>{item.roomId?.name || 'Unknown Room'}</td>
                  <td>{item.confirmed ? "Yes" : "No"}</td>
                  <td>
                    <Link to={`/bookings/${item._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingList;