import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setResult({ show: false, message: '', type: '' });

    const formDataObj = new FormData();
    formDataObj.append("access_key", "a3e00d07-3e23-4ce7-8960-6565b7b5e0ad");
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone || 'غير مدخل');
    formDataObj.append("message", formData.message);
    formDataObj.append("subject", `رسالة جديدة من ${formData.name} - رحيق الجنة`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          show: true,
          message: '✅ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
          type: 'success'
        });
        // تنظيف النموذج
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setResult({
          show: true,
          message: '❌ حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
          type: 'error'
        });
      }
    } catch (error) {
      setResult({
        show: true,
        message: '❌ حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.',
        type: 'error'
      });
    } finally {
      setIsSending(false);
      // إخفاء الرسالة بعد 5 ثواني
      setTimeout(() => {
        setResult({ show: false, message: '', type: '' });
      }, 5000);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-form">
          <h2>تواصل <span className="gold">معنا</span></h2>
          
          {/* رسالة الحالة */}
          {result.show && (
            <div className={`status-message ${result.type}`}>
              {result.message}
            </div>
          )}
          
          <form onSubmit={onSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="الاسم الكامل *" 
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder="البريد الإلكتروني *" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="رقم الهاتف*" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea 
              name="message"
              placeholder="رسالتك ... *" 
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn-primary" disabled={isSending}>
              {isSending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        </div>
        
        <div className="contact-info">
          <h3>رحيق الجنة لعسل النحل</h3>
          
          <p>
            <FaPhoneAlt /> 
            <a href="tel:+201113105440" className="contact-link">011 1310 5440</a>
          </p>
          
          <p>
            <FaWhatsapp /> 
            <a href="https://wa.me/201113105440" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp-link">
              011 1310 5440 (واتساب)
            </a>
          </p>
          
          <p>
            <FaEnvelope /> 
            <a href="mailto:hussein.99.hamdy@gmail.com" className="contact-link">hussein.99.hamdy@gmail.com</a>
          </p>
          
          {/* <p>
            <FaMapMarkerAlt /> 
            <a href="https://maps.google.com/?q=Giza+Egypt" target="_blank" rel="noopener noreferrer" className="contact-link">
              الجيزة - مصر
            </a>
          </p> */}
          
          <div className="working-hours">
            <h4><FaClock /> ساعات العمل</h4>
            <p>السبت : الخميس: 9ص : 9م</p>
            <p>الجمعة: مغلق</p>
          </div>
          
          {/* <div className="social-media">
            <h4>تابعنا</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://wa.me/201113105440" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;