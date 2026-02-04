import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinkClasses = "inline-block transition-all duration-300 hover:text-bright-sun-400 hover:translate-x-2";

  return (
    <footer className="bg-mine-shaft-900 pt-16 pb-8 border-t border-mine-shaft-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full border border-bright-sun-400 flex items-center justify-center">
                <span className="text-bright-sun-400 font-bold text-xs">C</span>
              </div>
              <span className="text-lg font-bold text-mine-shaft-50">CollabPro</span>
            </div>
            <p className="text-mine-shaft-400 text-sm leading-relaxed mb-6">
              Project portal with user profiles, skill updates, certifications, work experience and project postings as a manager.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-mine-shaft-800 flex items-center justify-center text-bright-sun-400 hover:bg-bright-sun-400 hover:text-black transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-bright-sun-400 font-bold mb-4">Product</h4>
             <ul className="space-y-2 text-sm text-mine-shaft-300">
               <li><a href="#" className={footerLinkClasses}>Find Projects</a></li>
               <li><a href="#" className={footerLinkClasses}>Find Company</a></li>
               <li><a href="#" className={footerLinkClasses}>Find Employee</a></li>
             </ul>
          </div>
          
          <div>
             <h4 className="text-bright-sun-400 font-bold mb-4">Company</h4>
             <ul className="space-y-2 text-sm text-mine-shaft-300">
               <li><a href="#" className={footerLinkClasses}>About Us</a></li>
               <li><a href="#" className={footerLinkClasses}>Contact Us</a></li>
               <li><a href="#" className={footerLinkClasses}>Privacy Policy</a></li>
               <li><a href="#" className={footerLinkClasses}>Terms & Conditions</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-bright-sun-400 font-bold mb-4">Support</h4>
             <ul className="space-y-2 text-sm text-mine-shaft-300">
               <li><a href="#" className={footerLinkClasses}>Help & Support</a></li>
               <li><a href="#" className={footerLinkClasses}>Feedback</a></li>
               <li><a href="#" className={footerLinkClasses}>FAQs</a></li>
             </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;