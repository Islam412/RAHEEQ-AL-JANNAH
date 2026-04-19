import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { addToCart } = useCart();

  const products = [
    { 
      id: 1, 
      name: 'عسل حبة البركة', 
      price: '400', 
      oldPrice: '430', 
      image: '/images/barka.png', 
      description: 'عسل طبيعي مدعم بحبة البركة، يجمع بين فوائد العسل وحبة البركة المباركة.', 
      badge: 'الأكثر مبيعاً',
      category: 'عسل مدعم'
    },
    { 
      id: 2, 
      name: 'عسل الموالح', 
      price: '400', 
      oldPrice: '430', 
      image: '/images/mwaleh.png', 
      description: 'مستخرج من أزهار الموالح (البرتقال والليمون)، يتميز برائحة منعشة وطعم مميز.', 
      badge: 'عرض خاص',
      category: 'عسل زهور'
    },
    { 
      id: 3, 
      name: 'عسل الموز', 
      price: '380', 
      oldPrice: '400', 
      image: '/images/banan.png', 
      description: 'عسل مستخلص من رحيق أزهار الموز، غني بالبوتاسيوم والفيتامينات.', 
      badge: null,
      category: 'عسل فواكه'
    },
    { 
      id: 4, 
      name: 'عسل البرسيم', 
      price: '300', 
      oldPrice: '315', 
      image: '/images/barsem.png', 
      description: 'عسل البرسيم النقي، لون فاتح وطعم معتدل، مثالي للاستخدام اليومي.', 
      badge: 'عضوي',
      category: 'عسل زهور'
    },
    { 
      id: 5, 
      name: 'عسل البرقدوش', 
      price: '450', 
      oldPrice: '500', 
      image: '/images/barkadosh.png', 
      description: 'عسل البرقدوش العطري، مفيد للجهاز التنفسي والهضمي، نقي 100%.', 
      badge: 'جودة فاخرة',
      category: 'عسل أعشاب'
    },
    { 
      id: 6, 
      name: 'عسل الزعتر', 
      price: '330', 
      oldPrice: '350', 
      image: '/images/zahter.png', 
      rating: 5, 
      description: 'عسل الزعتر الجبلي، غني بمضادات الأكسدة، يعزز المناعة ويحسن الهضم.', 
      badge: 'مطلوب',
      category: 'عسل أعشاب'
    },
    { 
      id: 7, 
      name: 'عسل سدر جبل مصري', 
      price: '1200', 
      oldPrice: '1400', 
      image: '/images/sader.png', 
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
          <div className="product-card" key={product.id} style={{animationDelay: `E£ {idx * 0.1}s`}}>
            <div className="product-img">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="sale-badge">{product.badge}</span>}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              {/* <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < product.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div> */}
              <p className="product-desc">{product.description}</p>
              <div className="price">
                <span className="current">E£ {product.price}</span>
                <span className="old">E£ {product.oldPrice}</span>
              </div>
              <div className="product-buttons">
                <Link to={`/product/E£ {product.id}`}>
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