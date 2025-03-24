
import { useState, useEffect } from 'react';
import { Info, Globe } from 'lucide-react';
import ChatInterface from '@/components/ui/ChatInterface';
import { Button } from '@/components/ui/button';

const Chat = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Add a class to hide the footer only on this page
    document.body.classList.add('hide-footer');
    
    // Cleanup function to remove the class when leaving the page
    return () => {
      document.body.classList.remove('hide-footer');
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold heading-gradient">Chat with Nira</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center">
                Your personal AI mental health companion
                <span className="ml-2 text-nira-500 flex items-center text-sm">
                  <Globe size={14} className="mr-1" />
                  Multilingual Support
                </span>
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowInfo(!showInfo)}
              className="mt-4 md:mt-0 inline-flex items-center"
            >
              <Info size={18} className="mr-2" />
              About this chat
            </Button>
          </div>
          
          {showInfo && (
            <div className="mb-6 p-6 glass-panel text-gray-700 dark:text-gray-200 animate-fade-in">
              <h3 className="font-medium text-lg mb-2">About Nira's AI Chat</h3>
              <p className="mb-4">Nira is an AI companion designed to provide mental health support and guidance. While Nira can offer helpful insights and resources, it's important to remember:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Nira is not a replacement for professional mental health care</li>
                <li>In case of emergency, please use the crisis resources provided</li>
                <li>Your privacy is important - chat data is processed securely</li>
                <li>You can share your feelings, concerns, and thoughts freely</li>
                <li>Nira can help with mood tracking, stress management, and emotional support</li>
                <li>Nira now supports multiple languages - select your preferred language from the dropdown</li>
              </ul>
            </div>
          )}
          
          <div className="glass-panel h-[70vh] overflow-hidden mb-6 relative">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-nira-300/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-300/10 rounded-full blur-3xl"></div>
            <ChatInterface />
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            If you're experiencing a crisis or emergency situation, please contact a crisis helpline or emergency services immediately. 
            <Button variant="link" className="text-nira-500 hover:text-nira-600 transition-colors p-0 h-auto">
              View crisis resources
            </Button>.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
