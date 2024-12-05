import React, { useState, useEffect } from "react";
import pix from "../Images/pix.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Supabase } from "../config/supabase-config";

const FarmerSignUp = () => {
  const navigate = useNavigate();

  const initialValues = {
    fullname: "",
    email: "",
    role: "farmer",
    phone: "",
    address: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage button loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true); // Start loading state
      try {
        const { data, error } = await Supabase
          .from("agrovest-main")
          .select("email")
          .eq("email", formData.email)
          .single();

        if (data) {
          alert("Email already registered");
          setIsLoading(false); // Stop loading state
          return;
        }

        if (error && error.code !== "PGRST116") {
          console.error("Error checking email:", error);
          setIsLoading(false); // Stop loading state
          return;
        }

        const response = await Supabase.from("agrovest-main").upsert([
          {
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            metadata: formData,
            role: "farmer",
          },
        ]);

        if (response.error) {
          throw response.error;
        }

        navigate("/login");
      } catch (error) {
        console.error("Error during signup:", error);
      } finally {
        setIsLoading(false); // Stop loading state
      }
    }
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formData);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.fullname) errors.fullname = "Full name is required";
    if (!values.email) errors.email = "Email is required";
    else if (!emailRegex.test(values.email)) errors.email = "Invalid email format";
    if (!values.phone) errors.phone = "Phone number is required";
    if (!values.address) errors.address = "Address is required";
    if (!values.password) errors.password = "Password is required";

    return errors;
  };

  return (
    <div>
      <section className="sign-up">
        <div className="s-l">
          <img src={pix} alt="Signup" />
        </div>

        <div className="s-r">
          <div className="arr">
            <Link to="/">
              <FaArrowLeftLong />
            </Link>
          </div>

          <div className="sign">
            <div className="form">
              <div className="form-c">
                <h3>Create an Account</h3>

                {/* Full Name */}
                <label>
                  <p>Full Name/Farm Name</p>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                  />
                  {formErrors.fullname && (
                    <p style={{color:'red', fontSize:'14px'}} className="error-text">{formErrors.fullname}</p>
                  )}
                </label>

                {/* Email */}
                <label>
                  <p>Email</p>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {formErrors.email && (
                    <p style={{color:'red', fontSize:'14px'}} className="error-text">{formErrors.email}</p>
                  )}
                </label>

                {/* Address */}
                <label>
                  <p>Location</p>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  {formErrors.address && (
                    <p style={{color:'red', fontSize:'14px'}} className="error-text">{formErrors.address}</p>
                  )}
                </label>

                {/* Phone Number */}
                <label>
                  <p>Phone Number</p>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {formErrors.phone && (
                    <p style={{color:'red', fontSize:'14px'}} className="error-text">{formErrors.phone}</p>
                  )}
                </label>

                {/* Password */}
                <label>
                  <p>Password</p>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {formErrors.password && (
                    <p style={{color:'red', fontSize:'14px'}} className="error-text">{formErrors.password}</p>
                  )}
                </label>

                <div className="sign-btn">
                  <button type="submit" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Create Account"}
                  </button>
                </div>
                <span>
                  Already have an account? <Link to="/login">Login</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmerSignUp;
