import React,{useEffect, useState} from 'react'
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import circle from '../Images/Logo-1.png'
import symbol from '../Images/MasterCard.png'
import { Supabase } from "../config/supabase-config";

const FarmersWithdrawal = () => {

    const [userInfo, setUserInfo] = useState(null);

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

  const getVerificationStatus = () => {
    if (!userInfo || userInfo.status === null) {
      return { status: "Not Verified!", color: "red" };
    } else if (userInfo.status === "verified") {
      return { status: "Verified!", color: "green" };
    }else if (userInfo.status === "pending") {
      return 'Your verification form has already been submitted. Thank you!';
    } else if (userInfo.status === "suspended") {
      return { status: "Suspended!", color: "orange" };
    }
    return { status: "Not Verified!", color: "red" }; // Fallback case
  };

  const getNotes = () => {
    if (!userInfo || userInfo.status === null) {
      return { notes: "(Note: Verify your account on the settings page for your products to be uploaded on our website.)", color: "red" };
    } else if (userInfo.status === "verified") {
      return { notes: "", color: "" }; // Return an empty string for notes and color when verified
    } else if (userInfo.status === "suspended") {
      return { notes: "(Note: Your account has been suspended, your products can't be displayed on our website for now.)", color: "orange" };
    }
    // Fallback case for unverified status
    return { notes: "(Note: Please verify your account to proceed.)", color: "red" };
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }


  const { notes } = getNotes(); // Get status and color

  const { status, color } = getVerificationStatus(); // Get status and color


  return (
    <div className='dashb'>
       

        <section className='dashboard'>

          <Sidebar name={getInitials(userInfo.fullname)}/>

          <main>
          <Header2 title='Withdrawal' status={status} statusColor={color}  notes={notes} notesColor={color} />

          <section className='left earnings'>
            <div className="withdrawal-card">
                <div className="w-c">
                    <div className="w1">
                        <h3>MasterCard</h3>
                        <img src={circle} alt="" />
                    </div>
                    <h4>8763 2736 9873 0329</h4>

                    <div className="w2">
                        <div className="holder">
                            <p>Card Holder Name</p>
                            <h5>Jessie Joshua</h5>
                        </div>

                        <img src={symbol} alt="" />
                    </div>

                    

                </div>


            </div>
            
            <div className="withdraw-form">

                        <label htmlFor="amount">
                            <p>Enter Amount (₦)</p>
                            <input type="text" />
                        </label>

                        <label htmlFor="password">
                            <p>Password</p>
                            <input type="password" />
                        </label>

                        <label htmlFor="password">
                            <p>Verification Code</p>
                            <div>
                                <input type="text" />
                                <h5>Request Code</h5>
                            </div>
                            
                        </label>


                        <label htmlFor="password" className='btn'>
                            <button>Proceed</button>
                        </label>

                    </div>

          </section>

          </main>
        
        </section>


    </div>
  )
}

export default FarmersWithdrawal