import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaMoneyBillWave, FaCheckCircle, FaCopy, FaCheck, FaMobileAlt, FaDownload, FaEye, FaUpload, FaImage, FaTimes, FaExclamationTriangle, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import emailjs from '@emailjs/browser';

// ============================================
// Green API Configuration - واتساب
// ============================================
const GREEN_API_ID = '7107591808';
const GREEN_API_TOKEN = '491a6704c7c6496e80c11a32df08da90775e4c3163b24174be';

// ============================================
// EmailJS Configuration - إيميل
// ============================================
const EMAILJS_SERVICE_ID = 'service_tx14iwz';
const EMAILJS_TEMPLATE_ID = 'template_gzck12j';
const EMAILJS_PUBLIC_KEY = 'swJ1iOERZySazluZs';

// ============================================
// ImgBB Configuration - رفع الصور
// ============================================
const IMGBB_API_KEY = '394459e6506333307889cfad5468180f';

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
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  
  // بيانات إنستا باي
  const instapayData = {
    username: 'islam_hamdy12',
    phone: '01027368824',
    link: 'https://ipn.eg/S/islam_hamdy12/instapay/7mgqjZ',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://ipn.eg/S/islam_hamdy12/instapay/7mgqjZ',
  };

  // بيانات التواصل
  const contactData = {
    whatsapp: '201113105440',
    email: 'islam.99.hamdy@gmail.com'
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

  // إنشاء رسالة الطلب للتنسيق النصي (واتساب)
  const createOrderMessageText = () => {
    const orderDate = new Date().toLocaleString('ar-EG');
    const productsList = cartItems.map(item => 
      `• ${item.name} × ${item.quantity} = $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
    ).join('\n');
    
    let message = `🛍️ *طلب جديد من موقع رحيق الجنة*\n\n`;
    message += `📅 *تاريخ الطلب:* ${orderDate}\n`;
    message += `💰 *طريقة الدفع:* ${paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'إنستا باي'}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📦 *المنتجات:*\n${productsList}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *المجموع الفرعي:* $${getCartTotal().toFixed(2)}\n`;
    message += `🚚 *الشحن:* ${shippingCost === 0 ? 'مجاني' : `$${shippingCost}`}\n`;
    message += `💰 *الإجمالي:* $${finalTotal.toFixed(2)}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *معلومات العميل:*\n`;
    message += `• الاسم: ${shippingInfo.fullName}\n`;
    message += `• الهاتف: ${shippingInfo.phone}\n`;
    message += `• البريد: ${shippingInfo.email}\n`;
    message += `• العنوان: ${shippingInfo.address}\n\n`;
    
    if (paymentMethod === 'instapay') {
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💳 *معلومات التحويل (إنستا باي):*\n`;
      message += `• اسم المرسل: ${instapayInfo.senderName}\n`;
      message += `• المبلغ المحول: $${instapayInfo.amount}\n`;
      message += `• رقم المعاملة: ${instapayInfo.transactionId}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✨ *شكراً لتسوقك مع رحيق الجنة* ✨`;
    
    return message;
  };

  // ============================================
  // رفع الصورة إلى ImgBB
  // ============================================
  const uploadImageToImgBB = async (imageBase64) => {
    try {
      let base64Data = imageBase64;
      if (imageBase64.includes(',')) {
        base64Data = imageBase64.split(',')[1];
      }
      
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('key', IMGBB_API_KEY);
      
      const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await uploadResponse.json();
      
      if (data.success) {
        console.log('✅ تم رفع الصورة بنجاح:', data.data.url);
        return data.data.url;
      } else {
        console.error('❌ فشل رفع الصورة:', data.error);
        return null;
      }
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      return null;
    }
  };

  // ============================================
  // إرسال إلى واتساب عبر Green API (تم التعديل)
  // ============================================
  const sendToWhatsAppAuto = async () => {
    const message = createOrderMessageText();
    const chatId = `${contactData.whatsapp}@c.us`;
    
    const url = `https://api.green-api.com/waInstance${GREEN_API_ID}/sendMessage/${GREEN_API_TOKEN}`;
    
    try {
      const _response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId, message: message })
      });
      
      const data = await _response.json();
      
      if (data.idMessage) {
        console.log('✅ تم إرسال الطلب إلى واتساب بنجاح');
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في Green API:', error);
      return false;
    }
  };

  // ============================================
  // إرسال صورة الإيصال إلى واتساب (تم التعديل)
  // ============================================
  const sendImageToWhatsApp = async (imageUrl) => {
    const chatId = `${contactData.whatsapp}@c.us`;
    
    const url = `https://api.green-api.com/waInstance${GREEN_API_ID}/sendFileByUrl/${GREEN_API_TOKEN}`;
    
    try {
      const _response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chatId,
          urlFile: imageUrl,
          fileName: 'receipt.jpg',
          caption: '📸 إيصال الدفع - رحيق الجنة'
        })
      });
      
      const data = await _response.json();
      
      if (data.idMessage) {
        console.log('✅ تم إرسال صورة الإيصال بنجاح');
        return true;
      }
    } catch (error) {
      console.error('خطأ في إرسال الصورة:', error);
    }
    return false;
  };

  // ============================================
  // إرسال إلى البريد الإلكتروني عبر EmailJS
  // ============================================
  const sendToEmailAuto = async (imageUrl) => {
    const productsText = cartItems.map(item => 
      `${item.name} × ${item.quantity} = $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const templateParams = {
      customer_name: shippingInfo.fullName,
      customer_phone: shippingInfo.phone,
      customer_email: shippingInfo.email,
      customer_address: shippingInfo.address,
      order_date: new Date().toLocaleString('ar-EG'),
      payment_method: paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'إنستا باي',
      products_list: productsText,
      subtotal: `$${getCartTotal().toFixed(2)}`,
      shipping: shippingCost === 0 ? 'مجاني' : `$${shippingCost}`,
      total: `$${finalTotal.toFixed(2)}`,
      instapay_details: paymentMethod === 'instapay' ? 'true' : 'false',
      sender_name: instapayInfo.senderName || 'غير متاح',
      transfer_amount: instapayInfo.amount ? `$${instapayInfo.amount}` : 'غير متاح',
      transaction_id: instapayInfo.transactionId || 'غير متاح',
      payment_image_url: imageUrl || 'غير متاح'
    };
    
    try {
      const emailResponse = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('✅ تم إرسال الإيميل بنجاح!', emailResponse);
      return true;
    } catch (error) {
      console.error('❌ فشل إرسال الإيميل:', error);
      return false;
    }
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
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

  const handlePaymentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
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

  const validateInstapayForm = () => {
    const newErrors = {};
    
    if (!instapayInfo.transactionId?.trim()) {
      newErrors.transactionId = 'رقم المعاملة مطلوب';
    }
    if (!instapayInfo.senderName?.trim()) {
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
    
    if (!shippingInfo.fullName?.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }
    if (!shippingInfo.phone?.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[\d\s\-+()]+$/.test(shippingInfo.phone)) {
      newErrors.phone = 'رقم هاتف غير صحيح';
    }
    if (!shippingInfo.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'بريد إلكتروني غير صحيح';
    }
    if (!shippingInfo.address?.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    return newErrors;
  };

  const confirmOrder = async () => {
    let allErrors = {};
    
    if (paymentMethod === 'instapay') {
      const instapayErrors = validateInstapayForm();
      allErrors = { ...allErrors, ...instapayErrors };
    }
    
    const shippingErrors = validateShippingForm();
    allErrors = { ...allErrors, ...shippingErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSending(true);
    
    // حفظ الطلب في localStorage
    const orderData = {
      orderId: Date.now(),
      orderDate: new Date().toISOString(),
      products: cartItems,
      total: finalTotal,
      paymentMethod: paymentMethod,
      shippingInfo: shippingInfo,
      instapayInfo: paymentMethod === 'instapay' ? instapayInfo : null,
      status: 'pending'
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // رفع الصورة وإرسال البيانات
    let imageUrl = '';
    if (paymentMethod === 'instapay' && paymentImagePreview) {
      console.log('📸 جاري رفع صورة الدفع...');
      imageUrl = await uploadImageToImgBB(paymentImagePreview);
    }
    
    // إرسال الرسالة إلى واتساب
    await sendToWhatsAppAuto();
    
    // إرسال صورة الإيصال إلى واتساب (إذا وجدت)
    if (imageUrl) {
      await sendImageToWhatsApp(imageUrl);
    }
    
    // إرسال إلى البريد الإلكتروني
    await sendToEmailAuto(imageUrl);
    
    setTimeout(() => {
      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        setShowCheckoutModal(false);
        setOrderComplete(false);
        setIsSending(false);
        navigate('/order-success');
      }, 2000);
    }, 1000);
  };

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
  };

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

                  {/* بيانات إنستا باي مع الصورة */}
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

                      {/* رفع صورة الدفع */}
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
                  <button className="btn-confirm" onClick={confirmOrder} disabled={isSending}>
                    {isSending ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                  </button>
                </div>
              </>
            ) : (
              <div className="order-success">
                <FaCheckCircle />
                <h3>تم استلام طلبك بنجاح!</h3>
                <p>شكراً لتسوقك معنا. تم إرسال تفاصيل الطلب إلى:</p>
                <div className="contact-sent">
                  <div className="contact-sent-item">
                    <FaWhatsapp />
                    <span>واتساب: {contactData.whatsapp}</span>
                  </div>
                  <div className="contact-sent-item">
                    <FaEnvelope />
                    <span>البريد: {contactData.email}</span>
                  </div>
                </div>
                <p>سيتم مراجعة طلبك والتواصل معك قريباً.</p>
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