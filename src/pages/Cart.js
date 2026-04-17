import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaCreditCard, FaPaypal, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const shippingCost = getCartTotal() > 200 ? 0 : 10;
  const finalTotal = getCartTotal() + shippingCost;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const confirmOrder = () => {
    // هنا يمكن إضافة كود لإرسال الطلب إلى الخادم
    setOrderComplete(true);
    setTimeout(() => {
      clearCart(); // إفراغ السلة
      setShowCheckoutModal(false);
      setOrderComplete(false);
      navigate('/order-success'); // التوجيه لصفحة نجاح الطلب
    }, 2000);
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="cart-empty">
        <FaShoppingCart />
        <h2>سلة التسوق فارغة</h2>
        <p>أضف بعض منتجات العسل اللذيذة إلى سلتك</p>
        <Link to="/products">
          <button className="btn-primary">تسوق الآن</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>سلة <span className="gold">التسوق</span></h2>
      
      {/* شريط التقدم */}
      <div className="cart-progress">
        <div className={`progress-step ${cartItems.length > 0 ? 'active' : ''}`}>
          <span>1</span>
          <p>السلة</p>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${showCheckoutModal ? 'active' : ''}`}>
          <span>2</span>
          <p>الدفع</p>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${orderComplete ? 'active' : ''}`}>
          <span>3</span>
          <p>إتمام</p>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <p>المنتج</p>
            <p>السعر</p>
            <p>الكمية</p>
            <p>الإجمالي</p>
          </div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-product">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">عسل طبيعي</p>
                </div>
              </div>
              <p className="cart-item-price">${item.price}</p>
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                <p>${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span>المجموع الفرعي:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>الشحن:</span>
            <span>{shippingCost === 0 ? 'مجاني' : `$${shippingCost}`}</span>
          </div>
          <div className="summary-row discount">
            <span>الخصم:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>الإجمالي:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          {getCartTotal() < 200 && getCartTotal() > 0 && (
            <div className="free-shipping-notice">
              أضف ${(200 - getCartTotal()).toFixed(2)} للحصول على شحن مجاني
              <div className="shipping-progress-bar">
                <div className="shipping-progress-fill" style={{width: `${(getCartTotal() / 200) * 100}%`}}></div>
              </div>
            </div>
          )}
          <button className="btn-checkout" onClick={handleCheckout}>
            إتمام الشراء
          </button>
          <Link to="/products" className="continue-shopping">
            ← متابعة التسوق
          </Link>
        </div>
      </div>

      {/* مودال الدفع */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>إتمام عملية الشراء</h3>
              <button className="modal-close" onClick={() => setShowCheckoutModal(false)}>×</button>
            </div>
            {!orderComplete ? (
              <>
                <div className="modal-body">
                  <h4>ملخص الطلب</h4>
                  <div className="order-summary">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="order-total">
                      <span>الإجمالي</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <h4>طريقة الدفع</h4>
                  <div className="payment-methods">
                    <label className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <FaMoneyBillWave />
                      <span>الدفع عند الاستلام</span>
                    </label>
                    <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <FaCreditCard />
                      <span>إنستا باي</span>
                    </label>
                    {/* <label className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <FaPaypal />
                      <span>باي بال</span>
                    </label> */}
                  </div>

                  <h4>معلومات الشحن</h4>
                  <form className="shipping-form">
                    <input type="text" placeholder="الاسم الكامل" required />
                    <input type="tel" placeholder="رقم الهاتف" required />
                    <input type="email" placeholder="البريد الإلكتروني" required />
                    <textarea placeholder="العنوان بالكامل" rows="3" required></textarea>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowCheckoutModal(false)}>إلغاء</button>
                  <button className="btn-confirm" onClick={confirmOrder}>تأكيد الطلب</button>
                </div>
              </>
            ) : (
              <div className="order-success">
                <FaCheckCircle />
                <h3>تم استلام طلبك بنجاح!</h3>
                <p>شكراً لتسوقك معنا. سنقوم بتأكيد طلبك خلال 24 ساعة.</p>
                <div className="loading-spinner"></div>
                <p className="redirecting">جاري التحويل...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;