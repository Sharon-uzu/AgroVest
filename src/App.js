import './App.css';
import { useEffect } from 'react';
import Home from './Screens/Home';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Overview from './Screens/Overview';
import Contact from './Screens/Contact';
import FarmerSignUp from './Screens/FarmerSignUp';
import BuyerSignup from './Screens/BuyerSignup';
import FarmerLogin from './Screens/FarmerLogin';
import BuyerLogin from './Screens/BuyerLogin';
import Dashboard from './Screens/Dashboard';
import Product from './Screens/Product';
import Transaction from './Screens/Transaction';
import Settings from './Screens/Settings';
import Help from './Screens/Help';
import FarmersWithdrawal from './Screens/FarmersWithdrawal';
import AdminDashboard from './Screens/AdminDashboard';
import AdminProducts from './Screens/AdminProducts';
import UnapprovedFarmers from './Screens/UnapprovedFarmers';
import Farmers from './Screens/Farmers';
import AdminTransaction from './Screens/AdminTransaction';
import AdminWithdrawal from './Screens/AdminWithdrawal';
import CheckOut from './Components/CheckOut';
import AgroFarm from './Screens/AgroFarm';
import AgroFarmOverview from './Screens/AgroFarmOverview';
import AgroFarmProducts from './Screens/AgroFarmProducts';
import AllProducts from './Screens/AllProducts';
import UnapproveProduct from './Screens/UnapproveProduct';
import { useParams, Link, useNavigate } from 'react-router-dom'; // import useNavigate
import { Supabase } from "./config/supabase-config";
import FarmerWithdrawalHistory from './Screens/FarmerWithdrawalHistory';

function App() {

  const navigate = useNavigate(); // initialize navigate


  const [join, setJoin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);


  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await Supabase.auth.getSession();
        if (session) {
            setUser(session.user);
        } else {
            console.log("No active session");
        }
    };
    checkSession();
}, []);


  useEffect(() => {
    // Retrieve user details from localStorage
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
      setLoggedIn(true); // Set as logged in if user details are found
    }
  }, []);
  
  return (
    <div>
      <Routes>

      <Route 
          path="/" 
          element={<Home 
            join={join} 
            loggedIn={loggedIn} 
            userDetails={userDetails} 
          />} 
        />
        <Route path="/buyerLogin" element={<BuyerLogin setJoin={setJoin} setLoggedIn={setLoggedIn} setUserDetails={setUserDetails} />} />

        <Route path='/agroverview' element={<AgroFarmOverview/>} />
        <Route path='/all-products' element={<AllProducts/>} />
        <Route path='/overview/:id' element={<Overview join={join} loggedIn={loggedIn} userDetails={userDetails} />} />

        <Route path='/contact' element={<Contact/>} />
        <Route path='/agrofarm' element={<AgroFarm/>} />
        <Route path='/checkout' element={<CheckOut/>} />
        <Route path='/checkout' element={<CheckOut/>} />
        <Route path='/farmerSignup' element={<FarmerSignUp/>} />
        <Route path='/buyerSignup' element={<BuyerSignup/>} />
        <Route path='/farmerlogin' element={<FarmerLogin/>} />
        {/* <Route path='/buyerlogin' element={<BuyerLogin/>} /> */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/product' element={<Product/>} />
        <Route path='/transaction' element={<Transaction/>} />
        <Route path='/settings' element={<Settings/>} />
        <Route path='/help' element={<Help/>} />
        <Route path='/withdrawal' element={<FarmersWithdrawal/>} />
        <Route path='/farmerswithdrawalhistory' element={<FarmerWithdrawalHistory/>} />


        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/unapproved-product' element={<UnapproveProduct/>} />
        <Route path='/adminproducts' element={<AdminProducts/>} />
        <Route path='/unapprove' element={<UnapprovedFarmers/>} />
        <Route path='/farmers' element={<Farmers/>} />
        <Route path='/admin-transaction' element={<AdminTransaction/>} />
        <Route path='/admin-withdrawal' element={<AdminWithdrawal/>} />
        <Route path='/agrofarmproducts' element={<AgroFarmProducts/>} />


      </Routes>
      
    </div>
  );
}

export default App;
