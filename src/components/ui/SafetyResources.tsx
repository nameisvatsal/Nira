
import { Phone, MessageCircle, MapPin, ExternalLink } from 'lucide-react';

const SafetyResources = () => {
  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '1-800-273-8255',
      text: 'Text HOME to 741741',
      description: 'Free and confidential support for people in distress, 24/7.',
      icon: <Phone size={20} className="text-nira-500" />
    },
    {
      name: 'Crisis Text Line',
      phone: null,
      text: 'Text HOME to 741741',
      description: 'Free crisis counseling via text message, 24/7.',
      icon: <MessageCircle size={20} className="text-nira-500" />
    },
    {
      name: 'SAMHSA Treatment Referral Hotline',
      phone: '1-800-662-4357',
      text: null,
      description: 'Information and referral service for individuals facing mental health or substance use disorders.',
      icon: <Phone size={20} className="text-nira-500" />
    }
  ];

  return (
    <div className="glass-card p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Crisis Resources</h3>
        <p className="text-gray-600 dark:text-gray-400">
          If you're experiencing a mental health emergency, please reach out to one of these resources for immediate help.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {emergencyContacts.map((contact, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl hover:shadow-soft transition-shadow"
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">{contact.icon}</div>
              <div>
                <h4 className="font-medium mb-1">{contact.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contact.description}</p>
                {contact.phone && (
                  <div className="flex items-center mb-1">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <a href={`tel:${contact.phone.replace(/-/g, '')}`} className="text-nira-500 hover:text-nira-600 transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.text && (
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{contact.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Find Help Near You</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Search for mental health professionals and support groups in your area.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl mb-6">
        <div className="flex items-center mb-4">
          <MapPin size={20} className="mr-2 text-nira-500" />
          <h4 className="font-medium">Therapist Finder</h4>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter your ZIP code"
            className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nira-300 dark:focus:ring-nira-700"
          />
          <button className="px-6 py-3 bg-nira-500 text-white rounded-lg hover:bg-nira-600 transition-colors">
            Find Therapists
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by Mental Health Provider Directory
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-4">Additional Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="#" 
            className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-soft transition-shadow"
          >
            <div className="mr-3 p-2 bg-nira-50 dark:bg-nira-900/20 rounded-lg">
              <ExternalLink size={20} className="text-nira-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Mental Health America</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resources, screenings, and support</p>
            </div>
          </a>
          
          <a 
            href="#" 
            className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-soft transition-shadow"
          >
            <div className="mr-3 p-2 bg-nira-50 dark:bg-nira-900/20 rounded-lg">
              <ExternalLink size={20} className="text-nira-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">NAMI</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">National Alliance on Mental Illness</p>
            </div>
          </a>
          
          <a 
            href="#" 
            className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-soft transition-shadow"
          >
            <div className="mr-3 p-2 bg-nira-50 dark:bg-nira-900/20 rounded-lg">
              <ExternalLink size={20} className="text-nira-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Anxiety and Depression Association</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resources for anxiety and depression</p>
            </div>
          </a>
          
          <a 
            href="#" 
            className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-soft transition-shadow"
          >
            <div className="mr-3 p-2 bg-nira-50 dark:bg-nira-900/20 rounded-lg">
              <ExternalLink size={20} className="text-nira-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Veterans Crisis Line</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Support for veterans and their families</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SafetyResources;
