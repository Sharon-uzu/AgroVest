import React, { useState } from 'react';
import pix from '../Images/pix.png';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { Supabase } from "../config/supabase-config";

const BuyerLogin = ({ setLoggedIn, setUserDetails }) => {
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const [formData, setFormData] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // New state for loading

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
      
        if (Object.keys(errors).length > 0) return;

        setIsLoading(true); // Set loading state to true
      
        try {
          const { data, error } = await Supabase
            .from("agrovest-main")
            .select("*")
            .eq("email", formData.email)
            .eq("password", formData.password)
            .single();
      
          if (error || !data) {
            alert("Incorrect login details or user not found");
            setIsLoading(false); // Reset loading state
            return;
          }
      
          const { metadata } = data;
          const phone = metadata?.phone || "No phone number provided";
          const address = metadata?.address || "No address provided";
      
          const userDetails = {
            name: data.fullname,
            email: data.email,
            phone,
            address,
          };
      
          setLoggedIn(true);
          setUserDetails(userDetails);
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
      
          navigate("/");
        } catch (error) {
          alert("Error during login");
        } finally {
          setIsLoading(false); // Reset loading state
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
                        <Link to='/'><FaArrowLeftLong /></Link>
                    </div>
                    <div className='sign'>
                        <div className='form'>
                            <div className="form-c">
                                <h3>Login</h3>

                                <label htmlFor="email">
                                    <p>Email</p>
                                    <input type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {formErrors.email && <p className='error-text' style={{ color: "red", fontSize: "14px", margin: 0, padding: 0, textAlign: 'start', marginTop: '2px' }}>{formErrors.email}</p>}
                                </label>

                                <label htmlFor="password">
                                    <p>Password</p>
                                    <input type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    {formErrors.password && <p className='error-text' style={{ color: "red", fontSize: "14px", margin: 0, padding: 0, textAlign: 'start', marginTop: '2px' }}>{formErrors.password}</p>}
                                </label>

                                <div className="sign-btn">
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        {isLoading ? "Loading..." : "Login"} {/* Update button text */}
                                    </button>
                                </div>
                                <span>Don't have an account? <Link to="/buyerSignup">Sign Up</Link></span>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BuyerLogin;
