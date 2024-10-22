import React, { useState, useEffect } from 'react';
import { MdFilterList } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { Supabase } from "../config/supabase-config"; // Import Supabase

const Feature = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch 8 In-stock products from agrovest-products table
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await Supabase
          .from('agrovest-products') // Table name
          .select('*')
          .eq('availability', 'In-stock') // Filter for availability
            .eq('farmerstatus', 'verified') // Filter for farmerstatus
            .eq('state', 'approved')  // Filter for availability
          .limit(4); // Limit to 8 products

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='features'>
      <div className='feature'>
        <div className='search'>
          <span className='filter'>
            <MdFilterList className='fil' />
            Filter by
          </span>

          <h3>Our Feature Products</h3>

          <div className='inp'>
            <CiSearch className='s-i' />
            <input type="search" placeholder='Search product' />
          </div>
        </div>

        <section className='fc'>
          {products && products.map(item => (
            <div className='fc-c' key={item.id}>
              <img src={`https://wgfidvtzcblzcnstkyae.supabase.co/storage/v1/object/public/agrovest-product-images/${item.image}`} alt={item.image} /> {/* Use dynamic image_url */}
              <div>
                <div className='name-rate' style={{ marginBottom: '15px' }}>
                  <span className='name'>{item.productname}</span>
                  <span className='price'>₦{item.metadata.price}</span>
                </div>

                <div className='btns'>
                  <Link to={`/overview/${item.id}`}><button>See Details</button></Link>
                </div>
              </div>
            </div>
          ))}

          <div className='see'>
            <Link to='/all-products'><button>See All</button></Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Feature;

