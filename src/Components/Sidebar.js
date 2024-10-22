import React,{useState, useEffect} from 'react';
import '../App.css';
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineReceipt } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaCube } from "react-icons/fa";
import { FaBars} from "react-icons/fa";
import { RiCloseFill} from "react-icons/ri";
import logo from '../Images/logo.png';
// import logo2 from '../Assets/logo2.png'
import { FaRegCircleQuestion } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Supabase } from "../config/supabase-config";


const Sidebar = (props) => {

    const [open, setOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
  
    const [open1, setOpen1] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate(); // For redirecting after logout

    useEffect(() => {
        const fetchUserInfo = async () => {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            console.error("User ID not found");
            return;
          }
    
          try {
            const { data, error } = await Supabase
              .from("agrovest-main")
              .select("*")
              .eq("id", userId)
              .single();
    
            if (error) {
              console.error("Error fetching user info:", error);
              return;
            }
    
            setUserInfo(data);
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        };
    
        fetchUserInfo();
      }, []);

      const handleLogout = () => {
        localStorage.removeItem("userId"); // Remove user details from localStorage
        setUserInfo(null); // Clear user details
        navigate('/'); // Redirect to home or login page
    };

  return (
    <div>
      
    
      
      <FaBars className='media-bar'  onClick={() =>{setOpen1(!open1)}} style={{cursor:'pointer'}}/>
      

      <div className='side side-bg' style={{width:isOpen ? "70px" : "250px"}}>

        <section className='sidebar' style={{width:isOpen ? "70px" : "250px"}}>

            <section>
        

                <div className='bar' >

                    
                    <div className='logo-div' style={{display:isOpen ? "none" : "block"}}>
                        <Link to='/' style={{textDecoration:'none',textAlign:'center'}}><h1>{props.name}<span></span></h1></Link>
                    </div>

                    {/* <div className='logo-div' style={{display:isOpen ? "block" : "none"}}>
                        <img src={logo} onClick={toggle}/>
                    </div> */}
                    
                
                </div>


            
                
                <NavLink to='/dashboard' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                    <MdOutlineDashboard className='icon'/>
                    <h4 style={{display:isOpen ? "none" : "block"}}>Dashboard</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/product' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                    <FaCube className='icon'/>
                    <h4 style={{display:isOpen ? "none" : "block"}}>Products</h4>

                    </div>
                
                </NavLink>

           

              

                <NavLink to='/transaction' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <MdOutlineReceipt className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Transaction</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/withdrawal' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <GiReceiveMoney className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Withdraw</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/settings' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <IoIosSettings className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Settings</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/contact' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <FaRegCircleQuestion className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Help</h4>

                    </div>
                
                </NavLink>


        
            </section>



        <section className='log'>



            <NavLink to='/farmerlogin' className='link logout links' activeclassName = 'active'>
                
                    
                    
                <RiLogoutBoxRLine className='icon'/>
                <h4 style={{display:isOpen ? "none" : "block"}}>LogOut</h4>

                
                </NavLink>

        </section>


        </section>
            
    </div>


    {/* Small Screen */}

    {
        open1 ?
    <div className='side side-sm' style={{width:open1 ? "270px" : "70px"}}>
        <RiCloseFill className='close-bar'  onClick={() =>{setOpen1(!open1)}} style={{cursor:'pointer'}}/>


        <section className='sidebar' style={{width:isOpen ? "70px" : "250px"}}>

            <section>
        

                <div className='bar' >

                    
                    <div className='logo-div' style={{display:isOpen ? "none" : "block"}}>
                        <Link to='/' style={{textDecoration:'none'}}><h1>Agro<span>Vest</span></h1></Link>
                    </div>

                    {/* <div className='logo-div' style={{display:isOpen ? "block" : "none"}}>
                        <img src={logo} onClick={toggle}/>
                    </div> */}
                    
                
                </div>


            
                
                <NavLink to='/dashboard' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                    <MdOutlineDashboard className='icon'/>
                    <h4 style={{display:isOpen ? "none" : "block"}}>Dashboard</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/product' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                    <FaCube className='icon'/>
                    <h4 style={{display:isOpen ? "none" : "block"}}>Products</h4>

                    </div>
                
                </NavLink>

           

              

                <NavLink to='/transaction' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <MdOutlineReceipt className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Transaction</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/withdrawal' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <GiReceiveMoney className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Withdraw</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/settings' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <IoIosSettings className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Settings</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/contact' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <FaRegCircleQuestion className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Help</h4>

                    </div>
                
                </NavLink>


        
            </section>



        <section className='log'>



            <NavLink to='/farmerlogin' className='link logout links' activeclassName = 'active'>
                
                    
                    
                <RiLogoutBoxRLine className='icon'/>
                <h4 style={{display:isOpen ? "none" : "block"}}>Logout</h4>

                
                </NavLink>

        </section>


        </section>
            
    </div> 
    : null
    }




    {/* small screen */}


    
       
       
            
    </div>
  )
}

export default Sidebar