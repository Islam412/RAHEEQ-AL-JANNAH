import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaTrash, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const SavedProducts = () => {
  const { addToCart } = useCart();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل المنتجات المحفوظة من localStorage
  useEffect(() => {
    loadSavedProducts();
  }, []);

  const loadSavedProducts = () => {
    const saved = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    setSavedProducts(saved);
    setLoading(false);
  };

  // إزالة منتج من المفضلة
  const removeFromSaved = (productId) => {
    const updated = savedProducts.filter(item => item.id !== productId);
    setSavedProducts(updated);
    localStorage.setItem('savedProducts', JSON.stringify(updated));
    alert('✅ تم إزالة المنتج من المفضلة');
  };

  // إضافة المنتج إلى السلة
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`✅ تم إضافة ${product.name} إلى سلة التسوق`);
  };

  // إضافة جميع المنتجات إلى السلة
  const addAllToCart = () => {
    savedProducts.forEach(product => {
      addToCart(product);
    });
    alert(`✅ تم إضافة ${savedProducts.length} منتج إلى سلة التسوق`);
  };

  if (loading) {
    return (
      <div className="saved-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المفضلة...</p>
      </div>
    );
  }

  if (savedProducts.length === 0) {
    return (
      <div className="saved-empty">
        <FaRegHeart className="empty-icon" />
        <h2>لا توجد منتجات محفوظة</h2>
        <p>يمكنك حفظ المنتجات التي تعجبك من صفحة التفاصيل</p>
        <Link to="/products">
          <button className="btn-primary">استكشاف المنتجات</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="saved-products-page">
      <div className="saved-header">
        <h2>❤️ المنتجات <span className="gold">المحفوظة</span></h2>
        <p className="saved-count">لديك {savedProducts.length} منتج محفوظ</p>
        <div className="saved-actions">
          <button onClick={addAllToCart} className="btn-add-all">
            <FaShoppingCart /> إضافة الكل إلى السلة
          </button>
        </div>
      </div>

      <div className="saved-products-grid">
        {savedProducts.map((product) => (
          <div className="saved-product-card" key={product.id}>
            <div className="saved-product-img">
              <img src={product.image} alt={product.name} />
              <button 
                className="remove-saved-btn"
                onClick={() => removeFromSaved(product.id)}
              >
                <FaTrash />
              </button>
            </div>
            <div className="saved-product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">
                <span className="current-price">{product.price}ج.م</span>
                <span className="old-price">{product.oldPrice}ج.م</span>
              </div>
              <div className="product-actions">
                <Link to={`/product/${product.id}`}>
                  <button className="view-details-btn">تفاصيل</button>
                </Link>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> أضف للسلة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProducts;