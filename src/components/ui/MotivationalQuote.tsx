
import { useState, useEffect } from 'react';

// Motivational quotes categorized by theme
const motivationalQuotes = {
  success: [
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
  ],
  perseverance: [
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
    { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" }
  ],
  mindfulness: [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön" },
    { text: "Life is available only in the present moment.", author: "Thich Nhat Hanh" }
  ],
  growth: [
    { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
    { text: "And the day came when the risk to remain tight in a bud was more painful than the risk it took to blossom.", author: "Anaïs Nin" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" }
  ],
  purpose: [
    { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", author: "Ralph Waldo Emerson" },
    { text: "The meaning of life is to find your gift. The purpose of life is to give it away.", author: "Pablo Picasso" },
    { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" }
  ]
};

// General fallback quotes
const generalQuotes = [
  { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Anonymous" },
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human.", author: "Lori Deschene" },
  { text: "Sometimes the bravest and most important thing you can do is just show up.", author: "Brené Brown" },
  { text: "Be patient with yourself. Self-growth is tender; it's holy ground. There's no greater investment.", author: "Stephen Covey" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { text: "Every day may not be good, but there is something good in every day.", author: "Alice Morse Earle" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The most beautiful people we have known are those who have known defeat, known suffering, known struggle, known loss, and have found their way out of the depths.", author: "Elisabeth Kübler-Ross" }
];

interface MotivationalQuoteProps {
  className?: string;
  navbarMode?: boolean;
}

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ className = "", navbarMode = false }) => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: "", author: "" });
  const [quoteAnimation, setQuoteAnimation] = useState<string>("fade-in");

  useEffect(() => {
    // Get current theme based on time of day
    const getTheme = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "success"; // Morning
      if (hour >= 12 && hour < 17) return "perseverance"; // Afternoon
      if (hour >= 17 && hour < 22) return "mindfulness"; // Evening
      return "purpose"; // Night
    };

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('quoteDate');
    
    if (storedDate === today && localStorage.getItem('motivationalQuote')) {
      // Use the stored quote if it's from today
      const storedQuote = JSON.parse(localStorage.getItem('motivationalQuote') || '{}');
      setQuote(storedQuote);
    } else {
      // Get a new random quote based on theme
      const theme = getTheme();
      const quoteList = motivationalQuotes[theme as keyof typeof motivationalQuotes] || generalQuotes;
      const randomIndex = Math.floor(Math.random() * quoteList.length);
      const newQuote = quoteList[randomIndex];
      
      setQuote(newQuote);
      
      // Store today's date and quote
      localStorage.setItem('quoteDate', today);
      localStorage.setItem('motivationalQuote', JSON.stringify(newQuote));
    }
  }, []);

  const refreshQuote = () => {
    setQuoteAnimation("fade-out");
    
    // Get all quotes in a flat array
    const allQuotes = [
      ...motivationalQuotes.success,
      ...motivationalQuotes.perseverance, 
      ...motivationalQuotes.mindfulness,
      ...motivationalQuotes.growth,
      ...motivationalQuotes.purpose,
      ...generalQuotes
    ];
    
    // Filter out current quote to avoid repetition
    const availableQuotes = allQuotes.filter(
      q => q.text !== quote.text
    );
    
    // Select a new random quote
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const newQuote = availableQuotes[randomIndex];
    
    // Animation timing
    setTimeout(() => {
      setQuote(newQuote);
      setQuoteAnimation("fade-in");
      
      // Update stored quote
      localStorage.setItem('motivationalQuote', JSON.stringify(newQuote));
    }, 300);
  };

  if (!quote.text) return null;

  // Navbar mode has a more compact design
  if (navbarMode) {
    return (
      <div className={`px-4 py-2 text-center text-nira-700 dark:text-nira-300 border-b border-gray-200 dark:border-gray-800 animate-float ${className}`}>
        <p className="text-sm font-medium italic">
          "{quote.text}" — {quote.author}
        </p>
      </div>
    );
  }

  // Standard mode has the glass panel design
  return (
    <div className={`glass-panel p-6 mb-8 text-center ${className}`}>
      <div className={`animate-${quoteAnimation}`}>
        <p className="text-lg md:text-xl mb-3 italic text-gray-800 dark:text-gray-200 leading-relaxed">
          "{quote.text}"
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">
          — {quote.author}
        </p>
        <button 
          onClick={refreshQuote}
          className="text-xs text-nira-500 hover:text-nira-600 dark:text-nira-400 dark:hover:text-nira-300 transition-colors"
        >
          New Quote
        </button>
      </div>
    </div>
  );
};

export default MotivationalQuote;
