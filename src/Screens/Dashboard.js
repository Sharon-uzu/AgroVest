import React, { useState, useEffect } from 'react';
import '../App.css';
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import two from '../Images/one.png';
import three from '../Images/two.png';
import one from '../Images/three.png';
import { FaCheckCircle, FaRegCircle, FaCircle } from "react-icons/fa";
import { Supabase } from "../config/supabase-config";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [see, setSee] = useState(false);
  const [less, setLess] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const toggle = () => {
    setSee(true);
    setLess(false);
  };

  const Cards = [
    {
      text: 'Products',
      icon: one,
      number: '100',
      background: '#66f4b466',
      link:"/product"
    },
    {
      text: 'Transaction',
      icon: two,
      number: '25',
      background: '#b7e37d66',
      link:'/transaction'
    },
    {
      text: 'Withdrawal',
      icon: three,
      number: '15',
      background: '#eba57a66',
      link:'/withdrawal'
    },
    {
      text: 'Settings',
      icon: three,
      number: '15',
      background: '#b7e37d66',
      link:'/settings'
    }
  ];

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

  const getInitials = (fullname) => {
    if (!fullname) return '';
    return fullname
      .split(' ') // Split full name by spaces into an array of words
      .map(word => word[0].toUpperCase()) // Get the first letter of each word and convert to uppercase
      .join(''); // Join the initials together
  };

  // Determine the user verification status and corresponding color
  const getVerificationStatus = () => {
    if (!userInfo || userInfo.status === null) {
      return { status: "Not Verified!", color: "red" };
    } else if (userInfo.status === "verified") {
      return { status: "Verified!", color: "green" };
    } else if (userInfo.status === "suspended") {
      return { status: "Suspended!", color: "orange" };
    }
    return { status: "Not Verified!", color: "red" }; // Fallback case
  };

  const getNotes = () => {
    if (!userInfo || userInfo.status === null) {
      return { notes: "(Note: Verify your account on the settings page for your products to be uploaded on our website.)", color: "red" };
    } else if (userInfo.status === "verified") {
      return '';
    } else if (userInfo.status === "suspended") {
      return { notes: "(Note: Your account has been suspended, your products can't be displayed on our website for now.)", color: "orange" };
    }
    // return { status: "Not Verified!", color: "red" }; // Fallback case
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


  const { notes } = getNotes(); // Get status and color

  const { status, color } = getVerificationStatus(); // Get status and color

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)} />

        <main>
          {/* Pass the status and color to Header2 */}
          <Header2 title='Dashboard' status={status} statusColor={color}  notes={notes} notesColor={color} />

          <section className='left'>
            <h2>Dashboard</h2>

            <div className='cards-container'>
              {Cards.map(({ icon, text, background, link }, index) => (
                <Link to={link} className="cardss" key={index}>
                  <div className='card1' style={{ backgroundColor: background }}>
                    <div className='icon-card'>
                      <img src={icon} alt={text} />
                    </div>
                    <div className='card-text'>
                      {/* <p>{text}</p> */}
                      <h4>{text}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* <div className="recent">
              <h3>
                Recent Activities
                {less && <span onClick={toggle}>See All</span>}
              </h3>

              <div className="confirm">
                <div className="cc">
                  <span className='check'>
                    <FaCheckCircle className='conf-i' />
                    <span>Confirm order update</span>
                  </span>
                  <button>URGENT</button>
                </div>
              </div>

              <div className="confirm">
                <div className="cc">
                  <span className='check'>
                    <FaCircle className='conf-i cir' />
                    <span>Finish shipping update</span>
                  </span>
                  <button>URGENT</button>
                </div>
              </div>

              {see && (
                <>
                  <div className="confirm">
                    <div className="cc">
                      <span className='check'>
                        <FaRegCircle className='conf-i' />
                        <span>Create an Order</span>
                      </span>
                      <button>NEW</button>
                    </div>
                  </div>

                  <div className="confirm">
                    <div className="cc">
                      <span className='check'>
                        <FaCheckCircle className='conf-i' />
                        <span>Update payment report</span>
                      </span>
                      <button>DEFAULT</button>
                    </div>
                  </div>
                </>
              )}
            </div> */}
          </section>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
