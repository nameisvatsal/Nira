import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import MeditationPlayer from '@/components/ui/MeditationPlayer';
import { Waves, LucideIcon, Timer, ArrowUp, ArrowDown, Pause, Clock, RefreshCw } from 'lucide-react';

const meditations = [
  {
    category: 'sleep',
    title: 'Deep Sleep Meditation',
    description: 'Gentle guidance into deep, restful sleep',
    duration: 1200,
    coverImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/rain_thunder_storm-Mike_Koenig-574654058.mp3',
    instructions: 'Find a comfortable position lying down. Close your eyes and take several deep breaths. Focus on relaxing each part of your body from toes to head. Let go of any thoughts and drift into sleep.'
  },
  {
    category: 'sleep',
    title: 'Bedtime Relaxation',
    description: 'Calming visualization for peaceful sleep',
    duration: 900,
    coverImage: 'https://images.unsplash.com/photo-1531279550271-23c2a77a765c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/Campfire-SoundBible.com-56729377.mp3',
    instructions: 'Lie down in a comfortable position. Take deep breaths and imagine yourself in a peaceful place. Let your mind create a safe, calm environment as you drift into sleep.'
  },
  {
    category: 'stress',
    title: 'Stress Relief',
    description: 'Release tension and find calm',
    duration: 600,
    coverImage: 'https://images.unsplash.com/photo-1611070572950-4cd83cce1f89?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    audioSrc: 'https://soundbible.com/mp3/meadow-birds2-daniel_simon.mp3',
    instructions: 'Sit comfortably with your back straight. Close your eyes and focus on your breath. When stress arises, acknowledge it without judgment, then return to your breath. Allow tension to dissolve with each exhale.'
  },
  {
    category: 'stress',
    title: 'Anxiety Antidote',
    description: 'Ease anxiety with breathing and visualization',
    duration: 900,
    coverImage: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/meadow-birds2-daniel_simon.mp3',
    instructions: 'Find a quiet place and sit comfortably. Close your eyes and focus on taking slow, deep breaths. Visualize your anxiety as a cloud that slowly dissolves with each breath. Feel your body becoming lighter and more relaxed.'
  },
  {
    category: 'focus',
    title: 'Productivity Boost',
    description: 'Sharpen focus and concentration',
    duration: 300,
    coverImage: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/rain_thunder_storm-Mike_Koenig-574654058.mp3',
    instructions: 'Sit with your back straight and feet flat on the floor. Focus on your breath while counting slowly to ten. If your mind wanders, gently bring it back to counting. This practice trains your mind to stay present and focused.'
  },
  {
    category: 'focus',
    title: 'Deep Work Session',
    description: 'Enter a state of flow and focused attention',
    duration: 1800,
    coverImage: 'https://images.unsplash.com/photo-1589279455858-5da26fee43ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/Campfire-SoundBible.com-56729377.mp3',
    instructions: 'Prepare your workspace to minimize distractions. Sit comfortably and take three deep breaths. Set an intention for your work session. When your mind wanders, gently return your attention to the task at hand.'
  },
  {
    category: 'mindfulness',
    title: 'Present Moment Awareness',
    description: 'Anchor yourself in the now',
    duration: 600,
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/meadow-birds2-daniel_simon.mp3',
    instructions: 'Find a comfortable seated position. Close your eyes and bring awareness to the present moment. Notice sensations in your body, sounds around you, and thoughts passing through your mind without judgment.'
  },
  {
    category: 'mindfulness',
    title: 'Body Scan',
    description: 'Reconnect with your physical sensations',
    duration: 900,
    coverImage: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    audioSrc: 'https://soundbible.com/mp3/rain_thunder_storm-Mike_Koenig-574654058.mp3',
    instructions: 'Lie down comfortably. Starting at your toes, bring awareness to each part of your body, moving upward. Notice sensations without trying to change them. This practice builds body awareness and relaxation.'
  }
];

