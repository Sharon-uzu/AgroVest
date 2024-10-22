import React, { useState, useEffect } from "react";
import { Supabase } from "../config/supabase-config";

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bank: "",
    acctNo: "",
    acctName: "",
    cardOption: "",
  });
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // New state for "Done" status

  // Fetch user data on component mount
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
          .select("metadata, fullname, email")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user info:", error);
          return;
        }

        // Populate form with the fetched data
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.metadata?.phone || "",
          address: data.metadata?.address || "",
          bank: data.metadata?.bank || "",
          acctNo: data.metadata?.acctNo || "",
          acctName: data.metadata?.acctName || "",
          cardOption: data.metadata?.cardOption || "",
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Track form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      // Fetch existing metadata
      const { data: existingData, error: fetchError } = await Supabase
        .from("agrovest-main")
        .select("metadata")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching existing metadata:", fetchError.message);
        setLoading(false);
        return;
      }

      // Merge the existing metadata with the updated form data
      const updatedMetadata = {
        ...existingData.metadata, // Spread existing metadata
        phone: formData.phone,
        address: formData.address,
        bank: formData.bank,
        acctNo: formData.acctNo,
        acctName: formData.acctName,
        cardOption: formData.cardOption,
      };

      // Update data in Supabase
      const { error: updateError } = await Supabase
        .from("agrovest-main")
        .update({
          metadata: updatedMetadata,
          fullname: formData.fullname,
          email: formData.email,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating data:", updateError.message);
      } else {
        console.log("User data updated successfully");

        // Show "Done" for 2 seconds
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
      }
    } catch (error) {
      console.error("Error during update:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="settings-form" onSubmit={handleSubmit}>
        <h3>Profile</h3>

        <label htmlFor="fullname">
          <p>Full Name</p>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="email">
          <p>Email Address</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="phone">
          <p>Contact Number</p>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="address">
          <p>Company Address</p>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="bank">
          <p>Bank</p>
          <input
            type="text"
            name="bank"
            value={formData.bank}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="acctNo">
          <p>Account Number</p>
          <input
            type="text"
            name="acctNo"
            value={formData.acctNo}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="acctName">
          <p>Card Holder Name</p>
          <input
            type="text"
            name="acctName"
            value={formData.acctName}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="cardOption">
          <p>Card Option</p>
          <select
            name="cardOption"
            value={formData.cardOption}
            onChange={handleChange}
          >
            <option value="">Select option</option>
            <option value="Debit card">Debit card</option>
            <option value="Credit card">Credit card</option>
          </select>
        </label>

        <div className="btn">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : isUpdated ? "Done!" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
