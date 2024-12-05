import React, { useState, useEffect } from 'react';
import { MdFilterList } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Supabase } from "../config/supabase-config"; // Import Supabase
import { IoIosHeart } from "react-icons/io";
import { IoIosStar } from "react-icons/io";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await Supabase
          .from('agrovest-products')
          .select('*')
          .eq('availability', 'In-stock')
          .eq('farmerstatus', 'verified')
          .eq('state', 'Approved');

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(item =>
    item.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='f-spinner' style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        {/* <p>Loading...</p> */}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='features'>
      <div className="f-arr">
        <Link to='/'><FaArrowLeftLong className='arr-i'/></Link>
      </div>
      <div className='feature'>
        <div className="f-s">
          <div className='search'>
            <h3>All Products</h3>
            <div className='inp'>
              <CiSearch className='s-i' />
              <input
                type="search"
                placeholder='Search product'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="feat-c">
          <section className='fc'>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(item => (
                <div className='fc-c' key={item.id}>
                  <img src={`https://wgfidvtzcblzcnstkyae.supabase.co/storage/v1/object/public/agrovest-product-images/${item.image}`} alt={item.image} />
                  <div>
                    <IoIosHeart className='p-hrt'/>
                    <div className='name-rate'>
                      <div>
                        <p className='name'>{item.productname}</p>
                        <p className='price'>₦{item.metadata.price}</p>
                        <div className="rate">
                          <IoIosStar className='star'/>
                          <IoIosStar className='star'/>
                          <IoIosStar className='star'/>
                          <IoIosStar className='star'/>
                        </div>
                      </div>
                      <div className='btns'>
                        <Link to={`/overview/${item.id}`}><button>See Details</button></Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center' }}>No products match your search.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
