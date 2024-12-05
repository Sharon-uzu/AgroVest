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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    const imagePath = product.metadata?.image;
    if (imagePath) {
      fetchImage(imagePath);
    } else {
      console.error("Image path not found in metadata");
    }
    setIsModalOpen(true);
  };

  const fetchImage = async (imageName) => {
    try {
      const { data, error } = await Supabase
        .storage
        .from('agrovest-product-images')
        .getPublicUrl(imageName);

      if (error) {
        console.error("Error fetching image:", error.message);
      } else if (data.publicUrl) {
        setImageUrl(data.publicUrl);
      } else {
        console.error("Public URL not found");
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
          .or('state.eq.Pending, state.eq.Rejected');

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

  const updateProductStatus = async (productId, status) => {
    try {
      const { error } = await Supabase
        .from("agrovest-products")
        .update({ state: status })
        .eq("id", productId);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      alert(`Product status updated to ${status}.`);
      setProductData((prevData) =>
        prevData.map((product) =>
          product.id === productId ? { ...product, state: status } : product
        )
      );
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
          <Header2 title='Product Approvals'/>

          <section className='left prod'>
            <div className="tabb">
              <table>
                <thead>
                  <tr className='heading'>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className='dt'></th>
                    <th className='dt'></th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product) => (
                    <tr key={product.id} style={{ cursor: 'pointer' }}>
                      <td>{product.productname}</td>
                      <td>{product.price}</td>
                      <td>{product.state}</td>
                      <td className='dt'>
                        <button onClick={() => openModal(product)}>View</button>
                      </td>
                      <td className='dt'>
                        {product.state === 'Pending' ? (
                          <select className='unapp'
                            onChange={(e) =>
                              updateProductStatus(product.id, e.target.value)
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Set Status
                            </option>
                            <option value="Approved">Approve</option>
                            <option value="Rejected">Reject</option>
                          </select>
                        ) : (
                          product.state
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={toggleModal}
              contentLabel="Product Details Modal"
              className={`bg-transparent`}
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
                    <button onClick={closeModal} style={{ cursor: 'pointer' }}>X</button>
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
  );
}

export default UnapproveProduct;
