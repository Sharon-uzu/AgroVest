import React from 'react'
import Header from '../Components/Header'
import Hero from '../Components/Hero'
import About from '../Components/About'
import Service from '../Components/Service'
import Feature from '../Components/Feature'
import Connect from '../Components/Connect'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>

        <Header/>
        <Hero/>

        <section className='abt-serv'>
          <div className='abt-serv-c'>
            <About/>
            <Service/>
          </div>
        </section>
        <Feature/>
        <Connect/>
        <Footer/>
        
        
    </div>
  )
}

export default Home