import React from 'react'
import Header from '../Components/Header';
import { FaStar } from "react-icons/fa6";


const Overview = () => {
  return (
    <div>
        <Header/>
        <section className='overview'>
            <h2>Garri - Product Overview</h2>
            <div className="img">
                <img src="" alt="" />
            </div>

            <div className="overview-c">
                <p>Product: <span>Garri</span></p>
                <p>Place of Production : <span>Rivers State / Eleme LGA</span></p>
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
                    <button>Buy Now</button>
                    <button>Add to Cart</button>
                </div>
                
            </div>

        </section>
    </div>
  )
}

export default Overview