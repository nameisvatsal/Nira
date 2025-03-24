
import { useState, useEffect } from 'react';

// Mood-based quotes
const moodQuotes = {
  happy: [
    { text: "The secret of happiness is freedom, the secret of freedom is courage.", author: "Thucydides" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The most wasted of all days is one without laughter.", author: "E.E. Cummings" }
  ],
  sad: [
    { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
    { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
    { text: "The good life is a process, not a state of being. It is a direction not a destination.", author: "Carl Rogers" }
  ],
  angry: [
    { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
    { text: "Speak when you are angry and you will make the best speech you will ever regret.", author: "Ambrose Bierce" },
    { text: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.", author: "Mark Twain" }
  ],
  anxious: [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Anxiety is a thin stream of fear trickling through the mind. If encouraged, it cuts a channel into which all other thoughts are drained.", author: "Arthur Somers Roche" },
    { text: "Nothing diminishes anxiety faster than action.", author: "Walter Anderson" }
  ],
  neutral: [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "It is never too late to be what you might have been.", author: "George Eliot" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
  ]
};

// General quotes for fallback
const generalQuotes = [
  { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Anonymous" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "Albus Dumbledore" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The most beautiful people we have known are those who have known defeat, known suffering, known struggle, known loss, and have found their way out of the depths.", author: "Elisabeth Kübler-Ross" }
];

interface QuoteOfDayProps {
  className?: string;
  navbarMode?: boolean;
}

const QuoteOfDay: React.FC<QuoteOfDayProps> = ({ className = "", navbarMode = false }) => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: "", author: "" });

  useEffect(() => {
    // Get a quote based on yesterday's mood
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('quoteDate');
    const storedQuoteIndex = localStorage.getItem('quoteIndex');
    const yesterdayMood = localStorage.getItem('yesterdayMood') || 'neutral';
    
    if (storedDate === today && storedQuoteIndex) {
      // Use the stored quote if it's from today
      const quoteList = moodQuotes[yesterdayMood as keyof typeof moodQuotes] || generalQuotes;
      setQuote(quoteList[parseInt(storedQuoteIndex)]);
    } else {
      // Get a new random quote based on yesterday's mood
      const quoteList = moodQuotes[yesterdayMood as keyof typeof moodQuotes] || generalQuotes;
      const randomIndex = Math.floor(Math.random() * quoteList.length);
      setQuote(quoteList[randomIndex]);
      
      // Store today's date and quote index
      localStorage.setItem('quoteDate', today);
      localStorage.setItem('quoteIndex', randomIndex.toString());
      
      // Store today's mood as yesterday's mood for tomorrow
      const todaysMood = localStorage.getItem('currentMood');
      if (todaysMood) {
        localStorage.setItem('yesterdayMood', todaysMood);
      }
    }
  }, []);

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
    <div className={`glass-panel p-6 mb-8 text-center animate-fade-in ${className}`}>
      <p className="text-lg md:text-xl mb-2 italic text-gray-800 dark:text-gray-200 leading-relaxed">
        "{quote.text}"
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        — {quote.author}
      </p>
    </div>
  );
};

export default QuoteOfDay;
