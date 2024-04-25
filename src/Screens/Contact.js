import React from 'react'

const Contact = () => {
  return (
    <div className='contact'>
        <section className='contact-c'>
            <form className='form'>
                <div className="form-c">
                    <input type="text" placeholder='Full Name'/>
                    <input type="tel" placeholder='Phone Number'/>
                    <input type="email" placeholder='Email'/>
                    <input type="text" placeholder='Referral code'/>
                    <textarea placeholder='Message'></textarea>

                    <div className="subm">
                        <button type="submit">Submit</button>
                    </div>
                </div>

            </form>
        </section>
    </div>
  )
}

export default Contact