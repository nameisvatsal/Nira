
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Image, Save, Mic, MicOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Define interface for props
interface JournalEntryProps {
  defaultContent?: string;
  defaultDate?: Date;
  defaultImages?: string[];
  readOnly?: boolean;
  onSave?: (content: string, date: Date, images: string[]) => void;
}

// Add the Speech Recognition types
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const JournalEntry = ({ 
  defaultContent = '', 
  defaultDate, 
  defaultImages = [], 
  readOnly = false,
  onSave
}: JournalEntryProps) => {
  const [content, setContent] = useState(defaultContent);
  const [date, setDate] = useState<Date>(defaultDate || new Date());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultImages[0] || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setContent(prev => prev + finalTranscript);
        }
        setRecordingStatus(interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setRecordingStatus('');
    } else {
      recognitionRef.current.start();
      setRecordingStatus('Listening...');
    }
    
    setIsRecording(!isRecording);
  };
  
  const handleSave = () => {
    // Logic to save journal entry
    const entry = {
      id: Date.now().toString(),
      content,
      date: date.toISOString(),
      image: selectedImage
    };
    
    // Handle external onSave if provided
    if (onSave) {
      onSave(content, date, selectedImage ? [selectedImage] : []);
    } else {
      // Default behavior - save to localStorage
      const existingEntriesJSON = localStorage.getItem('journalEntries');
      const existingEntries = existingEntriesJSON ? JSON.parse(existingEntriesJSON) : [];
      
      // Add new entry and save back to localStorage
      const updatedEntries = [...existingEntries, entry];
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    }
    
    // Show success message and reset form
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    
    toast({
      title: "Journal Entry Saved",
      description: "Your thoughts have been recorded successfully."
    });
    
    // Clear the form (if not in readOnly mode)
    if (!readOnly) {
      setContent('');
      setSelectedImage(null);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>New Journal Entry</CardTitle>
          {!readOnly && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Journal attachment" 
                className="w-full max-h-64 object-contain rounded-md" 
              />
              {!readOnly && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove
                </Button>
              )}
            </div>
          )}
          
          <Textarea 
            value={content}
            onChange={(e) => !readOnly && setContent(e.target.value)}
            placeholder="How are you feeling today?"
            className="min-h-[200px] resize-none"
            readOnly={readOnly}
          />
          
          {isRecording && (
            <div className="p-2 bg-nira-100 dark:bg-nira-900/20 rounded text-sm text-nira-800 dark:text-nira-200 animate-pulse">
              {recordingStatus || "Listening..."}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!readOnly && (
          <>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={triggerFileInput}>
                <Image size={18} />
                <span className="sr-only">Add Image</span>
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              
              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="icon"
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                <span className="sr-only">{isRecording ? "Stop Recording" : "Start Voice Input"}</span>
              </Button>
            </div>
            
            <div className="relative">
              <Button onClick={handleSave} disabled={!content.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
              
              {showSaved && (
                <div className="absolute -top-10 right-0 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded shadow-sm animate-fade-in">
                  Saved!
                </div>
              )}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;
