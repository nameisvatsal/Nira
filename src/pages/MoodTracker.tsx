
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MoodTracker from '@/components/ui/MoodTracker';

const MoodTrackerPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 mb-4 transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-medium heading-gradient">Mood Tracker</h1>
          </div>
          
          <MoodTracker />
        </div>
      </main>
    </div>
  );
};

export default MoodTrackerPage;
