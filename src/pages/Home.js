import React from 'react';
import { Link } from 'react-router-dom';
import { GiFlowerPot } from 'react-icons/gi';
import { FaTruck, FaAward } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge animate-slide-up">عسل طبيعي 100%</div>
          <h1 className="animate-slide-up">افضل واجود <span className="gold">انواع عسل النحل</span><br />نقاء وصفاء من رحيق الجنة</h1>
          <p className="animate-slide-up delay-1">من أجود خلايا نحل البرسيم، نقدم لكم عسلاً فاتح اللون، عطري المذاق، غنياً بالفوائد.</p>
          <Link to="/products">
            <button className="btn-primary animate-slide-up delay-2">اكتشف التشكيلة</button>
          </Link>
        </div>
        <div className="honey-drip"></div>
      </section>

      <section className="features reveal">
        <div className="feature-card">
          <GiFlowerPot className="feature-icon" />
          <h3>زهور البرسيم الأبيض</h3>
          <p>نحلنا يرعى في حقول البرسيم النقية الخالية من المبيدات.</p>
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
    </>
  );
};

export default Home;