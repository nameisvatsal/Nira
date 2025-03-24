
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Profile {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  birth_year: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  dark_mode: boolean;
  notifications: boolean;
  journal_reminders: boolean;
  mood_reminders: boolean;
  period_reminders: boolean;
  cycle_length: number;
  period_length: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSettings(null);
      setLoading(false);
      return;
    }

    const fetchProfileAndSettings = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        // Ensure profileData conforms to Profile type
        const typedProfile: Profile = {
          id: profileData.id,
          name: profileData.name || '',
          email: profileData.email || '',
          gender: (profileData.gender as Profile['gender']) || 'prefer-not-to-say',
          birth_year: profileData.birth_year || '',
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
        
        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

        setProfile(typedProfile);
        
        if (settingsData) {
          setSettings(settingsData as UserSettings);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSettings();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      if (!settings) {
        // Create settings if they don't exist
        const { error } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id, ...updates });

        if (error) throw error;
      } else {
        // Update existing settings
        const { error } = await supabase
          .from('user_settings')
          .update(updates)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    profile,
    settings,
    loading,
    updateProfile,
    updateSettings,
  };
};
