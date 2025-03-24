
import { useState, useEffect } from 'react';
import { Bell, Clock, Check, X, Settings, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'mood' | 'meditation' | 'journal' | 'general';
};

const Notifications = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    moodReminders: true,
    meditationReminders: true,
    journalReminders: true,
    weeklyReports: true,
    reminderTime: '20:00',
  });
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    // Load saved notifications
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Generate sample notifications if none exist
      const sampleNotifications = [
        {
          id: '1',
          title: 'Mood Check-in',
          message: 'Time to track your mood for today. How are you feeling?',
          time: '2 hours ago',
          read: false,
          type: 'mood' as const,
        },
        {
          id: '2',
          title: 'Meditation Reminder',
          message: 'Your scheduled meditation session is coming up in 15 minutes.',
          time: 'Yesterday',
          read: true,
          type: 'meditation' as const,
        },
        {
          id: '3',
          title: 'Weekly Mood Summary',
          message: 'Your mood has been stable this week with a slight upward trend. Great job!',
          time: '3 days ago',
          read: true,
          type: 'mood' as const,
        },
      ];
      
      setNotifications(sampleNotifications);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
    
    // Load notification settings
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const updateSettings = (key: keyof typeof settings, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    localStorage.setItem('notification-settings', JSON.stringify(updatedSettings));
    
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "All notifications marked as read",
      description: "All your notifications have been marked as read.",
    });
  };

  const getIconForNotificationType = (type: string) => {
    switch (type) {
      case 'mood':
        return <Moon className="text-purple-500" />;
      case 'meditation':
        return <Clock className="text-green-500" />;
      case 'journal':
        return <Bell className="text-amber-500" />;
      default:
        return <Bell className="text-blue-500" />;
    }
  };

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-medium mb-6">Notifications</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
          Stay informed with important reminders and updates about your mental health journey. Customize your notification preferences to help you stay consistent with your wellness activities.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-panel mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Your Notifications</CardTitle>
                  <CardDescription>
                    Stay updated on important reminders and insights
                  </CardDescription>
                </div>
                
                {notifications.some(n => !n.read) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-sm"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark all as read
                  </Button>
                )}
              </CardHeader>
              
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Notifications</h3>
                    <p className="text-gray-500">You don't have any notifications right now.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg flex items-start ${
                          notification.read 
                            ? 'bg-background'
                            : 'bg-nira-50 dark:bg-nira-900/10'
                        }`}
                      >
                        <div className="mr-4 mt-1">
                          {getIconForNotificationType(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`font-medium ${!notification.read ? 'text-nira-700 dark:text-nira-300' : ''}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 px-2 text-xs"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Mark as read
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 px-2 text-xs text-gray-500 hover:text-red-500"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Customize your notification preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Mood Check-in Reminders</h4>
                      <p className="text-xs text-muted-foreground">Receive daily reminders to track your mood</p>
                    </div>
                    <Switch 
                      checked={settings.moodReminders}
                      onCheckedChange={(checked) => updateSettings('moodReminders', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Meditation Reminders</h4>
                      <p className="text-xs text-muted-foreground">Get reminders for your meditation practice</p>
                    </div>
                    <Switch 
                      checked={settings.meditationReminders}
                      onCheckedChange={(checked) => updateSettings('meditationReminders', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Journal Reminders</h4>
                      <p className="text-xs text-muted-foreground">Reminders to write in your journal</p>
                    </div>
                    <Switch 
                      checked={settings.journalReminders}
                      onCheckedChange={(checked) => updateSettings('journalReminders', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Weekly Mood Reports</h4>
                      <p className="text-xs text-muted-foreground">Receive weekly summaries of your mood patterns</p>
                    </div>
                    <Switch 
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => updateSettings('weeklyReports', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Reminder Time</h4>
                  <p className="text-xs text-muted-foreground mb-2">Set your preferred time for daily reminders</p>
                  
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => updateSettings('reminderTime', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-nira-300 focus:border-transparent"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-nira-500 hover:bg-nira-600">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
