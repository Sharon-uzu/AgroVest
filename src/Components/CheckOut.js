import React from 'react'
import food1 from '../Images/p3.png'
import food2 from '../Images/p1.png'


const CheckOut = () => {
  return (
    
        <div className="checkout">

            <div className="check">

                <h2>Payment Method</h2>

                <form>
                    <select name="" id="">
                        <option value="debit">Debit card</option>
                        <option value="credit">Credit card</option>

                    </select>

                    <input type="text" placeholder='Card Holder Name'/>
                    <input type="text" placeholder='Card number'/>
                    <input type="text" placeholder='Expiration MM/YY' className='exp'/>
                    <input type="text" placeholder='CVV' className='cvv'/>
                    <div>
                        <h4>Sub Total</h4>
                        <h4>N20000</h4>
                    </div>
                    <div>
                        <h4>Discount</h4>
                        <h4>N1000</h4>
                    </div>
                    <div>
                        <h3>Total</h3>
                        <h3>N19000</h3>
                    </div>

                    <button type="submit">Pay Now</button>
                </form>

            </div>

            <div className="out">

                <div className="sum">
                    <h3>Your Order Summary</h3>
                    <p>04-05-2024</p>
                </div>

                <div className="content">
                    <img src={food1} alt="" />
                    <div>
                        <p>10 Tubers of Yam</p>
                        <p>N10000</p>
                    </div>
                </div>

                <div className="content">
                    <img src={food2} alt="" />
                    <div>
                        <p>5 Rubber of Garri</p>
                        <p>N10000</p>
                    </div>
                </div>

                <div className="total">
                    <h4>Subtotal</h4>
                    <h4>20000</h4>
                </div>

                <div className="total total2">
                    <h4>Discount</h4>
                    <h4>1000</h4>
                </div>

                <div className="total total3">
                    <h4>Grand total</h4>
                    <h4>19000</h4>
                </div>

                <div className="receipt">
                    <button>Download Receipt</button>
                </div>

            </div>

        </div>
    
  )
}

export default CheckOut