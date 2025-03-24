
import { useState, useEffect } from 'react';
import { User, Calendar, ChevronRight, Settings, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSettings = () => {
  const { toast } = useToast();
  const { profile, settings, loading, updateProfile, updateSettings } = useProfile();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Create a local state for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    birthYear: '',
    darkMode: false,
    notifications: true,
    journalReminders: true,
    moodReminders: true,
    periodReminders: true,
  });

  // Update local state when profile/settings are loaded
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        gender: profile.gender || 'prefer-not-to-say',
        birthYear: profile.birth_year || '',
      }));
    }
    
    if (settings) {
      setFormData(prev => ({
        ...prev,
        darkMode: settings.dark_mode,
        notifications: settings.notifications,
        journalReminders: settings.journal_reminders,
        moodReminders: settings.mood_reminders,
        periodReminders: settings.period_reminders,
      }));
    }
  }, [profile, settings]);

  const handleProfileChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleToggleChange = (field: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  
  const saveProfile = async () => {
    setIsUpdating(true);
    
    try {
      // Update profile
      await updateProfile({
        name: formData.name,
        gender: formData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say',
        birth_year: formData.birthYear,
      });
      
      // Update settings
      await updateSettings({
        dark_mode: formData.darkMode,
        notifications: formData.notifications,
        journal_reminders: formData.journalReminders,
        mood_reminders: formData.moodReminders,
        period_reminders: formData.periodReminders,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile data...</div>;
  }

  if (!profile || !user) {
    return <div className="p-6 text-center">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings size={16} className="mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="colorful-card colorful-card-purple">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleProfileChange('name')} 
                  className="max-w-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user.email || ''} 
                  disabled
                  className="max-w-md"
                />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  value={formData.gender} 
                  onChange={handleProfileChange('gender')}
                  className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthYear">Birth Year</Label>
                <Input 
                  id="birthYear" 
                  type="number" 
                  min="1900" 
                  max={new Date().getFullYear()} 
                  value={formData.birthYear} 
                  onChange={handleProfileChange('birthYear')} 
                  className="max-w-md"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveProfile} 
                className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </Card>
          
          {formData.gender === 'female' && (
            <div className="mt-8">
              <Card className="colorful-card colorful-card-blue">
                <CardHeader>
                  <CardTitle>Period Tracking</CardTitle>
                  <CardDescription>
                    Track your menstrual cycle and get insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Keep track of your menstrual cycle, get predictions, and gain insights about your health patterns.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/period-tracker">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0 flex items-center">
                      Go to Period Tracker
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="colorful-card colorful-card-orange">
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Turn on dark mode for a better nighttime experience
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={formData.darkMode}
                  onCheckedChange={handleToggleChange('darkMode')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications for important updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={handleToggleChange('notifications')}
                />
              </div>
              
              <div className="pt-6 border-t">
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Delete Account
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveProfile} 
                className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8">
            <Card className="colorful-card colorful-card-green">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your data and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h4 className="font-medium">Data Privacy</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View and manage your data
                      </p>
                    </div>
                    <Shield size={20} className="text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h4 className="font-medium">Security Settings</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Change password and security options
                      </p>
                    </div>
                    <Shield size={20} className="text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="colorful-card colorful-card-blue">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="journal-reminders">Journal Reminders</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daily reminders to write in your journal
                  </p>
                </div>
                <Switch
                  id="journal-reminders"
                  checked={formData.journalReminders}
                  onCheckedChange={handleToggleChange('journalReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mood-reminders">Mood Tracking Reminders</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reminders to track your mood daily
                  </p>
                </div>
                <Switch
                  id="mood-reminders"
                  checked={formData.moodReminders}
                  onCheckedChange={handleToggleChange('moodReminders')}
                />
              </div>
              
              {formData.gender === 'female' && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="period-reminders">Period Tracking Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notifications before your predicted period
                    </p>
                  </div>
                  <Switch
                    id="period-reminders"
                    checked={formData.periodReminders}
                    onCheckedChange={handleToggleChange('periodReminders')}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveProfile} 
                className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
