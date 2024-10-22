import React from 'react';
import Header2 from '../Components/Header2';
import AdminSidebar from '../Components/AdminSidebar';
import two from '../Images/one.png'
import three from '../Images/two.png'
import one from '../Images/three.png'


const AdminDashboard = () => {

    const Cards= [
        
        {
            text:'Products',
            icon: one,
            // link:'/product',
            number:'100',
            background:'#66f4b466'
        },
    
        {
          text:'Approved Farmers',
          icon:two,
          number:'25',
        //   link:'/shops',
          background:'#b7e37d66'
        },
        {
          text:'Unapproved Farmers',
          icon:three,
          number:'15',
        //   link:'/manager',
          background:'#eba57a66'
        }
        
    ];


  return (
    <div className='dashb'>
       

        <section className='dashboard'>

          <AdminSidebar/>

          <main>
          <Header2 title='Admin Dashboard'/>

          <section className='left earnings'>
            
            <div className='cards-container'>
                
                {Cards && Cards.map(({icon, text, background, number},index)=>{
                    return(

                    <div className="cardss" >
                        <div className='card1' style={{backgroundColor:background}}>
                        <div className='icon-card' >
                        <img src={icon} alt="" />
                        
                        {/* <i className='icons'>{React.createElement(icon)}</i> */}

                        </div>

                        <div className='card-text'>
                        <p>{text}</p>
                        <h4>{number}</h4>
                        </div>
                    </div>

                    </div>
                    

                    )
                })}


                
                </div>

                <div className="recent">
                <h3>Unapproved Farmers </h3>

                <div className="confirm">
                    <div className="cc">
                        <span className='check'>
                            <span>D'Glass Farm</span>
                        </span>
                        <button>Confirm</button>
                    </div>
                    
                </div>

                <div className="confirm">
                    <div className="cc">
                        <span className='check'>
                            <span>Mr. Goodluck Poultry</span>
                        </span>
                        
                        <button>Approve</button>
                    </div>
                    
                </div>


                <div className="confirm">
                    <div className="cc">
                        <span className='check'>
                            <span>Mr. Goodluck Poultry</span>
                        </span>
                        
                        <button>Approve</button>
                    </div>
                    
                </div>

                <div className="confirm">
                    <div className="cc">
                        <span className='check'>
                            <span>Mr. Goodluck Poultry</span>
                        </span>
                        
                        <button>Confirm</button>
                    </div>
                    
                </div>

                </div>




          </section>

          </main>
        
        </section>


    </div>
  )
}

export default AdminDashboard