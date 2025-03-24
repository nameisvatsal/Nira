import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BrainCircuit, Heart, GamepadIcon, Award, ScanFace, Palette, Sparkles, MessageSquareShare } from 'lucide-react';

// Import games
import BubbleWrapGame from '@/components/games/BubbleWrapGame';
import SwitchGame from '@/components/games/SwitchGame';
import LightDimmerGame from '@/components/games/LightDimmerGame';
import WaterRippleGame from '@/components/games/WaterRippleGame';
import ShapeMatchingGame from '@/components/games/ShapeMatchingGame';
import MemeGenerator from '@/components/games/MemeGenerator';
import PunchingBagGame from '@/components/games/PunchingBagGame';
import SmashPlatesGame from '@/components/games/SmashPlatesGame';
import MoodAssessmentQuiz from '@/components/games/MoodAssessmentQuiz';
import { useToast } from '@/hooks/use-toast';

const WellnessGames = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    // Load saved score
    const savedScore = localStorage.getItem('wellness-score');
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  const addScore = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    localStorage.setItem('wellness-score', newScore.toString());
    
    toast({
      title: "Points Earned!",
      description: `+${points} wellness points added to your score.`
    });
  };

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 md:px-6 py-6">
        <h1 className="text-3xl md:text-4xl font-medium mb-4 heading-gradient">Wellness Games</h1>
        
        <div className="flex items-center mb-6 p-4 bg-nira-50/50 dark:bg-nira-900/20 rounded-lg">
          <Award className="text-nira-500 mr-3" size={24} />
          <div>
            <h3 className="font-medium">Your Wellness Score</h3>
            <p className="text-2xl font-bold text-nira-600 dark:text-nira-400">{score} points</p>
          </div>
        </div>

        <Tabs defaultValue="relaxation" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="relaxation" className="flex items-center">
              <Sparkles size={16} className="mr-2" />
              Relaxation
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex items-center">
              <BrainCircuit size={16} className="mr-2" />
              Cognitive
            </TabsTrigger>
            <TabsTrigger value="physical" className="flex items-center">
              <GamepadIcon size={16} className="mr-2" />
              Physical
            </TabsTrigger>
            <TabsTrigger value="emotional" className="flex items-center">
              <Heart size={16} className="mr-2" />
              Emotional
            </TabsTrigger>
            <TabsTrigger value="creative" className="flex items-center">
              <Palette size={16} className="mr-2" />
              Creative
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="relaxation" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BubbleWrapGame />
              <SwitchGame />
              <LightDimmerGame />
              <WaterRippleGame />
            </div>
          </TabsContent>
          
          <TabsContent value="cognitive" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShapeMatchingGame />
              <MoodAssessmentQuiz />
              
              <Card className="glass-card hover:shadow-medium transition-all">
                <CardHeader>
                  <CardTitle>Emotion Identification</CardTitle>
                  <CardDescription>
                    Test your ability to recognize different emotions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScanFace className="h-12 w-12 mb-4 text-nira-500 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Emotional intelligence helps you better understand yourself and connect with others.
                  </p>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full bg-nira-500 hover:bg-nira-600 text-white py-2 rounded-lg"
                    onClick={() => {
                      addScore(5);
                      toast({
                        title: "Game Started",
                        description: "You've started the Emotion Identification game. Enjoy!"
                      });
                    }}
                  >
                    Test Emotional Intelligence
                  </button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="physical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PunchingBagGame />
              <SmashPlatesGame />
            </div>
          </TabsContent>
          
          <TabsContent value="emotional" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card hover:shadow-medium transition-all">
                <CardHeader>
                  <CardTitle>Gratitude Journal</CardTitle>
                  <CardDescription>
                    Practice gratitude by writing down things you're thankful for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Heart className="h-12 w-12 mb-4 text-nira-500 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Cultivating gratitude has been shown to improve mood and overall mental well-being.
                  </p>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full bg-nira-500 hover:bg-nira-600 text-white py-2 rounded-lg"
                    onClick={() => {
                      addScore(5);
                      toast({
                        title: "Game Started",
                        description: "You've started the Gratitude Journal. Enjoy!"
                      });
                    }}
                  >
                    Start Gratitude Practice
                  </button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card hover:shadow-medium transition-all">
                <CardHeader>
                  <CardTitle>Mindful Breathing</CardTitle>
                  <CardDescription>
                    Practice mindful breathing to reduce stress and anxiety
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BrainCircuit className="h-12 w-12 mb-4 text-nira-500 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Even a minute of focused breathing can help calm your mind and reduce stress.
                  </p>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full bg-nira-500 hover:bg-nira-600 text-white py-2 rounded-lg"
                    onClick={() => {
                      addScore(5);
                      toast({
                        title: "Game Started",
                        description: "You've started the Mindful Breathing exercise. Enjoy!"
                      });
                    }}
                  >
                    Start Breathing Exercise
                  </button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="creative" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MemeGenerator />
              
              <Card className="glass-card hover:shadow-medium transition-all">
                <CardHeader>
                  <CardTitle>Positive Affirmations</CardTitle>
                  <CardDescription>
                    Create and share positive affirmations to boost your mood
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MessageSquareShare className="h-12 w-12 mb-4 text-nira-500 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Positive affirmations can help retrain your brain to think more positively and build self-confidence.
                  </p>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full bg-nira-500 hover:bg-nira-600 text-white py-2 rounded-lg"
                    onClick={() => {
                      addScore(5);
                      toast({
                        title: "Game Started",
                        description: "You've started the Positive Affirmations creator. Enjoy!"
                      });
                    }}
                  >
                    Create Affirmations
                  </button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WellnessGames;
