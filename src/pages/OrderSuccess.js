import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess = () => {
  return (
    <div className="order-success-page">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>تم استلام طلبك بنجاح!</h1>
        <p>شكراً لتسوقك مع <span className="gold">رحيق الجنة</span></p>
        <div className="order-details">
          <p>سيتم تأكيد طلبك عبر البريد الإلكتروني خلال 24 ساعة</p>
          <p>رقم الطلب: <strong>#ORD-{Math.floor(Math.random() * 100000)}</strong></p>
        </div>
        <div className="success-buttons">
          <Link to="/">
            <button className="btn-home">
              <FaHome /> العودة للرئيسية
            </button>
          </Link>
          <Link to="/products">
            <button className="btn-shop">
              <FaShoppingBag /> متابعة التسوق
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;