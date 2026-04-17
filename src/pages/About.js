import React from 'react';
import { FaLeaf, FaTruck, FaAward, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { GiBee, GiFlowerPot } from 'react-icons/gi';

const About = () => {
  return (
    <section className="about-page">
      <div className="about-container">
        <div className="about-content">
          <h2>مرحباً بكم في <span className="gold">رحيق الجنة</span></h2>
          <p className="about-intro">نحن متخصصون في إنتاج وتسويق أجود أنواع العسل الطبيعي النقي من مصادر متنوعة: <strong>حبة البركة، الموالح، الموز، البرسيم، البرقدوش، الزعتر، وسدر جبل مصري</strong>.</p>
          
          <h3>لماذا <span className="gold">عسل رحيق الجنة</span> هو الأفضل؟</h3>
          <p>نحن نربي نحلنا في أفضل المراعي الطبيعية البعيدة عن الملوثات والمبيدات الحشرية. نستخدم أحدث الطرق في تربية النحل مع الحفاظ على الطرق التقليدية في استخلاص العسل بطرق باردة للحفاظ على الإنزيمات الطبيعية وحبوب اللقاح والعناصر الغذائية.</p>
          <p>كل منتج من منتجاتنا يأتي مع تحليل مخبري يثبت نقاوته وخلوه من المضادات الحيوية والسكر المضاف. نقدم لكم تشكيلة واسعة تناسب جميع الأذواق والاحتياجات الصحية.</p>
          
          <h3><GiFlowerPot /> أنواع العسل التي نقدمها:</h3>
          <div className="honey-types">
            <div className="type-badge">🍯 عسل حبة البركة</div>
            <div className="type-badge">🍊 عسل الموالح</div>
            <div className="type-badge">🍌 عسل الموز</div>
            <div className="type-badge">🌿 عسل البرسيم</div>
            <div className="type-badge">🌱 عسل البرقدوش</div>
            <div className="type-badge">🌸 عسل الزعتر</div>
            <div className="type-badge">⛰️ عسل سدر جبل مصري</div>
          </div>

          <h3><FaLeaf /> الفوائد العامة للعسل الطبيعي:</h3>
          <ul className="benefits-list">
            <li><FaLeaf /> يقوي المناعة ويزيد النشاط والحيوية</li>
            <li><FaLeaf /> مفيد للجهاز الهضمي ويعالج القرحة</li>
            <li><FaLeaf /> مصدر طبيعي للطاقة والسعرات الصحية</li>
            <li><FaLeaf /> غني بمضادات الأكسدة التي تحارب الشيخوخة</li>
            <li><FaLeaf /> يساعد في علاج الحساسية الموسمية</li>
            <li><FaLeaf /> يحسن جودة النوم ويقلل التوتر</li>
            <li><FaLeaf /> مضاد طبيعي للبكتيريا والالتهابات</li>
            <li><FaLeaf /> مفيد لصحة القلب والشرايين</li>
          </ul>

          <div className="stats">
            <div><span>+1000</span><br />خلية نحل</div>
            <div><span>+25</span><br />عام خبرة</div>
            <div><span>20k+</span><br />عميل سعيد</div>
            <div><span>7+</span><br />أنواع عسل</div>
          </div>

          <div className="quality-badges">
            <div className="quality-item">
              <FaShieldAlt />
              <span>طبيعي 100%</span>
            </div>
            <div className="quality-item">
              <FaAward />
              <span>جودة عالية</span>
            </div>
            <div className="quality-item">
              <FaHeart />
              <span>عضوي</span>
            </div>
          </div>
        </div>
        
        <div className="about-img">
          <img src="https://images.pexels.com/photos/6133802/pexels-photo-6133802.jpeg?auto=compress&cs=tinysrgb&w=600" alt="منحل عسل طبيعي" />
          <img src="https://images.pexels.com/photos/1358902/pexels-photo-1358902.jpeg?auto=compress&cs=tinysrgb&w=600" alt="خلايا النحل" />
          <img src="https://images.pexels.com/photos/16678344/pexels-photo-16678344/free-photo-of-white-clover-flowers.jpeg?auto=compress&cs=tinysrgb&w=600" alt="زهور العسل" />
          <div className="quote">
            <GiBee className="quote-icon" />
            <p>"الشفاء في ثلاث: شرطة محجم، أو شربة عسل، أو كية بنار"</p>
            <span>- النبي محمد ﷺ</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;