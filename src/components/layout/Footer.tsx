
import { Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-nira-500 to-nira-300 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-display font-semibold text-xl">Nira</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Your personalized mental health companion. We're here to support your journey to better wellness.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Features</h4>
            <ul className="space-y-2">
              <li><Link to="/chat" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">AI Chat Support</Link></li>
              <li><Link to="/meditate" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Meditation</Link></li>
              <li><Link to="/journal" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Journal</Link></li>
              <li><Link to="/mood-tracker" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Mood Tracker</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Mental Health Tips</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Crisis Support</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Find Therapists</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Support Groups</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nira-500 dark:hover:text-nira-300 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Nira. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              Made with
            </p>
            <Heart size={16} className="text-red-500 animate-pulse-subtle" />
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              for better mental wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
