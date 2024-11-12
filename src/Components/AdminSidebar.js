import React,{useState} from 'react';
import '../App.css';
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineReceipt } from "react-icons/md";
import { Link, NavLink } from 'react-router-dom';
import { FaCube } from "react-icons/fa";
import { FaBars} from "react-icons/fa";
import logo from '../Images/logo.png';
import { RiCloseFill} from "react-icons/ri";
// import logo2 from '../Assets/logo2.png'
import { GiReceiveMoney } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { GiFarmer } from "react-icons/gi";
import { MdPersonOff } from "react-icons/md";



// import { MdOutlineDashboard } from "react-icons/md";
// import { MdOutlineReceipt } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
// import { Link, NavLink } from 'react-router-dom';
// import { FaCube } from "react-icons/fa";
// import { FaBars} from "react-icons/fa";
// import { RiCloseFill} from "react-icons/ri";
// import logo from '../Images/logo.png';
// import logo2 from '../Assets/logo2.png'
import { FaRegCircleQuestion } from "react-icons/fa6";
// import { GiReceiveMoney } from "react-icons/gi";
// import { RiLogoutBoxRLine } from "react-icons/ri";

const AdminSidebar = () => {

    const [open, setOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
  
    const [open1, setOpen1] = useState(false);


  return (
    
    <div>
      
    
      
      <FaBars className='media-bar'  onClick={() =>{setOpen1(!open1)}} style={{cursor:'pointer'}}/>
      

      <div className='side side-bg' style={{width:isOpen ? "70px" : "250px"}}>

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


            
                
                <NavLink to='/admin' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                    <MdOutlineDashboard className='icon'/>
                    <h4 style={{display:isOpen ? "none" : "block"}}>Dashboard</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/unapproved-product' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <FaCube className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Unapproved Products</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/adminproducts' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <FaCube className='icon'/>
                        <h4 style={{display:isOpen ? "none" : "block"}}>Products</h4>

                    </div>
                
                </NavLink>




                {/* <NavLink to='/agrofarmproducts' className='link links' activeclassName = 'active'>
                
                <div className='one'>
                
                   <FaCube className='icon'/>
                   <h4 style={{display:isOpen ? "none" : "block"}}>AgroFarm</h4>

                </div>
            
            </NavLink> */}

           

              

                <NavLink to='/unapprove' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                       <MdPersonOff className='icon'/>
                       <h4 style={{display:isOpen ? "none" : "block"}}>Unapproved Farmers</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/farmers' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                       <GiFarmer className='icon'/>
                       <h4 style={{display:isOpen ? "none" : "block"}}>Farmers</h4>

                    </div>
                
                </NavLink>


                <NavLink to='/admin-transaction' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                       <MdOutlineReceipt className='icon'/>
                       <h4 style={{display:isOpen ? "none" : "block"}}>Transactions</h4>

                    </div>
                
                </NavLink>

                <NavLink to='/admin-withdrawal' className='link links' activeclassName = 'active'>
                
                    <div className='one'>
                    
                        <GiReceiveMoney className='icon'/>
                       <h4 style={{display:isOpen ? "none" : "block"}}>Withdrawals</h4>

                    </div>
                
                </NavLink>


        
            </section>



        <section className='log'>



            <NavLink to='/' className='link logout links' activeclassName = 'active'>
                
                    
                    
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


    
        
        <NavLink to='/admin' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
            <MdOutlineDashboard className='icon'/>
            <h4 style={{display:isOpen ? "none" : "block"}}>Dashboard</h4>

            </div>
        
        </NavLink>


        <NavLink to='/adminproducts' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
                <FaCube className='icon'/>
                <h4 style={{display:isOpen ? "none" : "block"}}>Products</h4>

            </div>
        
        </NavLink>

   

      

        <NavLink to='/unapprove' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
               <MdPersonOff className='icon'/>
               <h4 style={{display:isOpen ? "none" : "block"}}>Unapproved Farmers</h4>

            </div>
        
        </NavLink>

        <NavLink to='/farmers' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
               <GiFarmer className='icon'/>
               <h4 style={{display:isOpen ? "none" : "block"}}>Farmers</h4>

            </div>
        
        </NavLink>


        <NavLink to='/admin-transaction' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
               <MdOutlineReceipt className='icon'/>
               <h4 style={{display:isOpen ? "none" : "block"}}>Transactions</h4>

            </div>
        
        </NavLink>

        <NavLink to='/admin-withdrawal' className='link links' activeclassName = 'active'>
        
            <div className='one'>
            
                <GiReceiveMoney className='icon'/>
               <h4 style={{display:isOpen ? "none" : "block"}}>Withdrawals</h4>

            </div>
        
        </NavLink>



        </section>



        <section className='log'>



            <NavLink to='/' className='link logout links' activeclassName = 'active'>
                
                    
                    
                <RiLogoutBoxRLine className='icon'/>
                <h4 style={{display:isOpen ? "none" : "block"}}>LogOut</h4>

                
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

export default AdminSidebar