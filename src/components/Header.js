import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiBee } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <GiBee className="logo-icon" />
        <span>رحيق <span className="gold">الجنة</span></span>
        <span className="logo-sub">RAHEEQ AL-JANNAH</span>
      </Link>
      <nav>
        <ul>
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>الرئيسية</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>المنتجات</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>عن العسل</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>اتصل بنا</Link></li>
        </ul>
      </nav>
      <Link to="/cart" className="cart-icon">
        <FaShoppingCart />
        {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
      </Link>
    </header>
  );
};

export default Header;