import React from 'react'
import { MdFilterList } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import p1 from '../Images/p1.png'
import p2 from '../Images/p2.png'
import p3 from '../Images/p3.png'
import p4 from '../Images/p4.png'
import p5 from '../Images/p5.png'
import p6 from '../Images/p6.png'
import p7 from '../Images/p7.png'
import p8 from '../Images/p8.png'
import { FaStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';



const Products= [
    {
        id:1,
        image:p1 ,
        name: 'Garri',
        price: 'N2000'
    },
    {
        id:2,
        image:p2 ,
        name: 'Plantain',
        price: 'N3000'
    },
    {
        id:3,
        image:p3 ,
        name: 'Sweet potato',
        price: 'N1500'
    },
    {
        image:p4 ,
        name: 'Pepper',
        price: 'N1000'
    },
    {
        id:5,
        image:p5 ,
        name: 'Tomato',
        price: 'N2200'
    },
    {
        id:6,
        image:p6 ,
        name: 'Corn',
        price: 'N1800'
    },

    {
        id:7,
        image:p7 ,
        name: 'Irish potato',
        price: 'N2400'
    },

    {
        id:8,
        image:p8 ,
        name: 'Onions',
        price: 'N1200'
    }
    
]

const Feature = () => {
  return (
    <div className='features'>
        <div className='feature'>
            <div className='search'>
                <span className='filter'>
                    <MdFilterList className='fil'/>
                    Filter by
                </span>

                <h3>Our Feature Products</h3>

                <div className='inp'>
                    <CiSearch className='s-i'/>
                    <input type="search" placeholder='Search product' />
                </div>

            </div>

            <section className='fc'>

            {
            Products && Products.map(item => (

                <div className='fc-c' key={item.id}>
                    <img src={item.image} alt="" />
                    <div>

                        <div className='name-rate'>
                            <span className='name'>{item.name}</span>
                            <span className='rate'>
                                <FaStar className='star'/>
                                <FaStar className='star'/>
                                <FaStar className='star'/>
                                <FaStar className='star'/>
                                <FaStar className='star'/>
                            </span>
                        </div>

                        <div className='price-react'>
                            <span className='price'>{item.price}</span>
                            <FaRegHeart className='r-i'/>
                        </div>


                        <div className='btns'>
                            <Link to='/overview'><button>See Details</button></Link>
                        </div>
                        

                    </div>

                </div>

            ))
            }

            <div className='see'>
                <Link to='/'><button>See more</button></Link>
            </div>

            


            </section>

        </div>
    </div>
    
  )
}

export default Feature