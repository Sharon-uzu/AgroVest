import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";


const Contact = () => {
  return (

    <div className="contact-us">

        <div className="arr">
            <Link to='/'><FaArrowLeftLong className='arr-i'/></Link>
        </div>
    <div className='contact'>
        
        <section className='contact-c'>
            <form className='form'>
                <div className="form-c">
                    <input type="text" placeholder='Full Name'/>
                    <input type="tel" placeholder='Phone Number'/>
                    <input type="email" placeholder='Email'/>
                    <input type="text" placeholder='Referral code'/>
                    <textarea placeholder='Message'></textarea>

                    <div className="subm">
                        <button type="submit">Submit</button>
                    </div>
                </div>

            </form>
        </section>
    </div>

    </div>
  )
}

export default Contact