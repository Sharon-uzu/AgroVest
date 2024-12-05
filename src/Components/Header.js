import React, {useState} from 'react';
import logo from '../Images/m-l-removebg-preview.png'
import { Link } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";
import { FaBars } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import Modal from "react-modal";

const Header = () => {


    const [join, setJoin] = useState(false)

    const [loggedIn, setLoggedIn] = useState(true)


    const [drop, setDrop] = useState(false)

    const handleDrop = () => {
        setDrop(!drop);
    }


    const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
    setDropdownOpen(!isDropdownOpen);
    document.body.style.overflow = click ? 'auto' : 'hidden'; // Disable or enable scrolling

  }

  const closeMenuBar = () => {
    setClick(false);
    document.body.style.overflow = 'auto'; // Enable scrolling

  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
      setIsOpen(!isOpen);
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
                        <li><Link to='/all-products' onClick={closeMenuBar}>Products</Link></li>
                        <li><Link to='/contact' onClick={closeMenuBar}>Contact Us</Link></li>

                        { join ? (<>
                        <li className='sign' onClick={handleDrop}><a>Join Us <TiArrowSortedDown /> </a>
                        {
                            drop ? 
                            (<ul className='drop'>
                                
                            <li><Link to='/farmerSignup'>Farmer/Seller</Link></li>
                            <li><Link to='/buyerSignup'>Buyer</Link></li>

                        </ul>) : null
                        }

                        
                           
                        </li></>
                        ) : null

                        }


                        {
                            loggedIn ? (<>
                            
                                <li className='dp' onClick={toggleModal}>
                                    JB

                                </li>
                            </>):null
                        }
                        

                    </div>
                </ul>
            </nav>

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Example Modal"
                className="two"
                style={{
                overlay: {
                    width:'100%',
                    position: "fixed",
                    top: "0px",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1200000000000,
                    // backgroundColor: "hsl(0, 0%, 0%, .5)",
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
                                JB
                            </div>

                            <h5>John B.</h5>
                            <h5>john@gmail.com</h5>
                            <h5>09176543256</h5>
                            <h5>Woji Road, Port Harcourt, Rivers State</h5>

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

                        </div>


                    </div>
                </section>
            </Modal>
        </header>

        <div className={click ? 'cover' : 'cover active'}></div>

    </div>
  )
}

export default Header