import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaLeaf, FaHeart, FaShare } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState('kg'); // 'kg' أو 'halfKg'

  // أسعار المنتجات (كيلو - نصف كيلو)
  const products = {
    1: { 
      id: 1, 
      name: 'عسل حبة البركة', 
      priceKg: '400', 
      priceHalfKg: '220',
      oldPriceKg: '430', 
      oldPriceHalfKg: '240',
      image: '/images/barka.png', 
      description: 'عسل طبيعي مدعم بحبة البركة، يجمع بين فوائد العسل وحبة البركة المباركة.', 
      longDescription: 'عسل حبة البركة هو مزيج فريد من عسل النحل الطبيعي مع حبة البركة المطحونة (الحبة السوداء). يتميز بفوائد صحية مضاعفة حيث يجمع بين خصائص العسل المضادة للبكتيريا وفوائد حبة البركة في تقوية المناعة. يستخدم منذ القدم في الطب النبوي والتداوي بالأعشاب.',
      benefits: ['يقوي المناعة بشكل مضاعف', 'مفيد لعلاج الحساسية والربو', 'يساعد في الهضم', 'مضاد للالتهابات', 'يقوي الذاكرة'],
      usage: 'ملعقة صغيرة يومياً على الريق أو مع كوب من الماء الدافئ.'
    },
    2: { 
      id: 2, 
      name: 'عسل الموالح', 
      priceKg: '400', 
      priceHalfKg: '220',
      oldPriceKg: '430', 
      oldPriceHalfKg: '240',
      image: '/images/mwaleh.png', 
      description: 'مستخرج من أزهار الموالح (البرتقال والليمون)، يتميز برائحة منعشة وطعم مميز.', 
      longDescription: 'عسل الموالح يتم استخلاصه من رحيق أزهار أشجار البرتقال والليمون واليوسفي. يتميز بلونه الفاتح المائل للاصفرار ورائحته الزكية المنعشة. يحتوي على نسبة عالية من فيتامين C ومضادات الأكسدة.',
      benefits: ['غني بفيتامين C', 'يقوي الجهاز المناعي', 'يحسن المزاج', 'مفيد لنزلات البرد', 'يعزز صحة الجلد'],
      usage: 'يمكن تناوله مع الشاي أو الليمون الدافئ، أو دهنه على الخبز.'
    },
    3: { 
      id: 3, 
      name: 'عسل الموز', 
      priceKg: '380', 
      priceHalfKg: '210',
      oldPriceKg: '400', 
      oldPriceHalfKg: '225',
      image: '/images/banan.png', 
      description: 'عسل مستخلص من رحيق أزهار الموز، غني بالبوتاسيوم والفيتامينات.', 
      longDescription: 'عسل الموز من أنواع العسل النادرة، حيث يتم استخلاصه من رحيق أزهار الموز في المناطق الاستوائية. يتميز بقوامه الكريمي وطعمه الحلو المميز. غني بالبوتاسيوم والمغنيسيوم وفيتامين B6.',
      benefits: ['مصدر طبيعي للبوتاسيوم', 'مفيد لصحة القلب', 'يمنح الطاقة', 'يحسن المزاج', 'يساعد في النوم'],
      usage: 'مثالي مع الفطور، مع الزبادي أو الشوفان.'
    },
    4: { 
      id: 4, 
      name: 'عسل البرسيم', 
      priceKg: '300', 
      priceHalfKg: '170',
      oldPriceKg: '315', 
      oldPriceHalfKg: '180',
      image: '/images/barsem.png', 
      description: 'عسل البرسيم النقي، لون فاتح وطعم معتدل، مثالي للاستخدام اليومي.', 
      longDescription: 'عسل البرسيم من أشهر أنواع العسل في العالم. يتميز بلونه الفاتح الشفاف وطعمه المعتدل الحلاوة. يذوب بسرعة في المشروبات الباردة والساخنة. يعتبر خياراً ممتازاً للاستخدام اليومي لكافة أفراد العائلة.',
      benefits: ['يقوي المناعة', 'مفيد للجهاز الهضمي', 'مصدر طبيعي للطاقة', 'غني بمضادات الأكسدة', 'يساعد في علاج الحساسية الموسمية'],
      usage: 'يستخدم في التحلية اليومية، مع المشروبات، أو في وصفات الطهي.'
    },
    5: { 
      id: 5, 
      name: 'عسل البرقدوش', 
      priceKg: '450', 
      priceHalfKg: '250',
      oldPriceKg: '500', 
      oldPriceHalfKg: '280',
      image: '/images/barkadosh.png', 
      description: 'عسل البرقدوش العطري، مفيد للجهاز التنفسي والهضمي، نقي 100%.', 
      longDescription: 'عسل البرقدوش يتم استخلاصه من رحيق زهور البرقدوش البري (المردقوش). يتميز برائحته العطرية القوية وطعمه اللاذع قليلاً. يستخدم منذ القدم لعلاج مشاكل الجهاز التنفسي والهضمي.',
      benefits: ['مفيد للجهاز التنفسي', 'يساعد في الهضم', 'مضاد للبكتيريا', 'يخفف التوتر', 'يعزز صحة المرأة'],
      usage: 'ملعقة صغيرة مع كوب ماء دافئ أو يضاف إلى مشروبات الأعشاب.'
    },
    6: { 
      id: 6, 
      name: 'عسل الزعتر', 
      priceKg: '330', 
      priceHalfKg: '185',
      oldPriceKg: '350', 
      oldPriceHalfKg: '200',
      image: '/images/zahter.png', 
      description: 'عسل الزعتر الجبلي، غني بمضادات الأكسدة، يعزز المناعة ويحسن الهضم.', 
      longDescription: 'عسل الزعتر من أروع أنواع العسل الجبلي. يتم استخلاصه من رحيق زهور الزعتر البري الذي ينمو في الجبال. يتميز بلونه الداكن وطعمه القوي المميز. يعتبر من أقوى أنواع العسل من حيث الفوائد العلاجية.',
      benefits: ['مضاد قوي للبكتيريا', 'يعالج السعال والتهاب الحلق', 'مفيد للمعدة', 'يقوي الذاكرة', 'يطرد البلغم'],
      usage: 'ملعقة كبيرة يومياً، ممتاز مع الزنجبيل والليمون لنزلات البرد.'
    },
    7: { 
      id: 7, 
      name: 'عسل سدر جبل مصري', 
      priceKg: '1200', 
      priceHalfKg: '650',
      oldPriceKg: '1400', 
      oldPriceHalfKg: '750',
      image: '/images/sader.png', 
      description: 'أفخر أنواع العسل المصري، من جبال السدر في مصر، عسل داكن غني بالفوائد العلاجية.', 
      longDescription: 'عسل السدر الجبلي المصري هو أغلى وأفضل أنواع العسل في العالم. يتم استخلاصه من رحيق أشجار السدر التي تنمو في جبال مصر (سانت كاترين وجبل موسى). يتميز بلونه الداكن المحمر وقوامه الثقيل وطعمه اللاذع المميز. يستخدم في الطب النبوي والعلاج بالأعشاب.',
      benefits: ['أقوى مضاد حيوي طبيعي', 'يعالج قرحة المعدة', 'مفيد للكبد', 'يقوي المناعة', 'يعالج مشاكل الجلد والبشرة'],
      usage: 'ملعقة صغيرة على الريق يومياً. لا يسخن للحفاظ على خصائصه العلاجية.'
    }
  };

  const product = products[id];
  const currentPrice = selectedWeight === 'kg' ? product.priceKg : product.priceHalfKg;
  const currentOldPrice = selectedWeight === 'kg' ? product.oldPriceKg : product.oldPriceHalfKg;
  const weightLabel = selectedWeight === 'kg' ? 'كيلو (1000 جم)' : 'نصف كيلو (500 جم)';
  const weightType = selectedWeight === 'kg' ? 'كيلو' : 'نصف كيلو';

  // تحميل حالة الحفظ من localStorage (مع مراعاة الوزن)
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    const isProductSaved = savedProducts.some(item => 
      item.id === parseInt(id) && item.weightType === weightType
    );
    setIsSaved(isProductSaved);
  }, [id, weightType]);

  if (!product) {
    return <div className="not-found">المنتج غير موجود</div>;
  }

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: currentPrice,
      oldPrice: currentOldPrice,
      weight: weightLabel,
      weightType: weightType
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    
    alert(`✅ تم إضافة ${quantity} × ${weightLabel} من ${product.name} إلى السلة`);
    navigate('/cart');
  };

  // ✅ دالة حفظ المنتج مع السعر والوزن
  const handleSaveProduct = () => {
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    // إنشاء نسخة كاملة من المنتج مع السعر والوزن الحالي
    const productToSave = {
      ...product,
      price: currentPrice,
      oldPrice: currentOldPrice,
      weight: weightLabel,
      weightType: weightType,
      savedAt: new Date().toISOString()
    };
    
    if (!isSaved) {
      // التحقق من عدم وجود نفس المنتج بنفس الوزن
      const exists = savedProducts.some(item => 
        item.id === product.id && item.weightType === weightType
      );
      
      if (!exists) {
        savedProducts.push(productToSave);
        localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
        setIsSaved(true);
        alert(`✅ تم حفظ ${weightLabel} من ${product.name} في المفضلة`);
      } else {
        alert(`⚠️ ${product.name} (${weightLabel}) موجود بالفعل في المفضلة`);
      }
    } else {
      // إزالة المنتج من المفضلة (مع مراعاة الوزن)
      const updatedProducts = savedProducts.filter(item => 
        !(item.id === product.id && item.weightType === weightType)
      );
      localStorage.setItem('savedProducts', JSON.stringify(updatedProducts));
      setIsSaved(false);
      alert(`❌ تم إزالة ${weightLabel} من ${product.name} من المفضلة`);
    }
  };

  const handleShareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - ${weightLabel} بسعر ${currentPrice} ج.م`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('تمت المشاركة بنجاح');
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${product.name} - ${weightLabel} بسعر ${currentPrice} ج.م\n${window.location.href}`);
        alert('تم نسخ رابط المنتج! يمكنك مشاركته الآن 📋');
      } catch (err) {
        alert('حدث خطأ، حاول مرة أخرى');
      }
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
          
          <div className="image-actions">
            <button 
              className={`img-action ${isSaved ? 'saved' : ''}`} 
              onClick={handleSaveProduct}
              style={{ color: isSaved ? '#ff4444' : '#fff' }}
            >
              <FaHeart /> {isSaved ? 'تم الحفظ' : 'حفظ'}
            </button>
            <button className="img-action" onClick={handleShareProduct}>
              <FaShare /> مشاركة
            </button>
          </div>
        </div>
        
        <div className="product-details-info">
          <h1>{product.name}</h1>
          
          {/* اختيار الوزن */}
          <div className="weight-selector">
            <label>⚖️ اختر الوزن:</label>
            <div className="weight-options">
              <button 
                className={`weight-btn ${selectedWeight === 'kg' ? 'active' : ''}`}
                onClick={() => setSelectedWeight('kg')}
              >
                🍯 كيلو (1000 جم)
              </button>
              <button 
                className={`weight-btn ${selectedWeight === 'halfKg' ? 'active' : ''}`}
                onClick={() => setSelectedWeight('halfKg')}
              >
                🍯 نصف كيلو (500 جم)
              </button>
            </div>
          </div>

          <div className="price">
            <span className="current">{currentPrice} ج.م</span>
            <span className="old">{currentOldPrice} ج.م</span>
            <span className="save">وفر {(parseFloat(currentOldPrice) - parseFloat(currentPrice)).toFixed(2)} ج.م</span>
          </div>
          
          <div className="weight-info">
            <span className="weight-badge">⚖️ الوزن المختار: {weightLabel}</span>
          </div>
          
          <p className="description">{product.description}</p>
          <p className="long-description">{product.longDescription}</p>
          
          <div className="benefits">
            <h3><FaLeaf /> فوائد العسل:</h3>
            <ul>
              {product.benefits.map((benefit, i) => (
                <li key={i}>✓ {benefit}</li>
              ))}
            </ul>
          </div>

          <div className="usage">
            <h3>طريقة الاستخدام:</h3>
            <p>{product.usage}</p>
          </div>

          <div className="quantity-selector">
            <label>الكمية:</label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
            <span className="stock">متوفر في المخزون</span>
          </div>

          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            🛒 أضف إلى السلة - {(parseFloat(currentPrice) * quantity).toFixed(2)} ج.م
          </button>

          <div className="shipping-info">
            <div>🍯 عسل طبيعي 100%</div>
            <div><FaShieldAlt /> ضمان الجودة 100%</div>
            <div><FaTruck /> توصيل امن وسريع</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;