const getCategoryImage = (category: string) => {
  const images = {
    sleep: [
      'https://images.unsplash.com/photo-1455642305358-78c7d13e6f36?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1531279550271-23c2a77a765c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    stress: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1611070572950-4cd83cce1f89?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    focus: [
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1518002054494-3a6f23d99728?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1589279455858-5da26fee43ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    mindfulness: [
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1528696892704-5e1122852276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  };
  
  const categoryImages = images[category as keyof typeof images] || images.mindfulness;
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

type BreathingExerciseState = {
  active: boolean;
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  phaseTimeRemaining: number;
  settings: {
    inhaleTime: number;
    holdTime: number;
    exhaleTime: number;
    restTime: number;
  };
};

type BreathingExerciseType = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  settings: {
    inhaleTime: number;
    holdTime: number;
    exhaleTime: number;
    restTime: number;
  };
  rounds: number;
};

const breathingExercises: BreathingExerciseType[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Inhale through your nose for 4 seconds, hold for 7 seconds, exhale through mouth for 8 seconds.',
    icon: Waves,
    color: 'nira',
    settings: {
      inhaleTime: 4,
      holdTime: 7,
      exhaleTime: 8,
      restTime: 2
    },
    rounds: 4
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds.',
    icon: Timer,
    color: 'purple',
    settings: {
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      restTime: 4
    },
    rounds: 4
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic Breathing',
    description: 'Place one hand on chest and the other on belly. Breathe deeply through nose, ensuring belly expands, not chest.',
    icon: Clock,
    color: 'pink',
    settings: {
      inhaleTime: 5,
      holdTime: 2,
      exhaleTime: 5,
      restTime: 1
    },
    rounds: 5
  }
];

const Meditate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);
  const [activeBreathingExercise, setActiveBreathingExercise] = useState<string | null>(null);
  
  const [breathingState, setBreathingState] = useState<BreathingExerciseState | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!breathingState || !breathingState.active) return;
    
    intervalRef.current = window.setInterval(() => {
      setBreathingState(prev => {
        if (!prev) return null;
        
        let newPhaseTimeRemaining = prev.phaseTimeRemaining - 1;
        let newPhase = prev.phase;
        let newTimeRemaining = prev.timeRemaining - 1;
        let newCurrentRound = prev.currentRound;
        
        if (newPhaseTimeRemaining <= 0) {
          if (newPhase === 'inhale') {
            newPhase = 'hold';
            newPhaseTimeRemaining = prev.settings.holdTime;
          } else if (newPhase === 'hold') {
            newPhase = 'exhale';
            newPhaseTimeRemaining = prev.settings.exhaleTime;
          } else if (newPhase === 'exhale') {
            newPhase = 'rest';
            newPhaseTimeRemaining = prev.settings.restTime;
          } else if (newPhase === 'rest') {
            newCurrentRound++;
            
            if (newCurrentRound > prev.totalRounds) {
              window.clearInterval(intervalRef.current!);
              return {
                ...prev,
                active: false,
                phase: 'inhale',
                currentRound: prev.totalRounds,
                timeRemaining: 0,
                phaseTimeRemaining: 0
              };
            }
            
            newPhase = 'inhale';
            newPhaseTimeRemaining = prev.settings.inhaleTime;
          }
        }
        
        return {
          ...prev,
          phase: newPhase,
          currentRound: newCurrentRound,
          timeRemaining: newTimeRemaining,
          phaseTimeRemaining: newPhaseTimeRemaining
        };
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [breathingState?.active]);
  
  const startBreathingExercise = (exerciseId: string) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    const exercise = breathingExercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    const cycleTime = exercise.settings.inhaleTime + exercise.settings.holdTime + 
                     exercise.settings.exhaleTime + exercise.settings.restTime;
    const totalTime = cycleTime * exercise.rounds;
    
    setActiveBreathingExercise(exerciseId);
    setBreathingState({
      active: true,
      phase: 'inhale',
      currentRound: 1,
      totalRounds: exercise.rounds,
      timeRemaining: totalTime,
      phaseTimeRemaining: exercise.settings.inhaleTime,
      settings: exercise.settings
    });
  };
  
  const pauseBreathingExercise = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    setBreathingState(prev => {
      if (!prev) return null;
      return { ...prev, active: false };
    });
  };
  
  const resumeBreathingExercise = () => {
    setBreathingState(prev => {
      if (!prev) return null;
      return { ...prev, active: true };
    });
  };
  
  const resetBreathingExercise = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    if (!activeBreathingExercise) return;
    
    const exercise = breathingExercises.find(ex => ex.id === activeBreathingExercise);
    if (!exercise) return;
    
    const cycleTime = exercise.settings.inhaleTime + exercise.settings.holdTime + 
                     exercise.settings.exhaleTime + exercise.settings.restTime;
    const totalTime = cycleTime * exercise.rounds;
    
    setBreathingState({
      active: false,
      phase: 'inhale',
      currentRound: 1,
      totalRounds: exercise.rounds,
      timeRemaining: totalTime,
      phaseTimeRemaining: exercise.settings.inhaleTime,
      settings: exercise.settings
    });
  };
  
  const getPhaseInstructions = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return 'Rest';
      default: return '';
    }
  };
  
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'inhale': return <ArrowUp className="h-6 w-6" />;
      case 'hold': return <Pause className="h-6 w-6" />;
      case 'exhale': return <ArrowDown className="h-6 w-6" />;
      case 'rest': return <Clock className="h-6 w-6" />;
      default: return null;
    }
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="flex-1 pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 mb-4 transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-medium heading-gradient mb-2">Meditation & Breathing</h1>
          </div>
          
          {selectedMeditation ? (
            <div className="glass-panel p-6 md:p-8 mb-8">
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setSelectedMeditation(null)}
                  className="self-start mb-6 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 transition-colors flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Back to Meditations
                </button>
                
                <h2 className="text-2xl md:text-3xl font-medium mb-2 text-center">{selectedMeditation.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
                  {selectedMeditation.description}
                </p>
                
                <div className="w-full max-w-md mx-auto mb-8">
                  <MeditationPlayer 
                    title={selectedMeditation.title}
                    duration={selectedMeditation.duration}
                    coverImage={selectedMeditation.coverImage}
                    audioSrc={selectedMeditation.audioSrc}
                  />
                </div>
                
                <div className="w-full max-w-2xl mx-auto mt-6 p-6 glass-card">
                  <h3 className="text-xl font-medium mb-4 text-nira-600 dark:text-nira-400">How to Practice</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={selectedMeditation.coverImage} 
                        alt="Meditation posture" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getCategoryImage(selectedMeditation.category);
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedMeditation.instructions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Meditations</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="stress">Stress</TabsTrigger>
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {meditations.map((meditation, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden cursor-pointer hover:shadow-medium transition-all"
                      onClick={() => setSelectedMeditation(meditation)}
                    >
                      <div className="aspect-square relative">
                        <img 
                          src={meditation.coverImage || getCategoryImage(meditation.category)}
                          alt={meditation.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getCategoryImage(meditation.category);
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                          <span className="text-sm font-medium">
                            {formatDuration(meditation.duration)}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meditation.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {meditation.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {['sleep', 'stress', 'focus', 'mindfulness'].map(category => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meditations
                      .filter(m => m.category === category)
                      .map((meditation, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden cursor-pointer hover:shadow-medium transition-all"
                          onClick={() => setSelectedMeditation(meditation)}
                        >
                          <div className="aspect-square relative">
                            <img 
                              src={meditation.coverImage || getCategoryImage(category)}
                              alt={meditation.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getCategoryImage(category);
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                              <span className="text-sm font-medium">
                                {formatDuration(meditation.duration)}
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-1">{meditation.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {meditation.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
          
          <div className="glass-panel p-6 md:p-8">
            <h2 className="text-2xl font-medium mb-6">Breathing Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {breathingExercises.map((exercise) => {
                const isActive = activeBreathingExercise === exercise.id;
                return (
                  <Card 
                    key={exercise.id}
                    className={`glass-card p-6 transition-all ${isActive ? `ring-2 ring-${exercise.color}-500` : 'hover:shadow-medium'}`}
                  >
                    <h3 className="text-lg font-medium mb-3 text-nira-600 dark:text-nira-400">
                      {exercise.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {exercise.description}
                    </p>
                    
                    {isActive && breathingState ? (
                      <div className="flex flex-col items-center">
                        <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${
                          breathingState.phase === 'inhale' ? 'bg-gradient-to-tr from-teal-500/40 to-blue-300/40 scale-100' : 
                          breathingState.phase === 'exhale' ? 'bg-gradient-to-tr from-teal-500/20 to-blue-300/20 scale-75' : 
                          'bg-gradient-to-tr from-teal-500/30 to-blue-300/30 scale-90'
                        }`}>
                          <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center">
                              {getPhaseIcon(breathingState.phase)}
                              <span className="ml-2">{getPhaseInstructions(breathingState.phase)}</span>
                            </div>
                            <span className="block text-3xl font-bold text-nira-600 dark:text-nira-400">
                              {breathingState.phaseTimeRemaining}
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full mb-4">
                          <Progress value={(breathingState.phaseTimeRemaining / (
                            breathingState.phase === 'inhale' ? breathingState.settings.inhaleTime :
                            breathingState.phase === 'hold' ? breathingState.settings.holdTime :
                            breathingState.phase === 'exhale' ? breathingState.settings.exhaleTime :
                            breathingState.settings.restTime
                          )) * 100} className="h-2" />
                        </div>
                        
                        <div className="text-sm mb-4 text-center">
                          <span className="font-medium">Round:</span> {breathingState.currentRound} of {breathingState.totalRounds}
                        </div>
                        
                        <div className="flex gap-2">
                          {breathingState.active ? (
                            <button
                              onClick={pauseBreathingExercise}
                              className="px-4 py-2 bg-amber-500 rounded-md text-white hover:bg-amber-600"
                            >
                              Pause
                            </button>
                          ) : (
                            <button
                              onClick={resumeBreathingExercise}
                              className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600"
                            >
                              Resume
                            </button>
                          )}
                          <button
                            onClick={resetBreathingExercise}
                            className="px-4 py-2 bg-gray-500 rounded-md text-white hover:bg-gray-600"
                          >
                            <RefreshCw size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startBreathingExercise(exercise.id)}
                        className="w-full mt-2 py-2 bg-nira-500 hover:bg-nira-600 text-white rounded-lg transition-colors"
                      >
                        Start Exercise
                      </button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Meditate;
