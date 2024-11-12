import React, { useEffect, useState } from 'react';
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import circle from '../Images/Logo-1.png';
import symbol from '../Images/MasterCard.png';
import { Supabase } from "../config/supabase-config";

const FarmersWithdrawal = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          .select("*, metadata->acctNo, metadata->accountName, balance, password")
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
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('');
  };

  // Determine user verification status
  const getUserVerificationStatus = () => {
    if (!userInfo) return { status: "Loading...", color: "grey" };
    if (userInfo.status === "verified") return { status: "Verified", color: "green" };
    if (userInfo.status === "suspended") return { status: "Suspended", color: "orange" };
    return { status: "Not Verified", color: "red" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !password) {
      setError('Please fill in all the fields.');
      return;
    }

    if (parseFloat(amount) > userInfo.balance) {
      setError('The amount entered exceeds your balance.');
      return;
    }

    if (password !== userInfo.password) {
      setError('The password you entered is incorrect.');
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      const { data, error } = await Supabase
        .from("agrovest-withdrawal")
        .insert([
          {
            user_id: userId,
            fullname: userInfo.fullname,
            amount: parseFloat(amount),
            status: "Pending",
            created_at: new Date(),
          }
        ]);

      if (error) {
        setError('Error processing your withdrawal request.');
        console.error('Error inserting withdrawal:', error);
      } else {
        setAmount('');
        setPassword('');
        setError('');
        alert('Withdrawal request submitted successfully. Status: Pending');
      }
    } catch (error) {
      setError('Error processing your withdrawal request.');
      console.error('Error submitting withdrawal request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );
}

  const { status, color } = getUserVerificationStatus();

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar name={getInitials(userInfo.fullname)} />

        <main>
          <Header2 title='Withdrawal' status={status} statusColor={color} notes={''} notesColor={color} />

          <section className='left earnings'>
            <div className="withdrawal-card">
              <div className="w-c">
                <div className="w1">
                  <h3>MasterCard</h3>
                  <img src={circle} alt="" />
                </div>
                <h4>{userInfo.metadata?.acctNo || 'Account Number Not Available'}</h4>

                <div className="w2">
                  <div className="holder">
                    <p>Card Holder Name</p>
                    <h5>{userInfo.metadata?.acctName || 'Account Name Not Available'}</h5>
                  </div>

                  <img src={symbol} alt="" />
                </div>
              </div>
            </div>

            <div className="withdraw-form">
              <form onSubmit={handleSubmit}>
                <label htmlFor="amount">
                  <p>Enter Amount (₦)</p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </label>

                <label htmlFor="password">
                  <p>Password</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <label htmlFor="password" className='btn'>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Proceed'}
                  </button>
                </label>
              </form>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default FarmersWithdrawal;
