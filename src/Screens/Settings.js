import React, { useState, useEffect } from "react";
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import { Supabase } from "../config/supabase-config";
import SettingsForm from "./SettingsForm";

const Settings = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    cardOption: "",
    image: "",
    acctNo: "",
    bank: "",
    acctName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFormErrors({ image: "Please select a file" });
      return;
    }

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFileTypes.includes(file.type)) {
      setFormErrors({ image: "Only image files (PNG, JPEG) are allowed" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    Supabase.storage
      .from('farmersIDImage')
      .upload(filePath, file)
      .then(({ error, data }) => {
        if (error) {
          throw error;
        }
        setFormData({ ...formData, image: data.Key || data.path });
        setFormErrors({ image: "" });
      })
      .catch((error) => {
        console.error('Error uploading file:', error.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) {
      setIsSubmit(false);
      return;
    }

    setIsSubmit(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found. Cannot update user info.");
      return;
    }

    try {
      const { data: existingUser, error: fetchError } = await Supabase
        .from("agrovest-main")
        .select("metadata")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching existing metadata:", fetchError.message);
        return;
      }

      const currentMetadata = existingUser.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        cardOption: formData.cardOption,
        image: formData.image,
        acctNo: formData.acctNo,
        bank: formData.bank,
        acctName: formData.acctName,
        formCompleted: true,
        status: 'pending'
      };

      const { error: updateError } = await Supabase
        .from("agrovest-main")
        .update({ metadata: updatedMetadata })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating metadata:", updateError.message);
      } else {
        setUserInfo({ ...userInfo, status: 'pending' }); // Update status to 'pending' immediately
      }
    } catch (error) {
      console.error("Error during metadata update:", error.message);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.cardOption) errors.cardOption = "Card option is required";
    if (!values.acctNo) errors.acctNo = "Account number is required";
    if (!values.bank) errors.bank = "Bank name is required";
    if (!values.acctName) errors.acctName = "Account name is required";
    if (!values.image) errors.image = "Image is required";
    return errors;
  };

  const getInitials = (fullname) => {
    if (!fullname) return '';
    return fullname.split(' ').map(word => word[0].toUpperCase()).join('');
  };

  const getVerificationStatus = () => {
    if (!userInfo || userInfo.status === null) {
      return { status: "Not Verified!", color: "red" };
    } else if (userInfo.status === "verified") {
      return { status: "Verified!", color: "green" };
    } else if (userInfo.status === "pending") {
      return { status: "Pending Verification", color: "orange" };
    } else if (userInfo.status === "suspended") {
      return { status: "Suspended!", color: "red" };
    }
    return { status: "Not Verified!", color: "red" };
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const { status, color } = getVerificationStatus(); // Get status and color

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)} />
        <main>
          <Header2 title='Profile' status={status} statusColor={color} />
          <section className='left earnings'>
            {userInfo.status !== "verified" && userInfo.status !== "pending" ? (
              <form className='settings-form auth'>
                <h3 style={{ color: 'red' }}>Authentication</h3>
                <label htmlFor="identification">
                  <p>Upload means of identification</p>
                  <input type="file" name="image" onChange={handleFileChange} />
                  {uploading && <p>Uploading...</p>}
                  {formErrors.image && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.image}</p>}
                </label>
                <label htmlFor="cardOption">
                  <p>Select Card option</p>
                  <select id="cardOption" name="cardOption" value={formData.cardOption} onChange={handleChange}>
                    <option value="">Select option</option>
                    <option value="Debit card">Debit card</option>
                    <option value="Credit card">Credit card</option>
                  </select>
                  {formErrors.cardOption && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.cardOption}</p>}
                </label>
                <label htmlFor="acctNo">
                  <p>Account Number</p>
                  <input type="text" name="acctNo" value={formData.acctNo} onChange={handleChange} />
                  {formErrors.acctNo && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.acctNo}</p>}
                </label>
                <label htmlFor="bank">
                  <p>Bank</p>
                  <input type="text" name="bank" value={formData.bank} onChange={handleChange} />
                  {formErrors.bank && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.bank}</p>}
                </label>
                <label htmlFor="acctName">
                  <p>Account Holder's Name</p>
                  <input type="text" name="acctName" value={formData.acctName} onChange={handleChange} />
                  {formErrors.acctName && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.acctName}</p>}
                </label>
                <div className="btn">
                  <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            ) : (
              userInfo.status === "pending" && (
                <p className="ver">Your verification form has already been submitted, please wait for it to be confirmed. Thank you!</p>
              )
            )}

            {userInfo.status === "verified" && (
              <SettingsForm/>
            )}
          </section>
        </main>
      </section>
    </div>
  );
};

export default Settings;
