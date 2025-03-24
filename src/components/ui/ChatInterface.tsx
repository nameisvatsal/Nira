
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, VolumeX, Volume2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  generateGeminiResponse, 
  startSpeechRecognition, 
  speakText,
  ChatMessage
} from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello, I'm Nira, your personal mental health companion. How are you feeling today?",
      sender: 'nira',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Change welcome message when language changes
  useEffect(() => {
    if (currentLanguage !== 'en' && messages.length === 1 && messages[0].id === '1') {
      // Translate the welcome message to the selected language
      setIsTyping(true);
      generateGeminiResponse(`Translate "Hello, I'm Nira, your personal mental health companion. How are you feeling today?" to ${LANGUAGES.find(l => l.code === currentLanguage)?.name}`)
        .then(translatedMessage => {
          setMessages([{
            id: '1',
            text: translatedMessage,
            sender: 'nira',
            timestamp: new Date()
          }]);
          setIsTyping(false);
        })
        .catch(error => {
          console.error("Translation error:", error);
          setIsTyping(false);
        });
    }
  }, [currentLanguage, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage(inputValue.trim(), 'text');
    }
  };

  const sendMessage = async (content: string, inputType: 'text' | 'voice') => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      inputType
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Generate AI response using Gemini
      const promptPrefix = currentLanguage !== 'en' 
        ? `Please respond in ${LANGUAGES.find(l => l.code === currentLanguage)?.name}. ` 
        : '';
        
      const response = await generateGeminiResponse(promptPrefix + userMessage.text);
      
      // Add AI message
      const niraMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'nira',
        timestamp: new Date()
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, niraMessage]);
      
      // If user input was voice OR speech is enabled, speak the response
      if (inputType === 'voice' || isSpeaking) {
        try {
          await speakText(response);
        } catch (error) {
          console.error("Text-to-speech error:", error);
          toast({
            title: "Voice Output Error",
            description: "Could not generate voice output. Using text only.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleSpeech = () => {
    // If currently speaking, stop all speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(!isSpeaking);
    
    toast({
      title: !isSpeaking ? "Voice Output Enabled" : "Voice Output Disabled",
      description: !isSpeaking 
        ? "Nira will speak responses aloud" 
        : "Nira will respond with text only",
    });
  };
  
  const startListening = async () => {
    if (isListening) return;
    
    setIsListening(true);
    toast({
      title: "Listening...",
      description: "Speak clearly into your microphone",
    });
    
    try {
      const transcript = await startSpeechRecognition();
      if (transcript) {
        sendMessage(transcript, 'voice');
      }
    } catch (error) {
      toast({
        title: "Speech Recognition Error",
        description: typeof error === 'string' ? error : "Could not understand audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsListening(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    
    toast({
      title: "Language Changed",
      description: `Chat language set to ${LANGUAGES.find(l => l.code === lang)?.name}`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector */}
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-end">
        <div className="flex items-center">
          <Globe size={18} className="mr-2 text-gray-500" />
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-nira-500 text-white rounded-tr-none'
                  : 'glass-card rounded-tl-none'
              }`}
            >
              <p className="text-sm md:text-base">{message.text}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {message.inputType === 'voice' && (
                  <span className="text-xs opacity-70 flex items-center">
                    <Mic size={12} className="mr-1" />
                    Voice
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-nira-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-nira-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-nira-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-4 mt-auto">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={currentLanguage === 'en' ? "Type your message..." : "..."}
              className="w-full py-3 px-4 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-nira-300 dark:focus:ring-nira-600 focus:border-transparent transition-all"
            />
            <button
              onClick={() => sendMessage(inputValue, 'text')}
              disabled={!inputValue.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                inputValue.trim()
                  ? 'bg-nira-500 text-white hover:bg-nira-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <Send size={18} />
            </button>
          </div>
          
          <button
            onClick={startListening}
            disabled={isListening}
            className={`ml-3 p-3 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } transition-colors`}
            aria-label="Use voice input"
          >
            <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
          </button>
          
          <button
            onClick={toggleSpeech}
            className={`ml-3 p-3 rounded-full ${
              isSpeaking
                ? 'bg-nira-100 dark:bg-nira-800 text-nira-600 dark:text-nira-300'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } transition-colors`}
            aria-label={isSpeaking ? "Turn off speech" : "Turn on speech"}
          >
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
        
        {/* Small note about voice features */}
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          <span>🎤 {currentLanguage === 'en' ? "Click the microphone to use voice input • 🔊 When using voice, Nira will respond with voice automatically" : "🎤 🔊"}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
