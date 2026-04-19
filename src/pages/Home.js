import React from 'react';
import { Link } from 'react-router-dom';
import { GiFlowerPot } from 'react-icons/gi';
import { FaTruck, FaAward, FaStar } from 'react-icons/fa';

const Home = () => {
  // عرض أفضل 3 منتجات في الصفحة الرئيسية
  const featuredProducts = [
    { id: 1, name: 'عسل حبة البركة', price: '400ج.م', image: 'https://images.pexels.com/photos/6010455/pexels-photo-6010455.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 5 },
    { id: 7, name: 'عسل سدر جبل مصري', price: '1200ج.م', image: 'https://images.pexels.com/photos/16678344/pexels-photo-16678344/free-photo-of-white-clover-flowers.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 5 },
    { id: 6, name: 'عسل الزعتر', price: '330ج.م', image: 'https://images.pexels.com/photos/6133802/pexels-photo-6133802.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 5 },
    { id: 2, name: 'عسل الموالح', price: '400ج.م', image: 'https://images.pexels.com/photos/6133802/pexels-photo-6133802.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 5 },
  ];

  return (
    <>
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge animate-slide-up">عسل طبيعي 100%</div>
          <h1 className="animate-slide-up">عسل <span className="gold">رحيق الجنة</span><br />نقاء وصفاء من الطبيعة</h1>
          <p className="animate-slide-up delay-1">نقدم لكم أجود أنواع العسل الطبيعي: حبة البركة، الموالح، الموز، البرسيم، البرقدوش، الزعتر، وسدر جبل مصري.</p>
          <Link to="/products">
            <button className="btn-primary animate-slide-up delay-2">اكتشف التشكيلة</button>
          </Link>
        </div>
        <div className="honey-drip"></div>
      </section>

      <section className="features reveal">
        <div className="feature-card">
          <GiFlowerPot className="feature-icon" />
          <h3>عسل طبيعي 100%</h3>
          <p>نقدم لكم عسلاً نقياً من أجود أنواع الزهور والنباتات.</p>
        </div>
        <div className="feature-card">
          <FaTruck className="feature-icon" />
          <h3>توصيل مجاني</h3>
          <p>للطلبات التي تزيد عن 200 ريال، نصل لباب منزلك.</p>
        </div>
        <div className="feature-card">
          <FaAward className="feature-icon" />
          <h3>جودة مضمونة</h3>
          <p>مع تحليل مخبري يثبت نقاوة العسل وخلوه من الغش.</p>
        </div>
      </section>

      <section className="featured-products reveal">
        <div className="section-title">
          <h2>أشهر <span className="gold">منتجاتنا</span></h2>
          <div className="title-line"></div>
          <p className="section-subtitle">أفضل ما نقدمه لعملائنا الكرام</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product, idx) => (
            <div className="product-card" key={product.id}>
              <div className="product-img">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                {/* rating */}
                {/* <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < product.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div> */}
                <div className="price">
                  <span className="current">{product.price}</span>
                </div>
                <Link to={`/product/${product.id}`}>
                  <button className="btn-add">تفاصيل المنتج</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link to="/products">
            <button className="btn-primary">عرض جميع المنتجات</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;