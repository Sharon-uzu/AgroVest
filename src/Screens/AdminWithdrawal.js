import React, { useState, useEffect } from 'react';
import Header2 from '../Components/Header2';
import AdminSidebar from '../Components/AdminSidebar';
import { Supabase } from "../config/supabase-config";

const AdminWithdrawal = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return '#006738'; // Green
      case 'Pending': return '#87BD42'; // Light green
      case 'Rejected': return '#C10B0E'; // Red
      default: return '#000'; // Default color
    }
  };

  // Fetch data from Supabase
  const fetchWithdrawals = async () => {
    const { data, error } = await Supabase
      .from('agrovest-withdrawal')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleFilterChange = (status) => setFilter(status);

  // Filter the data based on the current filter
  const filteredData = data.filter(item => filter === 'All' ? true : item.status === filter);

  // Handle status update in Supabase
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Step 1: Fetch the withdrawal request details (amount and user_id)
      const { data: withdrawalData, error: withdrawalError } = await Supabase
        .from('agrovest-withdrawal')
        .select('user_id, amount')
        .eq('id', id)
        .single();
  
      if (withdrawalError) throw withdrawalError;
  
      const { user_id, amount } = withdrawalData;
  
      // Step 2: Update the status in the `agrovest-withdrawal` table
      const { error: updateStatusError } = await Supabase
        .from('agrovest-withdrawal')
        .update({ status: newStatus })
        .eq('id', id);
  
      if (updateStatusError) throw updateStatusError;
  
      // Step 3: If approved, update the `withdrawal` and `balance` columns in `agrovest-main`
      if (newStatus === "Complete") {
        // Fetch the current `withdrawal` and `balance` values for the user in `agrovest-main`
        const { data: userData, error: userError } = await Supabase
          .from('agrovest-main')
          .select('withdrawal, balance')
          .eq('id', user_id)
          .single();
  
        if (userError) throw userError;
  
        const currentWithdrawal = userData.withdrawal || 0;
        const currentBalance = userData.balance || 0;
  
        // Calculate new values for `withdrawal` and `balance`
        const newWithdrawalAmount = currentWithdrawal + amount;
        const newBalance = currentBalance - amount;
  
        // Ensure balance is not negative
        if (newBalance < 0) {
          console.error("Error: Insufficient balance.");
          return;
        }
  
        // Step 4: Update the `withdrawal` and `balance` columns in `agrovest-main`
        const { error: updateMainError } = await Supabase
          .from('agrovest-main')
          .update({
            withdrawal: newWithdrawalAmount,
            balance: newBalance,
          })
          .eq('id', user_id);
  
        if (updateMainError) throw updateMainError;
      }
  
      // Step 5: Refresh the data after updating
      fetchWithdrawals();
    } catch (error) {
      console.error("Error updating status, withdrawal, and balance:", error);
    }
  };
  
  

  const getButtonStyle = (status) => ({
    backgroundColor: filter === status ? '#FD721B' : 'transparent',
    color: filter === status ? 'white' : 'black',
    border: '0.93px solid #EBEBEE',
    cursor: 'pointer',
  });

//   if (loading) {
//     return (
//         <div className="loader-container">
//             <div className="spinner"></div>
//         </div>
//     );
// }


  return (
    <div className='dashb'>
      <section className='dashboard'>
        <AdminSidebar />
        <main>
          <Header2 title='Withdrawal Summary' />
          <section className='left earnings'>
            <div className="history">
              <h6>History</h6>
              <div className="segment">
                <span style={getButtonStyle('All')} onClick={() => handleFilterChange('All')}>All</span>
                <span style={getButtonStyle('Success')} onClick={() => handleFilterChange('Success')}>Complete</span>
                <span style={getButtonStyle('Pending')} onClick={() => handleFilterChange('Pending')}>Pending</span>
                <span style={getButtonStyle('Rejected')} onClick={() => handleFilterChange('Rejected')}>Rejected</span>
              </div>
              <div className="tb">
                <table>
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((record, id) => (
                      <tr key={id} className='t-row'>
                        <td>{record.fullname}</td>
                        <td>{record.created_at}</td>
                        <td>{record.amount}</td>
                        <td style={{ color: getStatusColor(record.status) }}>{record.status}</td>
                        <td>
                          {record.status === 'Pending' ? (
                            <select className='action'
                              onChange={(e) => handleStatusUpdate(record.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Select Action</option>
                              <option value="Complete">Approve</option>
                              <option value="Rejected">Decline</option>
                            </select>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
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

export default AdminWithdrawal;
