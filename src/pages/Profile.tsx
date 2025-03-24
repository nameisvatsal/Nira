
import { useState, useEffect } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileSettings from '@/components/ui/ProfileSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 mb-4 transition-colors">
                <ChevronLeft size={16} className="mr-1" />
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-medium heading-gradient">My Profile</h1>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={signOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
          
          <ProfileSettings />
        </div>
      </main>
    </div>
  );
};

export default Profile;
