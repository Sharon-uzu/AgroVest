import React from 'react'
import { Link } from 'react-router-dom'

const Connect = () => {
  return (
    <div className='connect'>
        <div className='connect-c'>
            <div className='connect-text'>
                <h2>Connect with AgroVest to a world of possibilities</h2>
                <div className='more'>
                    {/* <a href=""><button>Learn more</button></a> */}
                    <Link to='/contact'><button className='btn2'>Contact Us</button></Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Connect