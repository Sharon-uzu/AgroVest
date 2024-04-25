import './App.css';
import Home from './Screens/Home';
import { Route, Routes } from 'react-router-dom';
import Overview from './Screens/Overview';
import Contact from './Screens/Contact';
import FarmerSignUp from './Screens/FarmerSignUp';
import SellerSignup from './Screens/SellerSignup';

function App() {
  return (
    <div>
      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/overview' element={<Overview/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/farmerSignup' element={<FarmerSignUp/>} />
        <Route path='/sellerSignup' element={<SellerSignup/>} />

      </Routes>
      
    </div>
  );
}

export default App;
