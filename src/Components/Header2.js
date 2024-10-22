import React from 'react'
import { PiNotificationBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";    

const Header2 = ({ title, status, statusColor, notes, notesColor }) => {
  return (
    <div className='header2'>
      <section className='h2'>
        <h6 style={{ color: notesColor }}>{notes}</h6>
        <h1>{title}</h1>
        <p style={{ color: statusColor }}>{status}</p> {/* Apply dynamic color */}
      </section>
    </div>
  );
};

export default Header2;

 