import React from 'react'
import s1 from '../Images/s1.png'
import s2 from '../Images/s2.png'
import s3 from '../Images/s3.png'

const Service = () => {
  return (
    <div className='serv' id='service'>
        <h3>Our Services</h3>
        <section className='s-c'>

            <div className='s1'>
                <img src={s1} alt="" />
                <h4>Empower farmers</h4>
                <p>Provide farmers with access to comprehensive agricultural tools, information, and resources to optimize their farming practices and increase productivity.</p>
            </div>

            <div className='s1'>
                <img src={s2} alt="" />
                <h4>Foster Interest in Agriculture</h4>
                <p>Engage and educate individuals about the importance of agriculture and its role in global food security.</p>
            </div>

            <div className='s1'>
                <img src={s3} alt="" />
                <h4>Promote Sustainable Practices</h4>
                <p>Encourage the adoption of sustainable agricultural techniques to minimize environmental impact and ensure long-term viability.</p>
            </div>

        </section>
    </div>
  )
}

export default Service