
import { useState, useEffect } from 'react';
import { useAuth, ProfileData } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define schemas for login and signup forms
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    required_error: "Please select a gender option",
  }),
  birthYear: z.string().regex(/^\d{4}$/, { message: "Please enter a valid year (e.g., 1990)" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // If the user is already authenticated, redirect to the home page
  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        setAuthError(error.message);
      } else {
        // Successfully logged in, navigate to home
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const profileData: ProfileData = {
        name: values.name,
        gender: values.gender,
        birthYear: values.birthYear,
      };

      const { error } = await signUp(values.email, values.password, profileData);
      if (error) {
        setAuthError(error.message);
      } else {
        // Successfully signed up and auto-logged in, navigate to home
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If already logged in, immediately redirect
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Define forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "prefer-not-to-say",
      birthYear: "",
    },
  });

  return (
    <div className="container mx-auto max-w-md py-4 px-4 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold heading-gradient mb-2">Welcome to Nira</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Your personal mental wellbeing companion</p>
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm">
          {authError}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className={`colorful-card colorful-card-blue ${isMobile ? 'p-3' : ''}`}>
            <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
              <CardTitle className="text-xl">Login to Your Account</CardTitle>
              <CardDescription className="text-sm">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                <CardContent className={`space-y-3 ${isMobile ? 'p-4 py-2' : ''}`}>
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className={isMobile ? 'p-4 pt-2' : ''}>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0 h-9"
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className={`colorful-card colorful-card-purple ${isMobile ? 'p-3' : ''}`}>
            <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
              <CardTitle className="text-xl">Create an Account</CardTitle>
              <CardDescription className="text-sm">
                Sign up to start your wellbeing journey with Nira.
              </CardDescription>
            </CardHeader>
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)}>
                <CardContent className={`space-y-3 ${isMobile ? 'p-4 py-2' : ''}`}>
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={signupForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Gender</FormLabel>
                          <FormControl>
                            <select
                              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              {...field}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Birth Year</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1990" 
                              {...field} 
                              type="number" 
                              min="1900" 
                              max={new Date().getFullYear()} 
                              className="h-9"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className={isMobile ? 'p-4 pt-2' : ''}>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0 h-9"
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-6 text-xs text-gray-500">
        <p>No confirmation email required. You can log in immediately after signup.</p>
      </div>
    </div>
  );
};

export default Auth;
