import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiBee } from 'react-icons/gi';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo" onClick={closeMenu}>
        <GiBee className="logo-icon" />
        <span>رحيق <span className="gold">الجنة</span></span>
        <span className="logo-sub">RAHEEQ AL-JANNAH</span>
      </Link>

      <nav className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
        <ul>
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>الرئيسية</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''} onClick={closeMenu}>المنتجات</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>عن العسل</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>اتصل بنا</Link></li>
        </ul>
      </nav>

      <div className="header-actions">
        <Link to="/cart" className="cart-icon" onClick={closeMenu}>
          <FaShoppingCart />
          {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
        </Link>
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

export default Header;