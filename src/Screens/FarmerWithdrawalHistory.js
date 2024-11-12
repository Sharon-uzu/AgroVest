import React, { useState, useEffect } from 'react';
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import { Supabase } from "../config/supabase-config";

const FarmerWithdrawalHistory = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  
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

        // Fetch withdrawal history for the logged-in user
        const { data: withdrawals, error: withdrawalError } = await Supabase
          .from("agrovest-withdrawal")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (withdrawalError) {
          console.error("Error fetching withdrawal history:", withdrawalError);
        } else {
          setWithdrawalHistory(withdrawals || []);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const getInitials = (fullname) => {
    if (!fullname) return '';
    return fullname
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('');
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
    return { status: "Not Verified!", color: "red" };
  };

  const getNotes = () => {
    if (!userInfo || userInfo.status === null) {
      return { notes: "(Note: Verify your account on the settings page for your products to be uploaded on our website.)", color: "red" };
    } else if (userInfo.status === "verified") {
      return '';
    } else if (userInfo.status === "suspended") {
      return { notes: "(Note: Your account has been suspended, your products can't be displayed on our website for now.)", color: "orange" };
    }
  };

  if (!userInfo) {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );
}

  const { notes } = getNotes();
  const { status, color } = getVerificationStatus();

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)} />

        <main>
          <Header2 title='Withdrawal History' status={status} statusColor={color} notes={notes} notesColor={color} />

          <section className='left'>
            <div className="with-history">
              <h6>Withdrawal History</h6>
              <div className="tb">
                <table>
                  <thead>
                    <tr>
                      <th className='date'>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.length > 0 ? (
                      withdrawalHistory.map((withdrawal, index) => (
                        <tr key={index}>
                          <td className='date'>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                          <td>₦{withdrawal.amount.toFixed(2)}</td>
                          <td style={{ color: withdrawal.status === 'Pending' ? 'orange' : (withdrawal.status === 'Complete' ? 'green' : 'red') }}>
                            {withdrawal.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No withdrawal history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default FarmerWithdrawalHistory;
