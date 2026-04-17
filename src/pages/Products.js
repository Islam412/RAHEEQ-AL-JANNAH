import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { addToCart } = useCart();

  const products = [
    { 
      id: 1, 
      name: 'عسل حبة البركة', 
      price: '65', 
      oldPrice: '85', 
      image: 'https://images.pexels.com/photos/6010455/pexels-photo-6010455.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'عسل طبيعي مدعم بحبة البركة، يجمع بين فوائد العسل وحبة البركة المباركة.', 
      badge: 'الأكثر مبيعاً',
      category: 'عسل مدعم'
    },
    { 
      id: 2, 
      name: 'عسل الموالح', 
      price: '50', 
      oldPrice: '70', 
      image: 'https://images.pexels.com/photos/7663183/pexels-photo-7663183.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'مستخرج من أزهار الموالح (البرتقال والليمون)، يتميز برائحة منعشة وطعم مميز.', 
      badge: 'عرض خاص',
      category: 'عسل زهور'
    },
    { 
      id: 3, 
      name: 'عسل الموز', 
      price: '48', 
      oldPrice: '68', 
      image: 'https://images.pexels.com/photos/5636255/pexels-photo-5636255.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 4, 
      description: 'عسل مستخلص من رحيق أزهار الموز، غني بالبوتاسيوم والفيتامينات.', 
      badge: null,
      category: 'عسل فواكه'
    },
    { 
      id: 4, 
      name: 'عسل البرسيم', 
      price: '45', 
      oldPrice: '60', 
      image: 'https://images.pexels.com/photos/4040805/pexels-photo-4040805.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'عسل البرسيم النقي، لون فاتح وطعم معتدل، مثالي للاستخدام اليومي.', 
      badge: 'عضوي',
      category: 'عسل زهور'
    },
    { 
      id: 5, 
      name: 'عسل البرقدوش (المردقوش)', 
      price: '70', 
      oldPrice: '95', 
      image: 'https://images.pexels.com/photos/1358902/pexels-photo-1358902.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'عسل البرقدوش العطري، مفيد للجهاز التنفسي والهضمي، نقي 100%.', 
      badge: 'جودة فاخرة',
      category: 'عسل أعشاب'
    },
    { 
      id: 6, 
      name: 'عسل الزعتر', 
      price: '60', 
      oldPrice: '80', 
      image: 'https://images.pexels.com/photos/6133802/pexels-photo-6133802.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'عسل الزعتر الجبلي، غني بمضادات الأكسدة، يعزز المناعة ويحسن الهضم.', 
      badge: 'مطلوب',
      category: 'عسل أعشاب'
    },
    { 
      id: 7, 
      name: 'عسل سدر جبل مصري', 
      price: '85', 
      oldPrice: '120', 
      image: 'https://images.pexels.com/photos/16678344/pexels-photo-16678344/free-photo-of-white-clover-flowers.jpeg?auto=compress&cs=tinysrgb&w=600', 
      rating: 5, 
      description: 'أفخر أنواع العسل المصري، من جبال السدر في مصر، عسل داكن غني بالفوائد العلاجية.', 
      badge: 'الأفضل',
      category: 'عسل جبلي'
    }
  ];

  return (
    <section className="products-page">
      <div className="section-title">
        <h2>تشكيلة <span className="gold">عسل رحيق الجنة</span></h2>
        <div className="title-line"></div>
        <p className="section-subtitle">من رحيق الجنة إليكم، أجود أنواع العسل الطبيعي</p>
      </div>
      <div className="products-grid">
        {products.map((product, idx) => (
          <div className="product-card" key={product.id} style={{animationDelay: `${idx * 0.1}s`}}>
            <div className="product-img">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="sale-badge">{product.badge}</span>}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < product.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <p className="product-desc">{product.description}</p>
              <div className="price">
                <span className="current">${product.price}</span>
                <span className="old">${product.oldPrice}</span>
              </div>
              <div className="product-buttons">
                <Link to={`/product/${product.id}`}>
                  <button className="btn-details">تفاصيل</button>
                </Link>
                <button onClick={() => addToCart(product)} className="btn-add">أضف للسلة</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;