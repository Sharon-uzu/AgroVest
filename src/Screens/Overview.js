import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { Supabase } from "../config/supabase-config"; 
import Modal from "react-modal";
import { IoIosArrowBack } from "react-icons/io";
import { PaystackButton } from "react-paystack";

const Overview = (props) => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Track loading state for user details
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    email: '',
    location: ''
  });
  const [formError, setFormError] = useState('');
  const [showProceedButton, setShowProceedButton] = useState(false);

  const navigate = useNavigate();

  // Fetch user details and check authentication
  useEffect(() => {
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    } else {
      console.log("User not logged in");
      navigate('/buyerLogin'); 
    }

    const fetchUser = async () => {
      const { data: { user } } = await Supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);


  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data, error } = await Supabase
          .from('agrovest-products')
          .select('*') // Make sure `farmers_name` is part of the selection
          .eq('id', id)
          .single();
        if (error) throw error;
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading || loadingUser) return <div>Loading...</div>; // Show loading state until both product and user details are fetched
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  const price = parseFloat(product.metadata.price);
  const maxQuantity = parseInt(product.metadata.quantity, 10) || 1;
  const serviceCharge = price * 0.07 * quantity;
  const total = (price * quantity) + serviceCharge ;

  const handleIncreaseQuantity = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
    else alert(`Maximum available quantity is ${maxQuantity}`);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
    else alert('Quantity cannot be less than 1');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { cardHolderName, cardNumber, email, location } = formData;
    if (!cardHolderName || !cardNumber || !email || !location) {
      setFormError("Please fill in all fields.");
      return false;
    }
    setFormError('');
    return true;
  };

  const handlePayNow = () => {
    if (!userDetails && !user) {
      alert("Please log in or sign up to proceed with payment.");
      navigate('/buyerLogin'); // Redirect to login if user is not logged in
      return;
    }
    
    if (validateForm()) {
      setShowProceedButton(true); // Show "Proceed with Payment" button
    }
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      const userEmail = userDetails?.email || user?.email;
      if (!userEmail) {
        alert("User email is not available. Please log in again.");
        navigate('/buyerLogin');
        return;
      }
  
      const subtotal = price * quantity;
  
      const transactionData = {
        product_name: product.productname,
        farmers_id: product.userid,
        farmers_name: product.farmers_name,
        user_email: userEmail,
        email: formData.email,
        price,
        quantity,
        subtotal,
        total: total,
        cardholder: formData.cardHolderName,
        location: formData.location,
      };
  
      const { error: insertError } = await Supabase.from('agrovest-transactions').insert([transactionData]);
  
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert(`An error occurred: ${insertError.message || JSON.stringify(insertError)}`);
        return;
      }
  
      const { data: farmerData, error: balanceError } = await Supabase
        .from('agrovest-main')
        .select('balance')
        .eq('id', product.userid)
        .single();
  
      if (balanceError) {
        console.error("Error fetching balance:", balanceError);
        alert(`An error occurred while fetching balance: ${balanceError.message || JSON.stringify(balanceError)}`);
        return;
      }
  
      const newBalance = (farmerData?.balance || 0) + subtotal;
  
      const { error: updateError } = await Supabase
        .from('agrovest-main')
        .update({ balance: newBalance })
        .eq('id', product.userid);
  
      if (updateError) {
        console.error("Error updating balance:", updateError);
        alert(`An error occurred while updating balance: ${updateError.message || JSON.stringify(updateError)}`);
        return;
      }
  
      // Fetch the current quantity as a string (e.g., "4 bags")
      const { data: productData, error: fetchProductError } = await Supabase
        .from('agrovest-products')
        .select('metadata')
        .eq('id', id)
        .single();
  
      if (fetchProductError) {
        console.error("Error fetching product metadata:", fetchProductError);
        alert(`An error occurred while fetching product data: ${fetchProductError.message || JSON.stringify(fetchProductError)}`);
        return;
      }
  
      // Extract numeric part from the quantity string (e.g., "4 bags" => 4)
      const quantityText = productData.metadata.quantity;
      const numericQuantity = parseInt(quantityText, 10);
      const updatedQuantity = numericQuantity - quantity;
  
      if (updatedQuantity < 0) {
        alert("The requested quantity exceeds the available stock.");
        return;
      }
  
      // Reconstruct the quantity string (e.g., "2 bags")
      const updatedQuantityText = `${updatedQuantity} bags`;
  
      // Update the metadata with the new quantity string
      const updatedMetadata = {
        ...productData.metadata,
        quantity: updatedQuantityText,
        availability: updatedQuantity === 0 ? "Out-of-stock" : productData.metadata.availability
      };
  
      const updates = {
        metadata: updatedMetadata,
        availability: updatedQuantity === 0 ? "Out-of-stock" : product.availability
      };
  
      const { error: quantityUpdateError } = await Supabase
        .from('agrovest-products')
        .update(updates)
        .eq('id', id);
  
      if (quantityUpdateError) {
        console.error("Error updating quantity and availability:", quantityUpdateError);
        alert(`An error occurred while updating product quantity and availability: ${quantityUpdateError.message || JSON.stringify(quantityUpdateError)}`);
        return;
      }
  
      alert("Payment successful, balance updated, and quantity adjusted!");
      toggleModal();
      navigate('/');
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`An unexpected error occurred: ${error.message || JSON.stringify(error)}`);
    }
  };
  



  
  
  
  

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: total * 100,
    publicKey: 'pk_test_feacfe729a41f0f42a843984ce50c631705e805b',
  };

  // Modal toggle
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className='p-o'>
      <div className="arr">
        <Link to='/'><IoIosArrowBack className='arr-i'/>Back</Link>
      </div>
      <section className='overview'>
        <h2>{product.productname} - Product Overview</h2>
        <div className="img">
          <img src={`https://wgfidvtzcblzcnstkyae.supabase.co/storage/v1/object/public/agrovest-product-images/${product.image}`} alt={product.productname} />
        </div>
        <div className="overview-c">
          <p>Product: <span>{product.productname}</span></p>
          <p>Place of Production: <span>{product.metadata.location}</span></p>
          <p>Availability: <span>{product.availability}</span></p>
          <p>Quantity: <span>{maxQuantity} bags</span></p>
          <p>Preservative: <span>{product.metadata.preservative}</span></p>
          <h4>Summary</h4>
          <h5>{product.metadata.description}</h5>
          <div className="quan-price">
            <div className="quan">
              <h5>₦{(price * quantity).toFixed(2)}</h5> 
              <span className='cal'>
                <span onClick={handleDecreaseQuantity}>-</span>
                <span>{quantity}</span>
                <span onClick={handleIncreaseQuantity}>+</span>
              </span>
            </div>
          </div>
          <div className="buttons">
            <button onClick={toggleModal}>Buy Now</button>
          </div>
        </div>
      </section>
      
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Payment Modal"
        overlayClassName="modal-overlay"
        className="two"
        style={{
          overlay: {
            width: '100%',
            position: "fixed",
            top: "0px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200000000000,
            backgroundColor: "hsl(0, 0%, 0%, .6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <section className='bill'>
          <div className='checkout-section'>
            <div className="close-check">
              <button onClick={toggleModal}>x</button>
            </div>
            <div className="checkout">
              <div className="check">
                <h2>Payment Method</h2>
                <div className='formm'>
                  <select name="paymentMethod" onChange={handleChange}>
                    <option value="debit">Debit card</option>
                    <option value="credit">Credit card</option>
                  </select>
                  <input type="text" name="cardHolderName" placeholder='Card Holder Name' onChange={handleChange} />
                  <input type="text" name="cardNumber" placeholder='Card number' onChange={handleChange} />
                  <input type="email" name="email" placeholder='Email' onChange={handleChange} />
                  <input type="text" name="location" placeholder='Location' onChange={handleChange} />
                  
                  {formError && <p style={{ color: 'red' }}>{formError}</p>}
                  
                  <div>
                    <h4>Sub Total</h4>
                    <h4><span>₦{(price * quantity).toFixed(2)}</span></h4>
                  </div>
                  
                  <div>
                    <h4>VAT</h4>
                    <h4>₦{serviceCharge.toFixed(2)}</h4>
                  </div>
                  <div>
                    <h3>Total</h3>
                    <h3>₦{total.toFixed(2)}</h3>
                  </div>
                  
                  {!showProceedButton ? (
                    <button type="button" onClick={handlePayNow}>Pay Now</button>
                  ) : (
                    <PaystackButton 
                      {...paystackConfig} 
                      text="Proceed with Payment"
                      onSuccess={handlePaymentSuccess}
                      onClose={() => alert("Payment was not completed.")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal>
    </div>
  );
};

export default Overview;
