import React, {useState, useEffect} from 'react'
import AdminSidebar from '../Components/AdminSidebar';
import Header2 from '../Components/Header2';
import Modal from "react-modal";
import m1 from '../Images/IN_ID-cardsl_Hero-image_03.jpeg'
import m2 from '../Images/logg.jpeg'
import { Supabase } from "../config/supabase-config";


const Farmers = () => {
    
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const toggleModal1 = () => {
      setIsModalOpen1(!isModalOpen1);
    };

    const [selectedPersonnel, setSelectedPersonnel] = useState(null); // State to hold selected personnel details

    const openModal = (person) => {
      setSelectedPersonnel(person);
      
      // Fetch the image when the modal is opened
      if (person.metadata.image) {
        fetchImage(person.metadata.image);
      }
      
      setIsModalOpen1(true);
    };
    
  
    const closeModal = () => {
      setSelectedPersonnel(null);
      setIsModalOpen1(false);
    };


    const [approvedPersonnel, setApprovedPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); // Store image URL


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
      const fetchApprovedPersonnel = async () => {
        try {
          const { data, error } = await Supabase
            .from("agrovest-main")
            .select("*")
            .eq("role", "farmer")
            .eq("status", "verified");
  
          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
  
          setApprovedPersonnel(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchApprovedPersonnel();
    }, []);
  
  
  
    const handleDecline = async (personId) => {
      try {
        // Step 1: Update farmer status to 'suspended' in agrovest-main table
        const { data: farmerData, error: farmerError } = await Supabase
          .from("agrovest-main")
          .update({ status: 'suspended' })
          .eq("id", personId);
    
        if (farmerError) {
          console.error("Error updating farmer status:", farmerError);
          return;
        }
    
        // Step 2: Update associated products to reflect suspension
        const { data: productData, error: productError } = await Supabase
          .from("agrovest-products")
          .update({ farmerstatus: 'suspended' }) // Update farmerstatus to 'suspended'
          .eq("userid", personId); // Filter products by farmer's userid
    
        if (productError) {
          console.error("Error updating associated products:", productError);
          return;
        }
    
        // Remove the suspended farmer from the local state
        setApprovedPersonnel((prevData) => prevData.filter((person) => person.id !== personId));
      } catch (error) {
        console.error("Error suspending farmer and updating products:", error);
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

          <AdminSidebar/>

          <main>
          <Header2 title='Farmers'/>

          <section className='left prod'>
         
             {/* <h2>Products</h2> */}

            <div className="tabb">

              <table>
                <tr className='heading'>
                  <th>Farm Name</th>
                  <th>Email</th>
                  <th className='dt'></th>
                  <th className='dt'></th>
                </tr>


                {approvedPersonnel.map((person) => (
                    <tr style={{cursor:'pointer'}} key={person.id}>
                        <td>{person.fullname}</td>
                        <td>{person.email}</td>
                        <td className='dt' onClick={() => openModal(person)}><button>Details</button></td>
                        <td className='dt' onClick={() => handleDecline(person.id)}><button>Suspend</button></td>
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
                zIndex:100000,
                
              },
            }}
          >
            <div className='modal1'>
              <div className='modal1-content'>
                <div className='close'>
                  <button onClick={() => setIsModalOpen1(false)} style={{cursor:'pointer'}}>X</button>
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
  )
}

export default Farmers