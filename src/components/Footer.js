import React from 'react';
import { GiBee } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <GiBee />
          <span>رحيق الجنة - RAHEEQ AL-JANNAH</span>
        </div>
        <p>© 2026 جميع الحقوق محفوظة - رحيق الجنة</p>
        <p>©تم التطوير -  بواسطة اسلام حمدى</p>
      </div>
    </footer>
  );
};

export default Footer;