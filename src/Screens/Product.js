import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import Modal from "react-modal";
import { Supabase } from "../config/supabase-config"; // Import Supabase

const Product = () => {


  // modal starts here

  const [selectedProduct, setSelectedProduct] = useState(null); // To store selected product data
  const [updatedData, setUpdatedData] = useState({}); // To store edited data
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const toggleModal1 = (product = null) => {
    if (product) {
      // When opening the modal for editing, prefill the state with product data
      setSelectedProduct(product);
      setUpdatedData({
        productname: product.productname || "",
        location: product.metadata.location || "",
        price: product.metadata.price || "",
        quantity: product.metadata.quantity || "",
        availability: product.metadata.availability || "",
        image: product.metadata.image || "",
      });
    } else {
      // When closing the modal or opening for a new product, reset the state
      setUpdatedData({
        productname: "",
        location: "",
        price: "",
        quantity: "",
        availability: "",
        image: "",
      });
      setSelectedProduct(null);
    }
    
    setIsModalOpen1(!!product); // Toggle the modal open/close
  };
  


  // modal ends here


  const [see, setSee] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [done, setDone] = useState(false); // Done state
  const [formData, setFormData] = useState({
    userid: "",
    farmers_name: "", // Initialize fullname in formData
    productname: "",
    availability: "",
    preservative: "",
    description: "",
    price: "",
    quantity: "",
    location: "",
    image: "",
    farmerstatus: "",
    state: "Pending"
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Add this ref
  const [products, setProducts] = useState([]); // State to store products


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
        setFormData((prevFormData) => ({
          ...prevFormData,
          userid: data.id,
          farmers_name: data.fullname, // Set fullname in formData
          farmerstatus: data.status || "Not Verified",
        }));

        fetchUserProducts(data.id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchUserProducts = async (userId) => {
      try {
        const { data: productsData, error } = await Supabase
          .from('agrovest-products')
          .select('*')
          .eq('userid', userId);

        if (!error) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchUserInfo();
  }, []);


  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
 
  // const toggle = () => {
  //   setSee(true);
  //   setLess(false);
  // };

  const toggleSeeAll = () => {
    setSee(!see);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (event) => {
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
  
    try {
      const { data, error } = await Supabase
        .storage
        .from('agrovest-product-images')
        .upload(filePath, file);
  
      if (error) {
        throw error;
      }
  
      // Set the image path correctly in formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: data.path || data.Key,
      }));
  
      // Clear the image error after successful upload
      setFormErrors((prevErrors) => ({ ...prevErrors, image: "" }));
  
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setFormErrors({ image: "Error uploading image" });
    } finally {
      setUploading(false);
    }
  };


  // image edit

  const handleEditFileChange = async (event) => {
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
  
    try {
      const { data, error } = await Supabase
        .storage
        .from('agrovest-product-images')
        .upload(filePath, file);
  
      if (error) {
        throw error;
      }
  
      // Set the new image path in updatedData
      setUpdatedData((prevData) => ({
        ...prevData,
        image: data.path || data.Key,
      }));
  
      setFormErrors((prevErrors) => ({ ...prevErrors, image: "" }));
  
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setFormErrors({ image: "Error uploading image" });
    } finally {
      setUploading(false);
    }
  };
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (uploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }
  
    setFormErrors(validate(formData));
  
    if (Object.keys(formErrors).length === 0) {
      setLoading(true); // Start loading
      try {
        const { error } = await Supabase.from("agrovest-products").upsert([
          {
            userid: formData.userid,
            farmers_name: formData.farmers_name, // Explicitly set farmers_name here
            productname: formData.productname,
            farmerstatus: formData.farmerstatus,
            image: formData.image,
            availability: formData.availability,
            state: formData.state,
            metadata: formData,
          },
        ]);
  
        if (error) {
          console.error('Error submitting form:', error.message);
          alert('Failed to upload product. Please try again.');
          setLoading(false); // Reset loading
          return;
        }
  
        // Simulate a short delay for user experience
        setTimeout(() => {
          setLoading(false); // End loading
          setDone(true); // Show done state
  
          setTimeout(() => {
            alert("Product uploaded successfully!"); // Show alert
            window.location.reload(); // Refresh the page
          }, 1000); // Delay for user to see "Done" state
        }, 1000);
      } catch (error) {
        console.error('Error submitting form:', error.message);
        alert('An unexpected error occurred. Please try again.');
        setLoading(false); // Reset loading
      }
    }
  };
  

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await Supabase
          .from("agrovest-products")
          .delete()
          .eq("id", productId);
  
        if (error) {
          console.error("Error deleting product:", error);
          alert("Failed to delete product. Please try again.");
          return;
        }
  
        alert("Product deleted successfully.");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        ); // Update the products state to remove the deleted product
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  

  const getInitials = (fullname) => {
    if (!fullname) return '';
    return fullname
      .split(' ') // Split full name by spaces into an array of words
      .map(word => word[0].toUpperCase()) // Get the first letter of each word and convert to uppercase
      .join(''); // Join the initials together
  };
  

  const validate = (values) => {
    const errors = {};
    if (!values.productname) errors.productname = "Product name is required";
    if (!values.availability) errors.availability = "Select availability";
    if (!values.preservative) errors.preservative = "Preservative is required";
    if (!values.description) errors.description = "Please describe your product";
    if (!values.price) errors.price = "Price is required";
    if (!values.image) errors.image = "Image is required";
    if (!values.quantity) errors.quantity = "Quantity is required";
    if (!values.location) errors.location = "Location is required";
    return errors;
  };

  // if (!userInfo) {
  //   return <div>Loading...</div>;
  // }

  if (!userInfo) {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );
}



  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    const dataToUpdate = { ...updatedData };
  
    try {
      const { error } = await Supabase
        .from('agrovest-products')
        .update({
          productname: dataToUpdate.productname, // Make sure the productname is included
          availability: dataToUpdate.availability,
          metadata: { ...selectedProduct.metadata, ...dataToUpdate },
        })
        .eq('id', selectedProduct.id);
  
      if (error) {
        console.error('Error updating product:', error);
      } else {
        alert("Product updated successfully");
        setIsModalOpen1(false);
        setUpdatedData({});
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  
  

  const getVerificationStatus = () => {
    if (!userInfo || userInfo.status === null) {
      return { status: "Not Verified!", color: "red" };
    } else if (userInfo.status === "verified") {
      return { status: "Verified!", color: "green" };
    } else if (userInfo.status === "suspended") {
      return { status: "Suspended!", color: "orange" };
    }
    return { status: "Not Verified!", color: "red" };
  };

  const { status, color } = getVerificationStatus();

  const displayedProducts = see ? products : products.slice(0, 3);



  // Check if user is verified
  if (userInfo?.status !== "verified") {
    return (
      <div className='dashb'>
        <section className='dashboard'>
          <Sidebar name={userInfo?.fullname} />
          <main>
            <Header2 title='Products' status={status} statusColor={color} />
            <section className='left prod'>
              <h2>Your account is not verified</h2>
              <p>Please go to the settings page and verify your account before uploading products.</p>
            </section>
          </main>
        </section>
      </div>
    );
  }


  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)} />
        <main>
        <Header2 title='Products' status={status} statusColor={color} />
          <section className='left prod'>
            <h2>Recent Products {/* "See All" button logic */}
              {products.length > 3 && !see && (
                <span onClick={toggleSeeAll} className="see-all-button">
                  See All
                </span>
              )}</h2>
            <div className="products">
              
              {products.length > 0 ? (
                displayedProducts.map((product) => {
                  const imageUrl = product.metadata.image
                    ? `https://wgfidvtzcblzcnstkyae.supabase.co/storage/v1/object/public/agrovest-product-images/${product.metadata.image}`
                    : 'default-image-url'; // Fallback if no image
                
                  const statusColor = 
                    product.state === "Approved" ? "green" :
                    product.state === "Rejected" ? "red" : 
                    "orange"; // Pending
                
                  return (
                    <div className="prod1" key={product.id}>
                      <img src={imageUrl} alt={product.productname} />
                      
                      <div className="txt">
                        <div className="del">
                          <p style={{ color: statusColor }}>{product.state}</p>
                          <span onClick={() => handleDeleteProduct(product.id)} style={{ cursor: "pointer", color: "red" }}>
                            Delete
                          </span>
                        </div>
                        <h4>{product.productname}  <p>₦{product.metadata?.price}</p></h4>                     
                        <h6 style={{ color: product.metadata.availability === "Out-of-stock" ? 'red' : 'green' }}>
                          {product.metadata.availability}

                          <span onClick={() => toggleModal1(product)}>Edit</span>
                          
                        </h6>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No products found.</p>
              )}

              

            </div>
            
            <h3>Add New Products</h3>
            <div className='form'>
              <div className="f-c">
                <div className='n-input'>
                  <input
                    type="text"
                    name='productname'
                    placeholder='Product Name'
                    value={formData.productname}
                    onChange={handleChange}
                  />
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.productname}</p>
                </div>
                <div className='n-input'>
                  <input
                    type="text"
                    name='location'
                    placeholder='Location'
                    value={formData.location}
                    onChange={handleChange}
                  />
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.location}</p>
                </div>
                <div className='n-input'>
                  <input
                    type="number"
                    name='price'
                    placeholder='Price per unit(₦) e.g 200'
                    value={formData.price}
                    onChange={handleChange}
                  />
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.price}</p>
                </div>
                <div className='n-input'>
                  <input
                    type="text"
                    name='quantity'
                    placeholder='Quantity e.g 2 bags'
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.quantity}</p>
                </div>
                <div className='n-input'>
                  <select
                    name='preservative'
                    value={formData.preservative}
                    onChange={handleChange}>
                    <option value={null}>Preservative?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.preservative}</p>
                </div>
                <div className='n-input'>
                  <select
                    name='availability'
                    value={formData.availability}
                    onChange={handleChange}>
                    <option value={null}>Availability?</option>
                    <option value="In-stock">In-stock</option>
                    <option value="Out-of-stock">Out-of-stock</option>
                  </select>
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.availability}</p>
                </div>
                <div className='n-input'>
                  <input type="file" name="image" onChange={handleFileChange} ref={fileInputRef} />
                  {uploading && <p>Uploading...</p>}
                  {formErrors.image && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.image}</p>}
                </div>
                <div className='n-input text-a'>
                  <textarea
                    name='description'
                    placeholder='Description'
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <p style={{ color: "red", fontSize: "14px" }}>{formErrors.description}</p>
                </div>
                <div className="p-btn">
                  <button type="submit" disabled={loading} onClick={handleSubmit}>
                    {loading ? "Loading..." : done ? "Done" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Modal
              isOpen={isModalOpen1}
              onRequestClose={toggleModal1}
              contentLabel="Example Modal"
              className={`bg-transparnt`}
              style={{
                overlay: {
                  position: "fixed",
                  top: "0",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "hsla(0, 0%, 0%, .8)",
                  zIndex: 100000,
                },
              }}
            >
              {selectedProduct && (
                <div className='modal1'>
                  <div className='modal1-content'>
                    <div className='close'>
                      <button onClick={() => setIsModalOpen1(false)} style={{ cursor: 'pointer' }}>X</button>
                    </div>
                    <h3>Edit Product</h3>
                    <div className='form'>
                      <div className="f-c">
                        <div className='n-input'>
                        <input
                            type="text"
                            name='productname'
                            placeholder='Product name'
                            value={updatedData.productname}
                            onChange={handleUpdateChange}
                          />
                        </div>
                        <div className='n-input'>
                          <input
                            type="text"
                            name='location'
                            placeholder='Location'
                            value={updatedData.location}
                            onChange={handleUpdateChange}
                          />
                        </div>
                        <div className='n-input'>
                          <input
                            type="text"
                            name='price'
                            placeholder='Price per unit'
                            value={updatedData.price}
                            onChange={handleUpdateChange}
                          />
                        </div>
                        <div className='n-input'>
                          <input
                            type="text"
                            name='quantity'
                            placeholder='quantity'
                            value={updatedData.quantity}
                            onChange={handleUpdateChange}
                          />
                        </div>
                        <div className='n-input'>
                          <select
                            name='availability'
                            value={updatedData.availability}
                            onChange={handleUpdateChange}>
                            <option value="In-stock">In-stock</option>
                            <option value="Out-of-stock">Out-of-stock</option>
                          </select>
                        </div>
                        

                        {/* <div className='n-input'>
                          <input
                            type="text"
                            name='quantity'
                            placeholder='quantity'
                            value={updatedData.quantity || selectedProduct.metadata.quantity}
                            onChange={handleUpdateChange}
                          />
                        </div> */}

                        {/* <div className='n-input'>
                          
                          <input
                            type="text"
                            name='availability'
                            placeholder='availability'
                            value={updatedData.availability || selectedProduct.metadata.availability}
                            onChange={handleUpdateChange}
                          />
                        </div> */}
                        {/* Image Editing */}
                      <div className='n-input'>
                        <input 
                          type="file" 
                          name="image" 
                          onChange={handleEditFileChange} 
                          ref={fileInputRef} 
                        />
                        {uploading && <p>Uploading...</p>}
                        {formErrors.image && <p style={{ color: "red", fontSize: "14px" }}>{formErrors.image}</p>}
                      </div>
                      <div className="p-btn">
                        <button type="submit" onClick={handleUpdateSubmit}>
                          {loading ? "Updating..." : "Update Product"}
                        </button>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal>
        </main>
      </section>
    </div>
  );
};

export default Product;

