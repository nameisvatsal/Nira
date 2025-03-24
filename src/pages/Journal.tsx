
import { useState, useEffect } from 'react';
import { ChevronLeft, PlusCircle, BookOpen, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import JournalEntry from '@/components/ui/JournalEntry';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface JournalEntryType {
  id: string;
  content: string;
  date: string; // ISO string format
  image_url?: string | null;
  user_id: string;
  created_at: string;
}

const Journal = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<'write' | 'entries'>('write');
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Failed to load journal entries",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (content: string, date: Date, images: string[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save journal entries",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (images.length > 0) {
        const image = images[0];
        
        // Convert base64 to file
        const base64Response = await fetch(image);
        const blob = await base64Response.blob();
        const file = new File([blob], `journal-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('journal_images')
          .upload(`${user.id}/${Date.now()}.jpg`, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('journal_images')
          .getPublicUrl(uploadData.path);
        
        imageUrl = publicUrl;
      }
      
      // Create journal entry in database
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          date: date.toISOString(),
          image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add new entry to local state
      setEntries(prev => [data, ...prev]);
      
      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded successfully."
      });
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Failed to save journal entry",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredEntries = searchQuery.trim() 
    ? entries.filter(entry => entry.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 mb-4 transition-colors">
                <ChevronLeft size={16} className="mr-1" />
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-medium heading-gradient">Journal</h1>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <button
                onClick={() => setActiveView('write')}
                className={`px-4 py-2 rounded-full flex items-center ${
                  activeView === 'write'
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
              >
                <PlusCircle size={18} className="mr-2" />
                New Entry
              </button>
              
              <button
                onClick={() => setActiveView('entries')}
                className={`px-4 py-2 rounded-full flex items-center ${
                  activeView === 'entries'
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
              >
                <BookOpen size={18} className="mr-2" />
                Past Entries
              </button>
            </div>
          </div>
          
          {activeView === 'write' ? (
            <div className="animate-fade-in">
              <JournalEntry onSave={saveEntry} />
            </div>
          ) : (
            <div className="animate-fade-in">
              {selectedEntry ? (
                <div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="mb-6 inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 transition-colors"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to entries
                  </button>
                  
                  <JournalEntry 
                    defaultContent={selectedEntry.content} 
                    defaultDate={new Date(selectedEntry.date)}
                    defaultImages={selectedEntry.image_url ? [selectedEntry.image_url] : []}
                    readOnly={true}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">
                      {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in your journal
                    </p>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search entries"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary w-full sm:w-64"
                      />
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="spinner"></div>
                      <span className="ml-3">Loading journal entries...</span>
                    </div>
                  ) : filteredEntries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEntries.map(entry => (
                        <button
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="text-left colorful-card colorful-card-blue p-6 hover:shadow-medium transition-all"
                        >
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                            <Calendar size={16} className="mr-2" />
                            <span className="text-sm">{formatDate(entry.date)}</span>
                          </div>
                          
                          {entry.image_url && (
                            <div className="mb-3 overflow-hidden rounded-md h-32">
                              <img 
                                src={entry.image_url} 
                                alt="Journal entry" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <p className="line-clamp-4 text-gray-700 dark:text-gray-200">
                            {entry.content}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="colorful-card p-8 text-center">
                      {searchQuery ? (
                        <p className="text-gray-600 dark:text-gray-300">No entries match your search.</p>
                      ) : (
                        <>
                          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-medium mb-2">Your journal is empty</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Start by creating your first entry to track your thoughts and feelings.
                          </p>
                          <button
                            onClick={() => setActiveView('write')}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full hover:from-purple-600 hover:to-pink-500 transition-colors"
                          >
                            Create First Entry
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Journal;
