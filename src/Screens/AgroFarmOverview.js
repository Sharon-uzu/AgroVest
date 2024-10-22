import React,{useState} from 'react'
import Header from '../Components/Header';
import { FaStar } from "react-icons/fa6";
import img from '../Images/ov.png'
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import CheckOut from '../Components/CheckOut';
import food1 from '../Images/p3.png'
import food2 from '../Images/p1.png'


const AgroFarmOverview = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

  return (
      <div className='p-o'>
        {/* <Header/> */}
        <div className="arr">
            <Link to='/'><IoIosArrowBack className='arr-i'/>Back</Link>
        </div>
        <section className='overview'>
            <h2>Garri - Product Overview</h2>
            <div className="img">
                <img src={img} alt="" />
            </div>

            <div className="overview-c">
                <p>Product: <span>Garri</span></p>
                <p>Place of Production: <span>Rivers State / Eleme LGA</span></p>
                <p>Availability:  <span>Still in Stock</span></p>
                <p>Preservative: <span> No</span></p>

                <h4>Summary</h4>
                <h5>Garri is a staple food in West Africa, made from cassava. It undergoes a process of peeling, grating, fermentation, sieving, and roasting to produce the final product. Our garri is produced under strict quality control measures and packaged to maintain freshness. It is versatile, gluten-free, and rich in carbohydrates, making it an excellent energy source. Our commitment to sustainability and ethical sourcing ensures that our garri supports local farmers and communities. Available for purchase online and in select stores.</h5>

                <div className="quan-price">
                    <div className="quan">
                        <h5>N5000</h5>
                        <span className='cal'>
                            <span>-</span>
                            <span>1</span>
                            <span>+</span>
                        </span>
                    </div>

                    <div className="price">
                        <h6>One custard rubber</h6>
                        <span className='stars'>
                            <FaStar className='p-i'/>
                            <FaStar className='p-i'/>
                            <FaStar className='p-i'/>
                            <FaStar className='p-i'/>
                        </span>
                    </div>
                </div>

                <div className="buttons">
                    <button onClick={toggleModal}>Buy Now</button>
                    <button className='cart'>Add to Cart</button>
                </div>
                
            </div>

        </section>

        <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Example Modal"
        className="two"
        style={{
          overlay: {
            width:'100%',
            position: "fixed",
            top: "0px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200000000000,
            // backgroundColor: "hsl(0, 0%, 0%, .5)",
            backgroundColor: "hsl(0, 0%, 0%, .6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
          },
        }}
      >

        <section className='bill'>
            <div className='checkout-section'>
                <div className="close-check">
                    <button onClick={toggleModal}>x</button>
                </div>

                {/* <CheckOut/> */}
                {/* Checkout */}

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

            </div>
        </section>
      </Modal>
    </div>
  )
}

export default AgroFarmOverview