import React, { useState, useEffect } from 'react';
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import { Supabase } from "../config/supabase-config";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [bankDetails, setBankDetails] = useState('Not Available');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status) => {
    switch (status) {
        case 'Success':
            return '#006738'; // Green
        case 'Pending':
            return '#87BD42'; // Light green
        case 'Rejected':
            return '#C10B0E'; // Red
        default:
            return '#000'; // Default color
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch user info from agrovest-main
        const { data: userData, error: userError } = await Supabase
          .from("agrovest-main")
          .select("*, metadata->acctNo, withdrawal")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user info:", userError);
          return;
        }

        console.log("Fetched User Info:", userData);

        if (userData) {
          setUserInfo(userData);
          setBalance(userData.balance || 0);
          setTotalWithdrawal(userData.withdrawal || 0);
          setTotalEarnings((userData.balance || 0) + (userData.withdrawal || 0));

          // Set bank details to acctNo from metadata
          setBankDetails(userData.metadata?.acctNo || "Not Available");
        }

        // Fetch transactions from agrovest-transactions for this farmer's products
        const { data: transactionData, error: transactionError } = await Supabase
          .from("agrovest-transactions")
          .select("*")
          .eq("farmers_id", userId);

        if (transactionError) {
          console.error("Error fetching transactions:", transactionError);
        } else {
          setTransactions(transactionData || []);
          console.log("Fetched Transactions:", transactionData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInitials = (fullname) => {
    if (!fullname) return '';
    return fullname
      .split(' ') // Split full name by spaces into an array of words
      .map(word => word[0].toUpperCase()) // Get the first letter of each word and convert to uppercase
      .join(''); // Join the initials together
  };

  const getVerificationStatus = () => {
    if (!userInfo || userInfo.status === null) return { status: "Not Verified!", color: "red" };
    switch (userInfo.status) {
      case 'verified': return { status: "Verified!", color: "green" };
      case 'suspended': return { status: "Suspended!", color: "orange" };
      default: return { status: "Not Verified!", color: "red" };
    }
  };

  const { status, color } = getVerificationStatus();

  if (!userInfo) {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );
}

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)}  />

        <main>
          <Header2 title='Transactions' status={status} statusColor={color} />

          <section className='left earnings'>
            <div className="earning-c">
              <h1>Total Earnings</h1>

              <div className="earn-card">
                <h3>Total Earnings</h3>
                <h4>₦{totalEarnings.toFixed(2)}</h4>
                <p>As of {new Date().toLocaleDateString()}</p>
              </div>

              <div className="earn-card" style={{ backgroundColor: '#FBB58A' }}>
                <h3>Total Withdrawal</h3>
                <h4 style={{ color: "#E06616" }}>₦{totalWithdrawal.toFixed(2)}</h4>
                <p>As of {new Date().toLocaleDateString()}</p>
              </div>

              <div className="earn-card" style={{ backgroundColor: '#E1FAC2' }}>
                <h3>Balance</h3>
                <h4>₦{balance.toFixed(2)}</h4>
                <p>As of {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="history">
              <h6>History</h6>
              <div className="tb">
                {transactions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th className='c-name'>Cardholder</th>
                        <th>Product</th>
                        <th className='date'>Date</th>
                        <th>Qty</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, id) => (
                        <tr key={id}>
                          <td className='c-name'>{transaction.cardholder}</td>
                          <td>{transaction.product_name}</td>
                          <td className='date'>{transaction.created_at ? new Date(transaction.created_at).toISOString().slice(0, 10) : "N/A"}</td>
                          <td>{transaction.quantity}</td>
                          <td>₦{(transaction.price * transaction.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions found.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default Transaction;
