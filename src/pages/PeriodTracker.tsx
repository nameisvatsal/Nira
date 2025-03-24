
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const PeriodTracker = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriod, setLastPeriod] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    // Load period data from localStorage
    const savedDates = localStorage.getItem('period-dates');
    if (savedDates) {
      try {
        const dates = JSON.parse(savedDates).map((date: string) => new Date(date));
        setSelectedDates(dates);
        
        // Find the most recent date
        if (dates.length > 0) {
          const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
          setLastPeriod(sortedDates[0]);
        }
      } catch (error) {
        console.error('Error parsing dates:', error);
      }
    }
    
    const savedCycleLength = localStorage.getItem('cycle-length');
    if (savedCycleLength) {
      setCycleLength(parseInt(savedCycleLength, 10));
    }
    
    const savedPeriodLength = localStorage.getItem('period-length');
    if (savedPeriodLength) {
      setPeriodLength(parseInt(savedPeriodLength, 10));
    }
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    
    // Check if date is already selected
    const existingIndex = selectedDates.findIndex(d => 
      d.getFullYear() === newDate.getFullYear() && 
      d.getMonth() === newDate.getMonth() && 
      d.getDate() === newDate.getDate()
    );
    
    let updatedDates: Date[];
    
    if (existingIndex >= 0) {
      // Remove date if already selected
      updatedDates = selectedDates.filter((_, i) => i !== existingIndex);
    } else {
      // Add date if not selected
      updatedDates = [...selectedDates, newDate];
    }
    
    setSelectedDates(updatedDates);
    
    // Save to localStorage
    localStorage.setItem('period-dates', JSON.stringify(updatedDates.map(d => d.toISOString())));
    
    // Update last period if this is the most recent date
    const now = new Date();
    if (!lastPeriod || newDate > lastPeriod) {
      setLastPeriod(newDate);
    }
    
    toast({
      title: existingIndex >= 0 ? "Date removed" : "Date marked",
      description: existingIndex >= 0 
        ? `Removed ${newDate.toLocaleDateString()}` 
        : `Marked ${newDate.toLocaleDateString()} as period day`,
    });
  };

  const getNextPeriodDate = () => {
    if (!lastPeriod) return "Unknown";
    
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
    
    return nextPeriod.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCycleLengthChange = (newLength: number) => {
    setCycleLength(newLength);
    localStorage.setItem('cycle-length', newLength.toString());
  };

  const handlePeriodLengthChange = (newLength: number) => {
    setPeriodLength(newLength);
    localStorage.setItem('period-length', newLength.toString());
  };

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-medium mb-6 heading-gradient">Period Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card className="colorful-card colorful-card-purple">
              <CardHeader>
                <CardTitle>Period Calendar</CardTitle>
                <CardDescription>
                  Click on dates to mark or unmark your period days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleDateSelect}
                  className="rounded-md border shadow-sm"
                  classNames={{
                    day_selected: "bg-primary text-white hover:bg-primary/90",
                    day_today: "bg-accent text-accent-foreground",
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-5 space-y-6">
            <Card className="colorful-card colorful-card-blue">
              <CardHeader>
                <CardTitle>Cycle Information</CardTitle>
                <CardDescription>
                  Your period cycle statistics and predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">Last Period Started</h3>
                  <p className="text-xl">
                    {lastPeriod ? lastPeriod.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : "Not recorded"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Next Period Expected</h3>
                  <p className="text-xl text-primary font-medium">{getNextPeriodDate()}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-sm mb-4 flex items-center">
                    Cycle Length (days)
                    <button className="ml-2 text-gray-400 hover:text-gray-500">
                      <Info size={16} />
                    </button>
                  </h3>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCycleLengthChange(Math.max(1, cycleLength - 1))}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="text-xl font-medium w-8 text-center">{cycleLength}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCycleLengthChange(cycleLength + 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-sm mb-4 flex items-center">
                    Period Length (days)
                    <button className="ml-2 text-gray-400 hover:text-gray-500">
                      <Info size={16} />
                    </button>
                  </h3>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handlePeriodLengthChange(Math.max(1, periodLength - 1))}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="text-xl font-medium w-8 text-center">{periodLength}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handlePeriodLengthChange(periodLength + 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0"
              onClick={() => {
                toast({
                  title: "Period Tracker",
                  description: "Your cycle information has been updated.",
                });
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;
