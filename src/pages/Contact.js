import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('شكراً لتواصلك معنا! سنرد عليك قريباً.');
    setFormData({ name: '', email: '', message: '' });
  };

  // رقم الواتساب (بدون أصفار أولية مع كود الدولة)
  const whatsappNumber = '201113105440';

  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-form">
          <h2>تواصل <span className="gold">معنا</span></h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="الاسم الكامل" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="tel" 
              placeholder="رقم الهاتف (اختياري)" 
            />
            <textarea 
              placeholder="رسالتك ..." 
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            ></textarea>
            <button type="submit" className="btn-primary">إرسال الرسالة</button>
          </form>
        </div>
        <div className="contact-info">
          <h3>رحيق الجنة لعسل النحل</h3>
          
          {/* ✅ رقم الهاتف - يفتح تطبيق الهاتف */}
          <p>
            <FaPhoneAlt /> 
            <a href="tel:+201113105440" className="contact-link">011 1310 5440</a>
          </p>
          
          {/* ✅ رقم الواتساب - يفتح واتساب مباشرة */}
          <p>
            <FaWhatsapp /> 
            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link whatsapp-link"
            >
              011 1310 5440 (واتساب)
            </a>
          </p>
          
          {/* ✅ البريد الإلكتروني */}
          <p>
            <FaEnvelope /> 
            <a href="mailto:info@raheeqaljannah.com" className="contact-link">info@raheeqaljannah.com</a>
          </p>
          
          {/* ✅ العنوان - يفتح خرائط جوجل */}
          <p>
            <FaMapMarkerAlt /> 
            <a 
              href="https://maps.google.com/?q=Riyadh+Saudi+Arabia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              الرياض، المملكة العربية السعودية
            </a>
          </p>
          
          <div className="working-hours">
            <h4><FaClock /> ساعات العمل</h4>
            <p>السبت - الخميس: 9ص - 9م</p>
            <p>الجمعة: مغلق</p>
          </div>
          
          <div className="social-media">
            <h4>تابعنا</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;