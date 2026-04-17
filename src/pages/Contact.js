import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

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
          <p><FaPhoneAlt /> +966 12 345 6789</p>
          <p><FaEnvelope /> info@raheeqaljannah.com</p>
          <p><FaMapMarkerAlt /> الرياض، المملكة العربية السعودية</p>
          <div className="working-hours">
            <h4><FaClock /> ساعات العمل</h4>
            <p>السبت - الخميس: 9ص - 9م</p>
            <p>الجمعة: مغلق</p>
          </div>
          <div className="social-media">
            <h4>تابعنا</h4>
            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;