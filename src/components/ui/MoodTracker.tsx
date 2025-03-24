
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

type MoodType = "happy" | "good" | "neutral" | "bad" | "awful";

interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  note: string;
  date: string;
  created_at: string;
}

const moodOptions: {value: MoodType, label: string, emoji: string}[] = [
  { value: 'happy', label: 'Happy', emoji: '😄' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'bad', label: 'Bad', emoji: '😔' },
  { value: 'awful', label: 'Awful', emoji: '😢' }
];

const moodToValue = (mood: MoodType): number => {
  switch (mood) {
    case 'happy': return 5;
    case 'good': return 4;
    case 'neutral': return 3;
    case 'bad': return 2;
    case 'awful': return 1;
    default: return 3;
  }
};

const MoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('add');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoodEntries();
    }
  }, [user]);

  const loadMoodEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Ensure the data conforms to the MoodEntry type
      const typedData = data.map(entry => ({
        ...entry,
        mood: entry.mood as MoodType
      })) as MoodEntry[];
      
      setMoodEntries(typedData);
    } catch (error) {
      console.error('Error loading mood entries:', error);
      toast({
        title: "Error",
        description: "Failed to load your mood entries.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood || !user) return;
    
    setIsSubmitting(true);
    try {
      const newEntry = {
        user_id: user.id,
        mood: selectedMood,
        note: note,
        date: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(newEntry)
        .select();
      
      if (error) throw error;
      
      // Reset form
      setSelectedMood(null);
      setNote('');
      
      // Update the entry list
      if (data && data.length > 0) {
        const typedNewEntry = {
          ...data[0],
          mood: data[0].mood as MoodType
        } as MoodEntry;
        
        setMoodEntries(prev => [typedNewEntry, ...prev]);
      }
      
      // Show success message
      toast({
        title: "Mood recorded",
        description: "Your mood has been successfully recorded.",
      });
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to record your mood.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prepare data for chart
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Find mood for this day
    const entry = moodEntries.find(entry => 
      entry.date && format(new Date(entry.date), 'yyyy-MM-dd') === formattedDate
    );
    
    return {
      date: formattedDate,
      value: entry ? moodToValue(entry.mood) : null,
      mood: entry ? entry.mood : null,
    };
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span role="img" aria-label="Mood Emoji">😊</span>
          Mood Tracker
        </CardTitle>
        <CardDescription>
          Track your daily moods and see patterns over time
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="add">Record Mood</TabsTrigger>
            <TabsTrigger value="history">Mood History</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="add" className="p-6">
          <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-6">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={selectedMood === option.value ? "default" : "outline"}
                className={`h-auto flex-col py-3 ${
                  selectedMood === option.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMood(option.value)}
              >
                <span className="text-2xl mb-2">{option.emoji}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="mb-6">
            <label htmlFor="mood-note" className="block text-sm font-medium mb-2">
              Notes (optional)
            </label>
            <Textarea
              id="mood-note"
              placeholder="Add details about how you're feeling..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save Mood'}
          </Button>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={last30Days} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(tick) => format(new Date(tick), 'd')} 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 2, 3, 4, 5]} 
                      tickFormatter={(value) => {
                        const mood = moodOptions.find(m => moodToValue(m.value) === value);
                        return isMobile ? mood?.emoji || '' : mood?.label || '';
                      }}
                      tick={{ fontSize: isMobile ? 12 : 14 }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (value === null) return ['No entry', ''];
                        const mood = moodOptions.find(m => moodToValue(m.value) === value);
                        return [mood?.label || '', 'Mood'];
                      }}
                      labelFormatter={(label) => format(new Date(label), 'PP')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Entries</h3>
            
            {isLoading ? (
              <div className="p-8 text-center">Loading your mood history...</div>
            ) : moodEntries.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <div className="text-4xl mb-2">📝</div>
                <h3 className="font-medium mb-1">No mood entries yet</h3>
                <p className="text-muted-foreground">Record your first mood to see your history here</p>
                <Button 
                  onClick={() => setActiveTab('add')} 
                  variant="outline" 
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Record Your Mood
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {moodEntries.slice(0, 10).map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="text-xl mr-2">
                              {moodOptions.find(m => m.value === entry.mood)?.emoji || '😐'}
                            </span>
                            <span className="font-medium">
                              {moodOptions.find(m => m.value === entry.mood)?.label || 'Unknown'}
                            </span>
                          </div>
                          
                          {entry.note && (
                            <p className="text-muted-foreground text-sm mt-2">{entry.note}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center text-muted-foreground text-sm">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {format(new Date(entry.date), 'PPP')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-center p-6 pt-0">
        <p className="text-sm text-center text-muted-foreground">
          Tracking your mood regularly can help you understand patterns in your mental wellbeing.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
