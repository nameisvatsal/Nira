
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import QuoteOfDay from '@/components/ui/QuoteOfDay';
import NiraSidebar from './Sidebar';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full">
      <QuoteOfDay navbarMode={true} />
      
      <div className={`w-full py-3 transition-all duration-300 ${isSticky ? 'sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b' : ''}`}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <button className="mr-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <NiraSidebar />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Link>
            
            <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
