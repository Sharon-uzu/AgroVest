import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";
import { FaBars } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import Modal from "react-modal";
import { Supabase } from "../config/supabase-config"; 
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Service from '../Components/Service';
import Feature from '../Components/Feature';
import Connect from '../Components/Connect';
import Footer from '../Components/Footer';
import Faq from '../Components/Faq';
import logo from '../Images/m-l-removebg-preview.png';

const Home = () => {
    const [drop, setDrop] = useState(false);
    const [click, setClick] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [transactions, setTransactions] = useState([]); // Store user transactions

    const navigate = useNavigate();

    useEffect(() => {
        const storedDetails = localStorage.getItem("userDetails");
        if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            setUserDetails(parsedDetails);
            setLoggedIn(true);
            fetchTransactions(parsedDetails.email); // Fetch transactions when user logs in
        }
    }, []);

    const fetchTransactions = async (email) => {
        try {
            const { data, error } = await Supabase
                .from('agrovest-transactions')
                .select('product_name, price, quantity, created_at')
                .eq('user_email', email);

            if (error) throw error;

            const transactionsWithTotal = data.map(transaction => ({
                ...transaction,
                total: transaction.price * transaction.quantity, // Calculate total
            }));
            setTransactions(transactionsWithTotal); // Set fetched transactions
        } catch (error) {
            console.error("Error fetching transactions:", error.message);
        }
    };

    const handleDrop = () => setDrop(!drop);
    const handleClick = () => {
        setClick(!click);
        document.body.style.overflow = click ? 'auto' : 'hidden';
    };
    const closeMenuBar = () => {
        setClick(false);
        document.body.style.overflow = 'auto';
    };
    const toggleModal = () => setIsOpen(!isOpen);
    const handleLogout = () => {
        localStorage.removeItem("userDetails");
        setLoggedIn(false);
        setUserDetails(null);
        setIsOpen(false);
        navigate('/');
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
                            {loggedIn ? (
                                <li className='dp' onClick={toggleModal}>
                                    {userDetails?.name?.charAt(0) || "User"}
                                </li>
                            ) : (
                                <li className='sign' onClick={handleDrop}><a>Join Us <TiArrowSortedDown /> </a>
                                    {drop ? (
                                        <ul className='drop'>
                                            <li><Link to='/farmerSignup'>Farmer/Seller</Link></li>
                                            <li><Link to='/buyerSignup'>Buyer</Link></li>
                                        </ul>
                                    ) : null}
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
                                <div className="dp-c">{userDetails?.name?.charAt(0) || "User"}</div>
                                <h5>{userDetails?.name || "Name not available"}</h5>
                                <h5>{userDetails?.email || "Email not available"}</h5>
                                <h5>{userDetails?.phone || "Phone not available"}</h5>
                                <h5>{userDetails?.address || "Address not available"}</h5>

                                <div className="history">
                                    <h2>History</h2>
                                    <div className='his h-heading'>
                                        <span>Product</span>
                                        <span>Qty</span>
                                        <span>Price</span>
                                        <span>Total</span>
                                        <span>Date</span>
                                    </div>
                                    <div className='h-table'>

                                    
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction, index) => (
                                                <div className='his' key={index}>
                                                    <span>{transaction.product_name}</span>
                                                    <span>{transaction.quantity}</span>
                                                    <span>{`N${transaction.price}`}</span>
                                                    <span>{`N${transaction.total}`}</span>
                                                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='his'>No transactions found</div>
                                        )}
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
