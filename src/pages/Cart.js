import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaQrcode, FaLink, FaCopy, FaCheck, FaMobileAlt, FaDownload, FaEye, FaUpload, FaImage, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [copied, setCopied] = useState(false);
  const [showFullQR, setShowFullQR] = useState(false);
  const [paymentImage, setPaymentImage] = useState(null);
  const [paymentImagePreview, setPaymentImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  
  // بيانات إنستا باي
  const instapayData = {
    username: 'islam_hamdy12',
    phone: '01027368824',
    link: 'https://ipn.eg/S/islam_hamdy12/instapay/7mgqjZ',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://ipn.eg/S/islam_hamdy12/instapay/7mgqjZ',
  };

  // بيانات نموذج الدفع
  const [instapayInfo, setInstapayInfo] = useState({
    transactionId: '',
    senderName: '',
    amount: '',
    paymentProof: null
  });

  // بيانات الشحن
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  const shippingCost = getCartTotal() > 200 ? 0 : 10;
  const finalTotal = getCartTotal() + shippingCost;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
    // إعادة تعيين الأخطاء عند فتح المودال
    setErrors({});
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = 'instapay-qr-code.png';
    link.href = instapayData.qrImageUrl;
    link.click();
  };

  // معالجة رفع صورة الدفع
  const handlePaymentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // التحقق من حجم الملف (حد أقصى 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors({...errors, paymentImage: 'حجم الصورة كبير جداً (الحد الأقصى 5MB)'});
          return;
        }
        setPaymentImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setInstapayInfo({...instapayInfo, paymentProof: file});
        // إزالة الخطأ عند رفع الصورة
        setErrors({...errors, paymentImage: null});
      } else {
        setErrors({...errors, paymentImage: 'الرجاء رفع ملف صورة صالح (jpg, png, jpeg)'});
      }
    }
  };

  const removePaymentImage = () => {
    setPaymentImage(null);
    setPaymentImagePreview(null);
    setInstapayInfo({...instapayInfo, paymentProof: null});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // التحقق من صحة البيانات
  const validateInstapayForm = () => {
    const newErrors = {};
    
    if (!instapayInfo.transactionId.trim()) {
      newErrors.transactionId = 'رقم المعاملة مطلوب';
    }
    if (!instapayInfo.senderName.trim()) {
      newErrors.senderName = 'اسم المرسل مطلوب';
    }
    if (!instapayInfo.amount) {
      newErrors.amount = 'المبلغ المحول مطلوب';
    } else if (parseFloat(instapayInfo.amount) !== finalTotal) {
      newErrors.amount = `المبلغ يجب أن يساوي $${finalTotal}`;
    }
    if (!paymentImage) {
      newErrors.paymentImage = 'صورة إيصال الدفع مطلوبة';
    }
    
    return newErrors;
  };

  const validateShippingForm = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[\d\s\-+()]+$/.test(shippingInfo.phone)) {
      newErrors.phone = 'رقم هاتف غير صحيح';
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'بريد إلكتروني غير صحيح';
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    return newErrors;
  };

  const confirmOrder = () => {
    let allErrors = {};
    
    if (paymentMethod === 'instapay') {
      // التحقق من بيانات إنستا باي
      const instapayErrors = validateInstapayForm();
      allErrors = { ...allErrors, ...instapayErrors };
    }
    
    // التحقق من بيانات الشحن (لجميع طرق الدفع)
    const shippingErrors = validateShippingForm();
    allErrors = { ...allErrors, ...shippingErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // التمرير إلى أول خطأ
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setOrderComplete(true);
    setTimeout(() => {
      clearCart();
      setShowCheckoutModal(false);
      setOrderComplete(false);
      navigate('/order-success');
    }, 2000);
  };

  // تحديث بيانات الشحن
  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
    // إزالة الخطأ عند الكتابة
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
  };

  // تحديث بيانات إنستا باي
  const handleInstapayChange = (e) => {
    setInstapayInfo({
      ...instapayInfo,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
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
                  <div className="required-fields-warning">
                    <FaExclamationTriangle />
                    <span>جميع الحقول المميزة بـ <span className="required-star">*</span> إلزامية</span>
                  </div>

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
                    <label className={`payment-method ${paymentMethod === 'instapay' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="instapay"
                        checked={paymentMethod === 'instapay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <FaMobileAlt />
                      <span>إنستا باي</span>
                    </label>
                  </div>

                  {/* بيانات إنستا باي مع الصورة - تظهر فقط عند اختيار إنستا باي */}
                  {paymentMethod === 'instapay' && (
                    <div className="instapay-section">
                      <div className="instapay-header">
                        <h4>
                          <FaMobileAlt /> الدفع عبر إنستا باي
                        </h4>
                        <div className="instapay-badge">آمن وسريع</div>
                      </div>
                      
                      <div className="instapay-card">
                        <div className="instapay-qr-section">
                          <div className="qr-container">
                            <img 
                              src={instapayData.qrImageUrl} 
                              alt="InstaPay QR Code" 
                              className="qr-code-image"
                              onClick={() => setShowFullQR(true)}
                            />
                            <div className="qr-overlay" onClick={() => setShowFullQR(true)}>
                              <FaEye />
                              <span>تكبير</span>
                            </div>
                          </div>
                          <div className="qr-actions">
                            <button onClick={downloadQR} className="qr-download-btn">
                              <FaDownload /> تحميل QR Code
                            </button>
                          </div>
                          <p className="qr-note">islam_hamdy12@instapay</p>
                          <p className="qr-powered">Powered by INSTAPAY</p>
                        </div>

                        <div className="instapay-info-section">
                          <div className="info-row">
                            <span>📱 رقم الهاتف:</span>
                            <div className="copyable">
                              <strong>{instapayData.phone}</strong>
                              <button onClick={() => copyToClipboard(instapayData.phone)} className="copy-btn">
                                {copied ? <FaCheck /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                          <div className="info-row">
                            <span>👤 اسم المستخدم:</span>
                            <div className="copyable">
                              <strong>{instapayData.username}</strong>
                              <button onClick={() => copyToClipboard(instapayData.username)} className="copy-btn">
                                {copied ? <FaCheck /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                          <div className="info-row">
                            <span>🔗 رابط الدفع:</span>
                            <div className="copyable link">
                              <a href={instapayData.link} target="_blank" rel="noopener noreferrer">
                                {instapayData.link.substring(0, 35)}...
                              </a>
                              <button onClick={() => copyToClipboard(instapayData.link)} className="copy-btn">
                                {copied ? <FaCheck /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="instapay-steps">
                        <h5>كيفية الدفع عبر إنستا باي:</h5>
                        <ol>
                          <li>افتح تطبيق إنستا باي على هاتفك</li>
                          <li>اختر "مسح الكود" وامسح QR Code أعلاه</li>
                          <li>أدخل المبلغ المطلوب: <strong>${finalTotal.toFixed(2)}</strong></li>
                          <li>قم بتأكيد التحويل</li>
                          <li>قم بتصوير إيصال الدفع (Screenshot)</li>
                          <li>ارفع الصورة أدناه للتأكيد</li>
                        </ol>
                      </div>

                      <h4>تأكيد التحويل <span className="required-star">*</span></h4>
                      <div className="instapay-confirm">
                        <div className="confirm-row">
                          <label>المبلغ المطلوب:</label>
                          <span className="required-amount">${finalTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="form-group">
                          <input
                            type="number"
                            name="amount"
                            placeholder="المبلغ الذي تم تحويله *"
                            value={instapayInfo.amount}
                            onChange={handleInstapayChange}
                            step="0.01"
                            className={errors.amount ? 'error' : ''}
                          />
                          {errors.amount && <span className="error-message">{errors.amount}</span>}
                        </div>
                        
                        <div className="form-group">
                          <input
                            type="text"
                            name="senderName"
                            placeholder="اسم المرسل (كما في إنستا باي) *"
                            value={instapayInfo.senderName}
                            onChange={handleInstapayChange}
                            className={errors.senderName ? 'error' : ''}
                          />
                          {errors.senderName && <span className="error-message">{errors.senderName}</span>}
                        </div>
                        
                        <div className="form-group">
                          <input
                            type="text"
                            name="transactionId"
                            placeholder="رقم المعاملة (Transaction ID) *"
                            value={instapayInfo.transactionId}
                            onChange={handleInstapayChange}
                            className={errors.transactionId ? 'error' : ''}
                          />
                          {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
                        </div>
                      </div>

                      {/* رفع صورة الدفع - إلزامي */}
                      <div className="payment-proof-section">
                        <h4>📸 إيصال الدفع <span className="required-star">*</span></h4>
                        <p className="proof-note">الرجاء رفع صورة واضحة لإيصال الدفع أو لقطة شاشة لعملية التحويل</p>
                        
                        {!paymentImagePreview ? (
                          <div className={`upload-area ${errors.paymentImage ? 'error-border' : ''}`} onClick={() => fileInputRef.current.click()}>
                            <FaUpload />
                            <p>انقر لرفع صورة الدفع</p>
                            <span>jpg, png, jpeg - حد أقصى 5MB</span>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handlePaymentImageUpload}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                          </div>
                        ) : (
                          <div className="payment-preview">
                            <img src={paymentImagePreview} alt="إيصال الدفع" />
                            <div className="payment-preview-actions">
                              <button onClick={() => fileInputRef.current.click()} className="change-image-btn">
                                <FaImage /> تغيير الصورة
                              </button>
                              <button onClick={removePaymentImage} className="remove-image-btn">
                                <FaTimes /> حذف
                              </button>
                            </div>
                          </div>
                        )}
                        {errors.paymentImage && <span className="error-message">{errors.paymentImage}</span>}
                      </div>
                    </div>
                  )}

                  <h4>معلومات الشحن <span className="required-star">*</span></h4>
                  <form className="shipping-form">
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="الاسم الكامل *"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className={errors.fullName ? 'error' : ''}
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="رقم الهاتف *"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="البريد الإلكتروني *"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <textarea
                        name="address"
                        placeholder="العنوان بالكامل *"
                        rows="3"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className={errors.address ? 'error' : ''}
                      ></textarea>
                      {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>
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
                <p>شكراً لتسوقك معنا. سيتم مراجعة إيصال الدفع وتأكيد طلبك خلال 24 ساعة.</p>
                <div className="loading-spinner"></div>
                <p className="redirecting">جاري التحويل...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* مودال تكبير QR Code */}
      {showFullQR && (
        <div className="qr-modal-overlay" onClick={() => setShowFullQR(false)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setShowFullQR(false)}>×</button>
            <img src={instapayData.qrImageUrl} alt="QR Code كبير" />
            <p>islam_hamdy12@instapay</p>
            <p className="qr-powered">Powered by INSTAPAY</p>
            <button onClick={downloadQR} className="qr-download-btn-large">
              <FaDownload /> تحميل الصورة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;