
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, MoonStar, BookOpen, HeartPulse, Calendar, ActivitySquare, GamepadIcon, Bell, Shield, UserCircle2, ArrowRight, Sparkles } from 'lucide-react';
import MotivationalQuote from '@/components/ui/MotivationalQuote';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      title: 'Chat with Nira',
      description: 'Talk to our AI companion about your feelings, concerns, or just to have a friendly conversation.',
      icon: MessageCircle,
      color: 'violet',
      link: '/chat'
    },
    {
      title: 'Meditation',
      description: 'Guided meditations and breathing exercises to help you relax and focus.',
      icon: MoonStar,
      color: 'indigo',
      link: '/meditate'
    },
    {
      title: 'Journal',
      description: 'Record your thoughts, feelings, and experiences in a private digital journal.',
      icon: BookOpen,
      color: 'blue',
      link: '/journal'
    },
    {
      title: 'Mood Tracker',
      description: 'Track your mood patterns over time to gain insights into your emotional well-being.',
      icon: HeartPulse,
      color: 'green',
      link: '/mood-tracker'
    },
    {
      title: 'Period Tracker',
      description: 'Track your menstrual cycle, symptoms, and moods to better understand your body.',
      icon: Calendar,
      color: 'pink',
      link: '/period-tracker'
    },
    {
      title: 'Wellness Games',
      description: 'Fun, interactive games designed to improve your mental wellbeing.',
      icon: GamepadIcon,
      color: 'orange',
      link: '/wellness-games'
    },
    {
      title: 'Fitness & Lifestyle',
      description: 'Explore resources and guidance for common mental health challenges.',
      icon: ActivitySquare,
      color: 'teal',
      link: '/fitness-lifestyle'
    },
    {
      title: 'Safety Resources',
      description: 'Access crisis resources and safety planning tools when you need them most.',
      icon: Shield,
      color: 'red',
      link: '/safety'
    },
    {
      title: 'Profile',
      description: 'Customize your experience and manage your account settings.',
      icon: UserCircle2,
      color: 'slate',
      link: '/profile'
    }
  ];

  const getGradient = (color: string) => {
    switch (color) {
      case 'violet': return 'from-violet-500 to-purple-500';
      case 'indigo': return 'from-indigo-500 to-blue-500';
      case 'blue': return 'from-blue-500 to-cyan-500';
      case 'green': return 'from-green-500 to-emerald-500';
      case 'pink': return 'from-pink-500 to-rose-500';
      case 'orange': return 'from-orange-500 to-amber-500';
      case 'teal': return 'from-teal-500 to-cyan-500';
      case 'amber': return 'from-amber-500 to-yellow-500';
      case 'red': return 'from-red-500 to-pink-500';
      case 'slate': return 'from-slate-500 to-gray-500';
      default: return 'from-nira-500 to-nira-400';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 pt-12 pb-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none heading-gradient">
                Welcome to Nira
              </h1>
              <p className="max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                Your personal mental wellness companion. Explore our features to improve your wellbeing.
              </p>
            </div>
            <div className="flex space-x-2">
              <Link to="/chat">
                <Button size="lg" className="bg-gradient-to-r from-nira-500 to-nira-400 text-white hover:from-nira-600 hover:to-nira-500 border-0">
                  Chat with Nira
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <MotivationalQuote className="mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="block h-full no-underline">
                <Card className="glass-card hover:shadow-md transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full bg-gradient-to-br ${getGradient(feature.color)}`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 p-6 glass-panel text-center max-w-3xl mx-auto">
            <Sparkles className="h-12 w-12 text-nira-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Journey to Better Mental Health</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Nira is designed to help you track your mental health, practice mindfulness, 
              and access resources when you need them. Take small steps each day toward a healthier mind.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/mood-tracker">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0">
                  Start Tracking Your Mood
                </Button>
              </Link>
              <Link to="/meditate">
                <Button variant="outline">Try a Meditation</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
