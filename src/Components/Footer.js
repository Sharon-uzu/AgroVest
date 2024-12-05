import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from '../Images/f-logo.png'


const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-c">
            <div className="foot1">
                <img src={logo} alt="" />
                <p>AgroVest is an innovative agricultural technology platform designed to revolutionize farming practices, empower farmers, and promote sustainability in agriculture. </p>
                <div className='icons'>
                    <a href=""><FaFacebookSquare  className='f-i'/></a>
                    <a href=""><FaSquareInstagram  className='f-i'/></a>
                    <a href=""><FaSquareXTwitter  className='f-i'/></a>
                </div>
            </div>

            <div className="foot2">
                <h3>About</h3>
                <li><a href="#about">About Us</a></li>
                <li><a href="#service">Service</a></li>
            </div>

            <div className="foot2">
                <h3>Company</h3>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="">Blog</a></li>
                <li><a href="">Partner with us</a></li>
            </div>

            <div className="foot2">
                <h3>Support</h3>
                <li><a href="">Account</a></li>
                <li><a href="">Support Centre</a></li>
                <li><a href="">Feedback</a></li>
            </div>

        </div>

        


    </div>
  )
}

export default Footer