import React,{useState} from 'react'
import pix from '../Images/pix.png'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { Supabase } from "../config/supabase-config";


const FarmerLogin = () => {
    const navigate = useNavigate();

    const login = () => {
        navigate('/dashboard')
      }


      const initialValues = {
        email: "",
        password: "",
      };
    
      const [formData, setFormData] = useState(initialValues);
      const [formErrors, setFormErrors] = useState({});
    
      const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
        if (!values.email) {
          errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
          errors.email = "This is not a valid email";
        }
    
        if (!values.password) {
          errors.password = "Password is required";
        }
    
        return errors;
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errors = validate(formData);
        setFormErrors(errors);
    
        if (Object.keys(errors).length > 0) {
          return; // Stop submission if there are validation errors
        }
    
        try {
          const { data, error } = await Supabase
            .from("agrovest-main")
            .select("*")
            .eq("email", formData.email)
            .eq("password", formData.password)
            .single();
    
          if (error) {
            console.error("Supabase error:", error.message, error.details);
            alert("Error fetching user or incorrect login details");
            return;
          }
    
          if (!data) {
            console.error("User not found");
            alert("User not found");
            return;
          }
    
          // Save user ID to local storage
          localStorage.setItem("userId", data.id);
    
    
          const role = data.role;
          if (role === "farmer") {
            navigate("/dashboard");
          } else if (role === "buyer") {
            navigate("/");
          } else {
            console.error("Unknown role");
            alert("Unknown role");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("Error during login");
        }
      };

  return (
    <div>
    <section className='sign-up'>
        <div className="s-l">
            <img src={pix} alt="" />
        </div>

        <div className="s-r">
            <div className="arr">
                <Link to='/'><FaArrowLeftLong/></Link>
            </div>
            <div className='sign'>
                <form className='form'>
                    <div className="form-c">
                        <h3>Login</h3>

                        <label htmlFor="email">
                            <p>Email</p>
                            <input type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        {formErrors.email && <p className='error-text' style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.email}</p>}
            
                        </label>

                        <label htmlFor="password">
                            <p>Password</p>
                            <input type="password" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                         
                        {formErrors.password && <p className='error-text' style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.password}</p>}
            
                        </label>

                        <div className="sign-btn">
                            <button type="submit"  onClick={handleSubmit}>Login</button>
                        </div>
                        <span>Don't have an account? <Link to="/farmerSignup">Sign Up</Link></span>

                    </div>
                </form>
            </div>
            
        </div>
    </section>
</div>
)
}

export default FarmerLogin