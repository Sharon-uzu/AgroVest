import React, { useState, useEffect } from 'react';
import AdminSidebar from '../Components/AdminSidebar';
import Header2 from '../Components/Header2';
import Modal from "react-modal";
import { Supabase } from "../config/supabase-config";

const UnapprovedFarmers = () => {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Store image URL

  const toggleModal1 = () => {
    setIsModalOpen1(!isModalOpen1);
  };

  const closeModal = () => {
    setSelectedPersonnel(null);
    setIsModalOpen1(false);
  };

  const openModal = (person) => {
    setSelectedPersonnel(person);
    const imagePath = person.metadata?.image;
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
        .from('farmersIDImage') // Bucket name
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
    const fetchPersonnelData = async () => {
      try {
        const { data, error } = await Supabase
          .from("agrovest-main")
          .select("*")
          .eq("role", "farmer")
          .or('status.is.null,status.eq.pending,status.eq.suspended');

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setPersonnelData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPersonnelData();
  }, []);

  const handleApprove = async (personId) => {
    try {
      const { data, error } = await Supabase
        .from("agrovest-main")
        .update({ status: "verified" })
        .eq("id", personId);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      alert(`Farmer with ID ${personId} approved successfully.`);
      setPersonnelData((prevData) => prevData.filter((person) => person.id !== personId));
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
                  <th>Farm Name</th>
                  <th>Email</th>
                  <th className='dt'></th>
                  <th className='dt'></th>
                </tr>

                {personnelData.map((person) => (
                  <tr style={{ cursor: 'pointer' }} key={person.id}>
                    <td>{person.fullname}</td>
                    <td>{person.email}</td>
                    <td className='dt' onClick={() => openModal(person)}><button>View</button></td>
                    <td className='dt'><button onClick={() => handleApprove(person.id)}>Approve</button></td>
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

                  {selectedPersonnel && (
                    <section className='product-info'>
                      <div className='product-images'>
                        {imageUrl ? (
                          <img src={imageUrl} alt="Uploaded file" />
                        ) : (
                          <p>Image not available</p>
                        )}
                      </div>

                      <div className='others'>
                        <p>Full Name: <span>{selectedPersonnel.fullname}</span></p>
                        <p>Email: <span>{selectedPersonnel.email}</span></p>
                        <p>Phone Number: <span>{selectedPersonnel.metadata.phone}</span></p>
                        <p>Address: <span>{selectedPersonnel.metadata.address}</span></p>
                        <p>Account Number: <span>{selectedPersonnel.metadata.acctNo}</span></p>
                        <p>Bank: <span>{selectedPersonnel.metadata.bank}</span></p>
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

export default UnapprovedFarmers;
