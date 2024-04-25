import React from 'react'
import img from '../Images/abt.png'

const About = () => {
  return (
    <div>
        <section className='abt' id='about'>

            <div className="abt-l">
                <img src={img}  />
            </div>

            <div className="abt-r">
                <h3>About Us</h3>
                <h5>All You Need To Know About Our Company</h5>
                <p>AgroVest is an innovative agricultural technology platform designed to revolutionize farming practices, empower farmers, and promote sustainability in agriculture. </p>
                <p>By leveraging cutting-edge technology, AgroVest aims to address the challenges faced by farmers while fostering a renewed interest in agriculture. Foster Interest in Agriculture: Engage and educate individuals about the importance of agriculture and its role in global food security.</p>
            </div>

        </section>
    </div>
  )
}

export default About