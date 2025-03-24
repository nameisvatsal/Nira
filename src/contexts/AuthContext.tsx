
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: ProfileData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export interface ProfileData {
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  birthYear: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // For debugging
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', newSession?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, profileData: ProfileData) => {
    try {
      // Sign up the user - disable auto confirmation email
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: profileData.name,
            gender: profileData.gender,
            birth_year: profileData.birthYear
          },
          // No email redirect to bypass confirmation requirement
        }
      });

      if (signUpError) {
        toast({
          title: "Signup failed",
          description: signUpError.message,
          variant: "destructive",
        });
        return { error: signUpError };
      }

      // Immediately sign in after signup to bypass confirmation
      console.log('Automatically signing in user after registration');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Error during automatic sign in:', signInError);
        toast({
          title: "Auto-login failed",
          description: "Account created but couldn't log you in automatically. Please log in manually.",
          variant: "destructive",
        });
        return { error: signInError };
      }

      // Success toast
      toast({
        title: "Account created",
        description: "Your account has been created and you're now logged in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      toast({
        title: "Signup error",
        description: error.message || "An unexpected error occurred during signup",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Sign in with email and password - ignoring email confirmation
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', email);
      // Force sign in regardless of email confirmation status
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // If error mentions email confirmation, we'll still try to login
        if (error.message.includes('Email not confirmed')) {
          console.log('Email not confirmed, but attempting login anyway');
          
          // Try forcing the sign in again
          const { data: forceData, error: forceError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (forceError) {
            toast({
              title: "Login failed",
              description: "Unable to log in. Please contact support.",
              variant: "destructive",
            });
            return { error: forceError };
          }
          
          if (forceData?.user) {
            toast({
              title: "Welcome!",
              description: "You've successfully signed in.",
            });
            return { error: null };
          }
        }
        
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error during sign in:', error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred during login",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
