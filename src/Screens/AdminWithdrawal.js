import React,{useState} from 'react'
import Header2 from '../Components/Header2';
import AdminSidebar from '../Components/AdminSidebar';

const AdminWithdrawal = () => {

    const History = [
        {
            id:1,
            farmer:'Fred Junior',
            date:'Mar 1, 2024',
            amount:'N100,000',
            status:'Success'
    
        },
    
        {
            id:2,
            farmer:'Ruth Soma',
            date:'Mar 12, 2024',
            amount:'N120,000',
            status:'Pending'
    
        },
    
        {
            id:3,
            farmer:'John Smith',
            date:'Mar 16, 2024',
            amount:'N60,000',
            status:'Rejected'
    
        },
    
        {
            id:4,
            farmer:'Fred Smith',
            date:'Mar 21, 2024',
            amount:'N50,000',
            status:'Success'
    
        },
    
        {
            id:5,
            farmer:'Victor Abel',
            date:'Mar 23, 2024',
            amount:'N110,000',
            status:'Pending'
    
        },
    
        {
            id:6,
            farmer:'Victory Fred',
            date:'June 1, 2024',
            amount:'N150,000',
            status:'Success'
    
        }
    
        
    
    ]

    const getStatusColor = (status) => {

        switch (status) {
            case 'Success':
                return '#006738'; // Green
            case 'Pending':
                return '#87BD42'; // LLight green
            case 'Rejected':
                return '#C10B0E'; // Red
            default:
                return '#000'; // Default color
        }
    };
  
    const [data] = useState(History);
    const [filter, setFilter] = useState('All');
  
    const handleFilterChange = (status) => {
      setFilter(status);
    };
  
    // Filter the data based on the current filter
    const filteredData = data.filter(item => 
      filter === 'All' ? true : item.status === filter
    );
  
  
    const getButtonStyle = (status) => ({
      backgroundColor: filter === status ? '#FD721B' : 'transparent', // Green for active, grey for inactive
      color: filter === status ? 'white' : 'black', // White text for active, black for inactive
      border:filter === status ? '0.93px solid #EBEBEE' : '0.93px solid #EBEBEE',
      // padding: '10px 20px',
      // margin: '5px',
      border: filter === status ? 'none' : '0.93px solid #EBEBEE',
      cursor: 'pointer',
    });



  return (
    <div className='dashb'>
       

        <section className='dashboard'>

          <AdminSidebar/>

          <main>
          <Header2 title='Withdrawal Summary'/>

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
                  <tr>

                    <th>Farmer Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                                        
                  </tr>


                  {
                    filteredData.map((History, id)=>{
                      const statusColor = getStatusColor(History.status);
                        return(
                          <tr key={id} className='t-row'>
                            <td>{History.farmer}</td>
                            <td>{History.date}</td>
                            <td>{History.amount}</td>
                            <td style={{ color: statusColor }}>{History.status}</td>
                                                   
                          </tr>
                        )
                        })
                      }
                                    

              </table>
              </div>

            </div>
            


          </section>

          </main>
        
        </section>


    </div>
  )
}

export default AdminWithdrawal