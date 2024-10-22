import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";
import { FaBars } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import Modal from "react-modal";
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Service from '../Components/Service';
import Feature from '../Components/Feature';
import Connect from '../Components/Connect';
import Footer from '../Components/Footer';
import Faq from '../Components/Faq';
import logo from '../Images/m-l-removebg-preview.png'

const Home = () => {
    const [drop, setDrop] = useState(false);
    const [click, setClick] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate(); // For redirecting after logout

    useEffect(() => {
        // Retrieve user details from localStorage on initial load
        const storedDetails = localStorage.getItem("userDetails");
        if (storedDetails) {
            setUserDetails(JSON.parse(storedDetails));
            setLoggedIn(true);
        }
    }, []);

    const handleDrop = () => {
        setDrop(!drop);
    };

    const handleClick = () => {
        setClick(!click);
        document.body.style.overflow = click ? 'auto' : 'hidden'; // Disable or enable scrolling
    };

    const closeMenuBar = () => {
        setClick(false);
        document.body.style.overflow = 'auto'; // Enable scrolling
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("userDetails"); // Remove user details from localStorage
        setLoggedIn(false); // Set loggedIn state to false
        setUserDetails(null); // Clear user details
        setIsOpen(false);
        navigate('/'); // Redirect to home or login page
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="logo">
                        <Link to='/'><img src={logo} alt="logo" /></Link>
                    </div>

                    <div className='bars' onClick={handleClick}>
                        {click ? (<RiCloseFill id='close' />) : (<FaBars id='bar' />)}
                    </div>

                    <ul className={click ? 'menu active' : 'menu'}>
                        <div className='first-list'>
                            <li><Link to='/' onClick={closeMenuBar}>Home</Link></li>
                            <li><a href='#service' onClick={closeMenuBar}>Service</a></li>
                            <li><a href='#about' onClick={closeMenuBar}>About Us</a></li>
                            <li><Link to='/agrofarm' onClick={closeMenuBar}>AgroFarm</Link></li>
                            <li><Link to='/contact' onClick={closeMenuBar}>Contact Us</Link></li>

                            {loggedIn ? (
                                <li className='dp' onClick={toggleModal}>
                                    {userDetails?.name?.charAt(0) || "User"}
                                </li>
                            ) : (
                                // Dropdown button for users not logged in
                                <li className='sign' onClick={handleDrop}><a>Join Us <TiArrowSortedDown /> </a>
                                {
                                    drop ? 
                                    (<ul className='drop'>
                                        
                                    <li><Link to='/farmerSignup'>Farmer/Seller</Link></li>
                                    <li><Link to='/buyerSignup'>Buyer</Link></li>

                                    </ul>) : null
                                    }
                                </li>
                            )}
                        </div>
                    </ul>
                </nav>

                <Modal
                    isOpen={isOpen}
                    onRequestClose={toggleModal}
                    contentLabel="User Details Modal"
                    className="two"
                    style={{
                        overlay: {
                            width: '100%',
                            position: "fixed",
                            top: "0px",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1200000000000,
                            backgroundColor: "hsl(0, 0%, 0%, .6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    }}
                >
                    <section className='h-modal'>
                        <div className='dp-modal'>
                            <div className="content-m">
                                <h3 onClick={toggleModal}>x</h3>

                                <div className="dp-c">
                                    {userDetails?.name?.charAt(0) || "User"}
                                </div>

                                <h5>{userDetails?.name || "Name not available"}</h5>
                                <h5>{userDetails?.email || "Email not available"}</h5>
                                <h5>{userDetails?.phone || "Phone not available"}</h5>
                                <h5>{userDetails?.address || "Address not available"}</h5>

                                <div className="history">
                                  <h2>History</h2>

                                  <div className='his h-heading'>
                                      <span>Product</span>
                                      <span>Price</span>
                                      <span>Date</span>
                                  </div>

                                  <div className='his'>
                                      <span>Yam</span>
                                      <span>N2000</span>
                                      <span>2/09/024</span>
                                  </div>

                                  <div className='his'>
                                      <span>Potatoes</span>
                                      <span>N5000</span>
                                      <span>5/10/024</span>
                                  </div>

                                  <div className='his'>
                                      <span>Rice</span>
                                      <span>N12000</span>
                                      <span>13/10/024</span>
                                  </div>

                              </div>

                              <div className="logout" onClick={handleLogout}>LogOut</div>
                            </div>
                        </div>
                    </section>
                </Modal>
            </header>

            <Hero />
            <About />
            <Service />
            <Feature />
            <Connect />
            <Faq />
            <Footer />
        </div>
    );
};

export default Home;