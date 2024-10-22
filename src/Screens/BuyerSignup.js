import React,{useState, useEffect} from 'react'
import pix from '../Images/pix.png'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { Supabase } from "../config/supabase-config";


const BuyerSignup = () => {

    const navigate = useNavigate();

    const login = () => {
        navigate('/buyerlogin')
      }

      const initialValues = {
        fullname: "",
        email: "",
        role: "buyer",
        phone: "",
        address: "",
        password: "",
        
      };

      const [formData, setFormData] = useState(initialValues);

    const [formErrors, setFormErrors] = useState({});

    const [isSubmit, setIsSubmit] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent page reload on form submission
      const errors = validate(formData);
      setFormErrors(errors);
      setIsSubmit(true);
    
      if (Object.keys(errors).length === 0) {
        // Check if the email already exists
        const { data, error } = await Supabase
          .from("agrovest-main")
          .select("email")
          .eq("email", formData.email)
          .single();
    
        if (data) {
          alert("Email already registered");
          return; // Stop if email is already in use
        }
    
        if (error && error.code !== 'PGRST116') {
          // Handle error except 'PGRST116' which means no row found
          console.error("Error checking email:", error);
          return;
        }
    
        // Proceed with user registration if email is not found
        Supabase.from("agrovest-main")
          .upsert([
            {
              fullname: formData.fullname,
              email: formData.email,
              password: formData.password,
              metadata: formData,
              role: "buyer",
            },
          ])
          .then((response) => {
            console.log(response);
            navigate("/buyerlogin");
          })
          .catch((error) => {
            console.error("Error during signup:", error);
          });
      }
    };
    
    
      useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
          console.log(formData);
        }
      }, [formErrors]);
    

      const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if (!values.fullname) {
          errors.fullname = "Full name is required";
        } else if (!values.phone) {
          errors.phone = "Phone number is required";
        } else if (!values.email) {
          errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
          errors.email = "This is not a valid email";
        } else if (!values.address) {
          errors.address = "Fill in your address";
        }else if (!values.password) {
            errors.password = "Password is required";
          }
          // else{
          //   Supabase.from("agrovest-main")
          //       .upsert([
          //         {
          //           fullname: formData.fullname,
          //           email: formData.email,
          //           password: formData.password,
          //           metadata: formData,
          //           role:'buyer'
          //         },
          //       ])
          //       .then((response) => {
          //         console.log(response);
          //         navigate("/buyerlogin");
          //       });
          //         }
            return errors;
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
                    <div className='form'>
                        <div className="form-c">
                            <h3>Create an Account</h3>
                            <label htmlFor="name">
                                <p>Full Name</p>
                                <input type="text" 
                                value={formData.fullname}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    fullname: e.target.value,
                                  });
                                }}/>
                                <p style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.fullname}</p>

                            </label>


                            <label htmlFor="name">
                                <p>Email</p>
                                <input type="email" 
                                value={formData.email}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    email: e.target.value,
                                  });
                                }}/>
                                <p style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.email}</p>

                            </label>


                            <label htmlFor="name">
                                <p>Phone Number</p>
                                <input type="tel" 
                                value={formData.phone}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                  });
                                }}/>
                                <p style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.phone}</p>

                            </label>

                            <label htmlFor="name">
                                <p>Location</p>
                                <input type="text" 
                                value={formData.address}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    address: e.target.value,
                                  });
                                }}/>
                                <p style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.address}</p>

                            </label>

                            <label htmlFor="name">
                                <p>Password</p>
                                <input type="password" 
                                value={formData.password}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    password: e.target.value,
                                  });
                                }}/>
                                <p style={{ color: "red", fontSize: "14px", margin:0, padding:0, textAlign:'start', marginTop:'2px' }}>{formErrors.password}</p>

                            </label>

                            <div className="sign-btn">
                                <button type="submit" onClick={handleSubmit}>Create Account</button>
                            </div>
                            <span>Already have an account? <Link to="/buyerlogin">Login</Link></span>

                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    </div>
  )
}

export default BuyerSignup