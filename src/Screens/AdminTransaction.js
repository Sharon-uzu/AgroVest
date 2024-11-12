import React, { useState, useEffect } from 'react';
import Header2 from '../Components/Header2';
import AdminSidebar from '../Components/AdminSidebar';
import { Supabase } from "../config/supabase-config"; // Assuming Supabase config is here

const AdminTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalWithdrawal, setTotalWithdrawal] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);  // Added state for balance

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all transactions
                let { data: transactionsData, error: transactionsError } = await Supabase
                    .from('agrovest-transactions')
                    .select(`
                        product_name, 
                        user_email, 
                        farmers_id,
                        farmers_name, 
                        quantity, 
                        price,
                        total, 
                        created_at
                    `);

                if (transactionsError) {
                    console.error("Error fetching transactions:", transactionsError);
                    return;
                }

                // Calculate Total Earnings (sum of 'total' column from transactions)
                const earnings = transactionsData.reduce((sum, transaction) => sum + transaction.total, 0);
                setTotalEarnings(earnings);

                // Fetch all farmer IDs from the transactions data
                const farmerIds = [...new Set(transactionsData.map(item => item.farmers_id))];
                let { data: farmersData, error: farmersError } = await Supabase
                    .from('agrovest-main')
                    .select('id, fullname, withdrawal, balance')  // Including balance column
                    .in('id', farmerIds);

                if (farmersError) {
                    console.error("Error fetching farmers:", farmersError);
                    return;
                }

                // Calculate Total Withdrawal (sum of 'withdrawal' column from agrovest-main)
                const withdrawal = farmersData.reduce((sum, farmer) => sum + (farmer.withdrawal || 0), 0);
                setTotalWithdrawal(withdrawal);

                // Calculate Total Balance (sum of 'balance' column from agrovest-main)
                const balance = farmersData.reduce((sum, farmer) => sum + (farmer.balance || 0), 0);
                setTotalBalance(balance);

                // Calculate Total Earnings as the sum of Total Balance and Total Withdrawal
                const combinedEarnings = balance + withdrawal;
                setTotalEarnings(combinedEarnings);

                // Map farmer IDs to names for easy lookup
                const farmersMap = farmersData.reduce((map, farmer) => {
                    map[farmer.id] = farmer.fullname;
                    return map;
                }, {});

                // Add farmer name to each transaction
                const transactionsWithFarmerNames = transactionsData.map(transaction => ({
                    ...transaction,
                    farmer_name: farmersMap[transaction.farmers_id] || 'Unknown'
                }));

                setTransactions(transactionsWithFarmerNames);
                setLoading(false);
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
      return (
          <div className="loader-container">
              <div className="spinner"></div>
          </div>
      );
  }


    return (
        <div className='dashb'>
            <section className='dashboard'>
                <AdminSidebar/>
                <main>
                    <Header2 title='Transaction Summary'/>
                    <section className='left earnings'>
                        <div className="earning-c">
                            <h1>Total Earnings</h1>
                            <div className="earn-card">
                                <h3>Total Earnings</h3>
                                <h4>₦{totalEarnings.toLocaleString()}</h4>
                                <p>As of {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="earn-card" style={{backgroundColor:'#FBB58A'}}>
                                <h3>Total Withdrawal</h3>
                                <h4 style={{color:"#E06616"}}>₦{totalWithdrawal.toLocaleString()}</h4>
                                <p>As of {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="earn-card" style={{backgroundColor:"#E1FAC2"}}>
                                <h3>Total Balance</h3>
                                <h4>₦{totalBalance.toLocaleString()}</h4> {/* Displaying Total Balance */}
                                <p>As of {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="history">
                            <h6>History</h6>
                            <div className="tb">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Farmer</th>
                                            <th>Customer Email</th>
                                            <th>Product</th>
                                            <th>Date</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={index} className='t-row'>
                                                <td>{transaction.farmers_name}</td>
                                                <td>{transaction.user_email}</td>
                                                <td>{transaction.product_name}</td>
                                                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                                 <td>{transaction.quantity}</td>
                                                <td>₦{(transaction.price * transaction.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
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

export default AdminTransaction;
