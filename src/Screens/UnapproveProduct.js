import React, { useState, useEffect } from 'react';
import AdminSidebar from '../Components/AdminSidebar';
import Header2 from '../Components/Header2';
import Modal from "react-modal";
import { Supabase } from "../config/supabase-config";

const UnapproveProduct = () => {

    const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Store image URL

  const toggleModal1 = () => {
    setIsModalOpen1(!isModalOpen1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen1(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    const imagePath = product.metadata?.image;
    if (imagePath) {
      fetchImage(imagePath); // Fetch the image URL using the image path
    } else {
      console.error("Image path not found in metadata");
    }
    setIsModalOpen1(true);
  };

  const fetchImage = async (imageName) => {
    try {
      const { data, error } = await Supabase
        .storage
        .from('agrovest-product-images') // Bucket name
        .getPublicUrl(imageName); // Pass the image name

      if (error) {
        console.error("Error fetching image:", error.message);
      } else {
        if (data.publicUrl) {
          setImageUrl(data.publicUrl); // Set the public URL for the image
        } else {
          console.error("Public URL not found");
        }
      }
    } catch (error) {
      console.error("Error fetching image:", error.message);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data, error } = await Supabase
          .from("agrovest-products")
          .select("*")
        //   .eq("role", "farmer")
        .or('state.is.null, state.eq.suspend');;

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setProductData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleApprove = async (productId) => {
    try {
      const { data, error } = await Supabase
        .from("agrovest-products")
        .update({ state: "approved" })
        .eq("id", productId);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      alert(`Product with ID ${productId} approved successfully.`);
      setProductData((prevData) => prevData.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <AdminSidebar />
        <main>
          <Header2 title='Unapproved Farmers' />

          <section className='left prod'>
            <div className="tabb">
              <table>
                <tr className='heading'>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th className='dt'></th>
                  <th className='dt'></th>
                </tr>

                {productData.map((product) => (
                  <tr style={{ cursor: 'pointer' }} key={product.id}>
                    <td>{product.productname}</td>
                    <td>{product.price}</td>
                    <td className='dt' onClick={() => openModal(product)}><button>View</button></td>
                    <td className='dt'><button onClick={() => handleApprove(product.id)}>Approve</button></td>
                  </tr>
                ))}
              </table>
            </div>

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
              <div className='modal1'>
                <div className='modal1-content'>
                  <div className='close'>
                    <button onClick={() => setIsModalOpen1(false)} style={{ cursor: 'pointer' }}>X</button>
                  </div>

                  {selectedProduct && (
                    <section className='product-info'>
                      <div className='product-images'>
                        {imageUrl ? (
                          <img src={imageUrl} alt="Uploaded file" />
                        ) : (
                          <p>Image not available</p>
                        )}
                      </div>

                      <div className='others'>
                        <p>Product Name: <span>{selectedProduct.productname}</span></p>
                        <p>Price: <span>{selectedProduct.metadata.price}</span></p>
                        <p>Availability: <span>{selectedProduct.metadata.availability}</span></p>
                        <p>Preservative: <span>{selectedProduct.metadata.preservative}</span></p>
                        <p>Description: <span>{selectedProduct.metadata.description}</span></p>
                        <p>Quantity: <span>{selectedProduct.metadata.quantity}</span></p>
                        <p>Location: <span>{selectedProduct.metadata.location}</span></p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </Modal>
          </section>
        </main>
      </section>
    </div>
  )
}

export default UnapproveProduct