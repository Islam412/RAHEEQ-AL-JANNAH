import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // تحميل المنتجات من localStorage عند بدء التشغيل
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // تنظيف المنتجات القديمة وتحسينها
  useEffect(() => {
    const needsFix = cartItems.some(item => !item.weightType || !item.uniqueId);
    if (needsFix && cartItems.length > 0) {
      const fixedItems = cartItems.map((item, index) => ({
        ...item,
        weightType: item.weightType === 'halfKg' ? 'نصف كيلو' : (item.weightType || 'كيلو'),
        uniqueId: item.uniqueId || `${item.id}_${item.weightType || 'كيلو'}_${Date.now()}_${index}`
      }));
      setCartItems(fixedItems);
      localStorage.setItem('cartItems', JSON.stringify(fixedItems));
    }
  }, []);

  // حفظ المنتجات في localStorage كلما تغيرت
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // البحث عن منتج مطابق (نفس الاسم + نفس الوزن)
      const existing = prev.find(item => 
        item.id === product.id && item.weightType === product.weightType
      );
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.weightType === product.weightType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // إضافة منتج جديد مع مفتاح فريد
      return [...prev, { 
        ...product, 
        quantity: 1,
        uniqueId: `${product.id}_${product.weightType}_${Date.now()}_${Math.random()}`
      }];
    });
  };

  const removeFromCart = (productId, weightType) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && item.weightType === weightType)
    ));
  };

  const updateQuantity = (productId, quantity, weightType) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightType);
      return;
    }
    setCartItems(prev =>
      prev.map(item => 
        (item.id === productId && item.weightType === weightType) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // إفراغ السلة بعد إتمام الشراء
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};