import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import emailjs from '@emailjs/browser';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import SavedProducts from './pages/SavedProducts';
import './App.css';

// EmailJS Public Key - من حسابك
const EMAILJS_PUBLIC_KEY = 'swj1iOERZySazluZs';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 100);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // تهيئة EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Scroll reveal effect
    const revealOnScroll = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <CartProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/saved" element={<SavedProducts />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;