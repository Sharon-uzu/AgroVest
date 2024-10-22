import React,{useState, useEffect} from 'react'
import Header2 from '../Components/Header2';
import Sidebar from '../Components/Sidebar';
import { Supabase } from "../config/supabase-config";

const Transaction = () => {


  const History = [
    {
        id:1,
        name:'Rice',
        buyer:'Fred Junior',
        date:'Mar 1, 2024',
        amount:'N100,000',
        order: 2,
        status:'Success'

    },

    {
        id:2,
        name:'Yam',
        buyer:'Ruth Soma',
        date:'Mar 12, 2024',
        amount:'N120,000',
        order: 1,
        status:'Pending'

    },

    {
        id:3,
        name:'Fish',
        buyer:'John Smith',
        date:'Mar 16, 2024',
        amount:'N60,000',
        order: 1,
        status:'Rejected'

    },

    {
        id:4,
        name:'Rice',
        buyer:'Fred Smith',
        date:'Mar 21, 2024',
        amount:'N50,000',
        order: 3,
        status:'Success'

    },

    {
        id:5,
        name:'Rice',
        buyer:'Victor Abel',
        date:'Mar 23, 2024',
        amount:'N110,000',
        order: 10,
        status:'Pending'

    },

    {
        id:6,
        name:'Beans',
        buyer:'Victory Fred',
        date:'June 1, 2024',
        amount:'N150,000',
        order: 2,
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
    }else if (userInfo.status === "pending") {
      return 'Your verification form has already been submitted. Thank you!';
    } else if (userInfo.status === "suspended") {
      return { notes: "(Note: Your account has been suspended, your products can't be displayed on our website for now.)", color: "orange" };
    }
    // return { status: "Not Verified!", color: "red" }; // Fallback case
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const { notes } = getNotes(); // Get status and color

  const { status, color } = getVerificationStatus(); // Get status and color



  return (
    <div className='dashb'>
       

        <section className='dashboard'>

          <Sidebar name={getInitials(userInfo.fullname)} />

          <main>
          <Header2 title='Transactions' status={status} statusColor={color}  notes={notes} notesColor={color} />

          <section className='left earnings'>
            <div className="earning-c">

              <h1>Total Earnings</h1>

              <div className="earn-card">
                <h3>Total Earnings</h3>
                <h4>N300,430.00</h4>
                <p>As of 01-April 2024</p>
              </div>

              <div className="earn-card" style={{backgroundColor:'#FBB58A'}}>
                <h3>Total Withdrawal</h3>
                <h4 style={{color:"#E06616"}}>N250,000.00</h4>
                <p>As of 01-April 2024</p>
              </div>

              <div className="earn-card" style={{backgroundColor:"#E1FAC2"}}>
                <h3>Withdrawal Method</h3>
                <h4>1502********4832</h4>
                <p>Debit Card</p>
              </div>



            </div>

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

                    <th>Customer Name</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Total Order</th>
                    <th>Status</th>
                                        
                  </tr>


                  {
                    filteredData.map((History, id)=>{
                      const statusColor = getStatusColor(History.status);
                        return(
                          <tr key={id} className='t-row'>
                            <td>{History.buyer}</td>
                            <td>{History.name}</td>
                            <td>{History.date}</td>
                            <td>{History.amount}</td>
                            <td>{History.order}</td>
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

export default Transaction