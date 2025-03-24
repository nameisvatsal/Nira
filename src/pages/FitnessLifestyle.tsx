import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, Brain, Heart, Dumbbell, ArrowLeft, ArrowRight, Info, 
  Droplets, BookOpen, Coffee, Moon, CheckCircle, Calendar, Clock, Bell
} from 'lucide-react';

const mentalHealthIssues = [
  {
    id: 'anxiety',
    title: 'Anxiety',
    description: 'Techniques and resources to manage anxiety and worry',
    icon: <Brain className="text-purple-500" />,
    color: 'purple',
    subcategories: [
      { id: 'techniques', title: 'Coping Techniques' },
      { id: 'meditation', title: 'Meditation Practices' },
      { id: 'therapy', title: 'Therapy Options' },
      { id: 'lifestyle', title: 'Lifestyle Changes' },
    ]
  },
  {
    id: 'depression',
    title: 'Depression',
    description: 'Guidance for managing depression and improving mood',
    icon: <Brain className="text-blue-500" />,
    color: 'blue',
    subcategories: [
      { id: 'self-care', title: 'Self-Care Practices' },
      { id: 'motivation', title: 'Finding Motivation' },
      { id: 'support', title: 'Support Systems' },
      { id: 'treatment', title: 'Treatment Options' },
    ]
  },
  {
    id: 'stress',
    title: 'Stress Management',
    description: 'Tools and practices to reduce and manage stress',
    icon: <Brain className="text-green-500" />,
    color: 'green',
    subcategories: [
      { id: 'relaxation', title: 'Relaxation Techniques' },
      { id: 'boundaries', title: 'Setting Boundaries' },
      { id: 'time-management', title: 'Time Management' },
      { id: 'mindfulness', title: 'Mindfulness Practices' },
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep Issues',
    description: 'Ways to improve sleep quality and quantity',
    icon: <Brain className="text-indigo-500" />,
    color: 'indigo',
    subcategories: [
      { id: 'hygiene', title: 'Sleep Hygiene' },
      { id: 'environment', title: 'Optimizing Environment' },
      { id: 'routine', title: 'Bedtime Routines' },
      { id: 'supplements', title: 'Natural Supplements' },
    ]
  },
  {
    id: 'self-esteem',
    title: 'Self-Esteem',
    description: 'Building confidence and positive self-image',
    icon: <Heart className="text-pink-500" />,
    color: 'pink',
    subcategories: [
      { id: 'affirmations', title: 'Positive Affirmations' },
      { id: 'body-image', title: 'Body Image' },
      { id: 'achievements', title: 'Celebrating Achievements' },
      { id: 'comparison', title: 'Avoiding Comparison' },
    ]
  },
  {
    id: 'burnout',
    title: 'Burnout',
    description: 'Recognizing and recovering from burnout',
    icon: <Brain className="text-red-500" />,
    color: 'red',
    subcategories: [
      { id: 'recovery', title: 'Recovery Strategies' },
      { id: 'prevention', title: 'Prevention Tips' },
      { id: 'workplace', title: 'Workplace Wellness' },
      { id: 'balance', title: 'Work-Life Balance' },
    ]
  },
  {
    id: 'habits',
    title: 'Healthy Habits',
    description: 'Forming and maintaining positive daily routines',
    icon: <Dumbbell className="text-teal-500" />,
    color: 'teal',
    subcategories: [
      { id: 'nutrition', title: 'Nutrition' },
      { id: 'exercise', title: 'Physical Activity' },
      { id: 'hydration', title: 'Hydration' },
      { id: 'consistency', title: 'Building Consistency' },
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Nurturing healthy connections with others',
    icon: <Heart className="text-orange-500" />,
    color: 'orange',
    subcategories: [
      { id: 'communication', title: 'Communication Skills' },
      { id: 'boundaries', title: 'Healthy Boundaries' },
      { id: 'conflict', title: 'Conflict Resolution' },
      { id: 'loneliness', title: 'Combating Loneliness' },
    ]
  }
];

const defaultHabits = [
  { id: 1, name: 'Drink 8 glasses of water', iconType: 'droplets', color: 'blue', completed: false },
  { id: 2, name: 'Sleep 7-8 hours', iconType: 'moon', color: 'indigo', completed: false },
  { id: 3, name: 'Read for 20 minutes', iconType: 'book', color: 'purple', completed: false },
  { id: 4, name: 'Practice mindfulness', iconType: 'brain', color: 'green', completed: false },
  { id: 5, name: 'Journal your emotions', iconType: 'heart', color: 'pink', completed: false },
  { id: 6, name: 'Limit caffeine intake', iconType: 'coffee', color: 'amber', completed: false }
];

const moodBoostingFoods = [
  { 
    mood: 'anxious', 
    foods: [
      'Chamomile tea', 'Yogurt', 'Blueberries', 'Dark chocolate', 'Spinach'
    ],
    description: 'Foods rich in magnesium, zinc, and antioxidants can help reduce anxiety.'
  },
  { 
    mood: 'depressed', 
    foods: [
      'Fatty fish (salmon)', 'Walnuts', 'Avocados', 'Bananas', 'Turkey'
    ],
    description: 'Foods rich in omega-3 fatty acids and tryptophan can help boost mood.'
  },
  { 
    mood: 'tired', 
    foods: [
      'Oatmeal', 'Quinoa', 'Sweet potatoes', 'Eggs', 'Apples'
    ],
    description: 'Complex carbs and protein provide sustained energy without crashes.'
  },
  { 
    mood: 'foggy', 
    foods: [
      'Blueberries', 'Green tea', 'Turmeric', 'Broccoli', 'Pumpkin seeds'
    ],
    description: 'Foods with antioxidants and anti-inflammatory properties help improve focus.'
  }
];

const mindBodyWorkouts = [
  {
    category: 'Yoga & Stretching',
    exercises: [
      { 
        name: 'Stress Relief Yoga', 
        duration: '10 min', 
        description: 'Gentle yoga sequence focusing on deep breathing and relaxing stretches',
        difficulty: 'Beginner'
      },
      { 
        name: 'Office Chair Stretches', 
        duration: '5 min', 
        description: 'Quick stretches you can do at your desk to release tension',
        difficulty: 'Beginner'
      },
      { 
        name: 'Bedtime Yoga Flow', 
        duration: '15 min', 
        description: 'Calming sequence to prepare your body and mind for sleep',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    category: 'Light Workouts',
    exercises: [
      { 
        name: 'Mood-Boosting Walk', 
        duration: '20 min', 
        description: 'Mindful walking with breathing exercises to elevate mood',
        difficulty: 'Beginner'
      },
      { 
        name: 'Energy Flow', 
        duration: '15 min', 
        description: 'Low impact movements to increase energy and reduce fatigue',
        difficulty: 'Beginner'
      },
      { 
        name: 'Stress Release Circuit', 
        duration: '10 min', 
        description: 'Quick circuit designed to release physical tension',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    category: 'Mind-Body Connection',
    exercises: [
      { 
        name: 'Tai Chi Basics', 
        duration: '15 min', 
        description: 'Introduction to Tai Chi movements for relaxation',
        difficulty: 'Beginner'
      },
      { 
        name: 'Dance Therapy', 
        duration: '10 min', 
        description: 'Free-form dance session to express emotions and boost mood',
        difficulty: 'Beginner'
      },
      { 
        name: 'Qigong Energy Flow', 
        duration: '20 min', 
        description: 'Ancient practice to balance energy and reduce stress',
        difficulty: 'Intermediate'
      }
    ]
  }
];

const generatePosts = (issueId: string, subcategoryId: string) => {
  return [
    {
      id: `${issueId}-${subcategoryId}-1`,
      title: `Understanding ${subcategoryId} for ${issueId}`,
      excerpt: `Learn the basics of ${subcategoryId} to help manage ${issueId}.`,
      readTime: '5 min read',
      date: 'June 12, 2023',
      content: `
        <h1>Understanding ${subcategoryId} for ${issueId}</h1>
        <p>This comprehensive guide will help you understand how ${subcategoryId} can be effective for managing ${issueId}.</p>
        <h2>What is ${subcategoryId}?</h2>
        <p>${subcategoryId} refers to specific practices or approaches that can help individuals cope with ${issueId}. These methods have been researched and proven effective for many people.</p>
        <h2>How it helps with ${issueId}</h2>
        <p>When practiced regularly, ${subcategoryId} can reduce symptoms of ${issueId} by activating your body's relaxation response and reducing the production of stress hormones.</p>
        <h2>Getting Started</h2>
        <p>Begin with 5-10 minutes daily of focused practice. Gradually increase the duration as you become more comfortable with the techniques.</p>
        <h2>Tips for Success</h2>
        <ul>
          <li>Be consistent with your practice</li>
          <li>Find a quiet, comfortable space</li>
          <li>Don't judge yourself if your mind wanders</li>
          <li>Start small and build gradually</li>
        </ul>
        <h2>When to Seek Professional Help</h2>
        <p>While these practices can be helpful, they are not a replacement for professional treatment. If your symptoms are severe or persistent, please consult a healthcare provider.</p>
      `
    },
    {
      id: `${issueId}-${subcategoryId}-2`,
      title: `5 Essential ${subcategoryId} Techniques for ${issueId}`,
      excerpt: `Discover five proven ${subcategoryId} techniques that can help with ${issueId}.`,
      readTime: '7 min read',
      date: 'July 3, 2023',
      content: `
        <h1>5 Essential ${subcategoryId} Techniques for ${issueId}</h1>
        <p>These five techniques can be particularly helpful for managing ${issueId} through ${subcategoryId}.</p>
        <h2>Technique 1: Mindful Awareness</h2>
        <p>Practice observing your thoughts and feelings without judgment. This helps create distance from distressing emotions.</p>
        <h2>Technique 2: Progressive Muscle Relaxation</h2>
        <p>Systematically tense and release different muscle groups to reduce physical tension associated with ${issueId}.</p>
        <h2>Technique 3: Guided Imagery</h2>
        <p>Use your imagination to create calming mental scenes that provide an escape from ${issueId} symptoms.</p>
        <h2>Technique 4: Deep Breathing</h2>
        <p>Practice diaphragmatic breathing to activate your parasympathetic nervous system and reduce ${issueId} symptoms.</p>
        <h2>Technique 5: Positive Affirmations</h2>
        <p>Replace negative thought patterns with positive statements to reframe your perspective on ${issueId}.</p>
        <h2>Putting It All Together</h2>
        <p>Try incorporating one new technique each week. Keep a journal to track which methods work best for you.</p>
      `
    },
    {
      id: `${issueId}-${subcategoryId}-3`,
      title: `${subcategoryId} Research for ${issueId} Management`,
      excerpt: `The latest research on using ${subcategoryId} to manage ${issueId}.`,
      readTime: '10 min read',
      date: 'August 15, 2023',
      content: `
        <h1>${subcategoryId} Research for ${issueId} Management</h1>
        <p>Recent scientific studies have provided valuable insights into how ${subcategoryId} affects ${issueId}.</p>
        <h2>Research Findings</h2>
        <p>Multiple studies have demonstrated that regular practice of ${subcategoryId} can significantly reduce symptoms of ${issueId} in many individuals.</p>
        <h2>Biological Mechanisms</h2>
        <p>Research suggests that ${subcategoryId} works by regulating stress hormones, improving neural connectivity, and enhancing emotional regulation abilities.</p>
        <h2>Comparative Effectiveness</h2>
        <p>When compared to other interventions, ${subcategoryId} has shown comparable effectiveness to some medications for mild to moderate ${issueId}, with fewer side effects.</p>
        <h2>Long-term Benefits</h2>
        <p>Longitudinal studies indicate that consistent ${subcategoryId} practice can lead to lasting improvements in ${issueId} symptoms and overall well-being.</p>
        <h2>Future Directions</h2>
        <p>Ongoing research is exploring personalized approaches to ${subcategoryId} for ${issueId}, taking into account individual differences and preferences.</p>
      `
    },
  ];
};

const renderIcon = (iconType: string, size = 18, className = '') => {
  switch (iconType) {
    case 'droplets':
      return <Droplets size={size} className={className} />;
    case 'moon':
      return <Moon size={size} className={className} />;
    case 'book':
      return <BookOpen size={size} className={className} />;
    case 'brain':
      return <Brain size={size} className={className} />;
    case 'heart':
      return <Heart size={size} className={className} />;
    case 'coffee':
      return <Coffee size={size} className={className} />;
    case 'check':
      return <CheckCircle size={size} className={className} />;
    default:
      return <CheckCircle size={size} className={className} />;
  }
};

const FitnessLifestyle = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : defaultHabits;
  });
  const [newHabit, setNewHabit] = useState('');
  const [selectedMood, setSelectedMood] = useState('anxious');
  const [waterIntake, setWaterIntake] = useState(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    return savedIntake ? parseInt(savedIntake, 10) : 0;
  });
  
  const { issueId, categoryId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
    
    if (issueId) {
      const issue = mentalHealthIssues.find(i => i.id === issueId);
      if (issue) {
        setSelectedIssue(issue);
        if (categoryId) {
          const subcategory = issue.subcategories.find((s: any) => s.id === categoryId);
          if (subcategory) {
            setSelectedSubcategory(subcategory);
          }
        }
      }
    }
  }, [issueId, categoryId]);
  
  useEffect(() => {
    if (selectedIssue && selectedSubcategory) {
      setPosts(generatePosts(selectedIssue.id, selectedSubcategory.id));
    }
  }, [selectedIssue, selectedSubcategory]);
  
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);
  
  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);
  
  const handleIssueSelect = (issue: any) => {
    setSelectedIssue(issue);
    setSelectedSubcategory(null);
    setSelectedPost(null);
    navigate(`/fitness-lifestyle/${issue.id}`);
  };
  
  const handleSubcategorySelect = (subcategory: any) => {
    setSelectedSubcategory(subcategory);
    setSelectedPost(null);
    navigate(`/fitness-lifestyle/${selectedIssue.id}/${subcategory.id}`);
  };
  
  const handlePostSelect = (post: any) => {
    setSelectedPost(post);
    const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    if (!history.some((item: any) => item.id === post.id)) {
      history.unshift({
        id: post.id,
        title: post.title,
        date: new Date().toISOString()
      });
      localStorage.setItem('readingHistory', JSON.stringify(history.slice(0, 20)));
    }
  };
  
  const handleBackClick = () => {
    if (selectedPost) {
      setSelectedPost(null);
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
      navigate(`/fitness-lifestyle/${selectedIssue.id}`);
    } else if (selectedIssue) {
      setSelectedIssue(null);
      navigate('/fitness-lifestyle');
    } else {
      navigate('/');
    }
  };
  
  const toggleHabitCompletion = (id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };
  
  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const newHabitObj = {
      id: Date.now(),
      name: newHabit,
      iconType: 'check',
      color: 'green',
      completed: false
    };
    
    setHabits(prev => [...prev, newHabitObj]);
    setNewHabit('');
  };
  
  const incrementWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, 8));
  };
  
  const decrementWater = () => {
    setWaterIntake(prev => Math.max(prev - 1, 0));
  };
  
  const getHabitCompletionPercentage = () => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(h => h.completed).length;
    return Math.round((completedCount / habits.length) * 100);
  };

  const renderMentalHealthSection = () => {
    return (
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto scrollbar-hide">
          <Link to="/fitness-lifestyle" className="hover:text-nira-500 whitespace-nowrap" onClick={() => {
            setSelectedIssue(null);
            setSelectedSubcategory(null);
            setSelectedPost(null);
          }}>Fitness & Lifestyle</Link>
          {selectedIssue && (
            <>
              <ArrowRight size={12} className="mx-2" />
              <button 
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSelectedPost(null);
                  navigate(`/fitness-lifestyle/${selectedIssue.id}`);
                }}
                className="hover:text-nira-500 whitespace-nowrap"
              >
                {selectedIssue.title}
              </button>
            </>
          )}
          {selectedSubcategory && (
            <>
              <ArrowRight size={12} className="mx-2" />
              <span className="whitespace-nowrap">{selectedSubcategory.title}</span>
            </>
          )}
        </div>

        {!selectedIssue && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentalHealthIssues.map((issue) => (
              <Card 
                key={issue.id} 
                className={`border-l-4 border-${issue.color}-500 hover:shadow-lg transition-shadow cursor-pointer animate-scale-in`}
                onClick={() => handleIssueSelect(issue)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    {issue.icon}
                    <CardTitle className="ml-2 text-lg">{issue.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{issue.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedIssue && !selectedSubcategory && (
          <div>
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackClick} className="mr-2">
                <ChevronLeft size={16} />
                <span className="ml-1">Back</span>
              </Button>
              <h2 className="text-2xl font-semibold">{selectedIssue.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedIssue.subcategories.map((subcategory: any) => (
                <Card 
                  key={subcategory.id}
                  className="hover:shadow-md transition-shadow cursor-pointer animate-scale-in"
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{subcategory.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Resources and guidance for {subcategory.title.toLowerCase()}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedIssue && selectedSubcategory && !selectedPost && (
          <div>
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackClick} className="mr-2">
                <ChevronLeft size={16} />
                <span className="ml-1">Back</span>
              </Button>
              <h2 className="text-2xl font-semibold">{selectedSubcategory.title}</h2>
            </div>
            <div className="space-y-4">
              {posts.map((post) => (
                <Card 
                  key={post.id}
                  className="hover:shadow-md transition-shadow cursor-pointer animate-scale-in"
                  onClick={() => handlePostSelect(post)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-2">{post.excerpt}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span className="mr-3">{post.readTime}</span>
                      <Calendar size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedPost && (
          <div>
            <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-4">
              <ChevronLeft size={16} />
              <span className="ml-1">Back to articles</span>
            </Button>
            <Card className="animate-fade-in">
              <CardContent className="pt-6">
                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderHabitsSection = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Daily Habits</h2>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-2">Today's Progress</span>
            <Progress value={getHabitCompletionPercentage()} className="w-28" />
            <span className="ml-2">{getHabitCompletionPercentage()}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit, index) => (
            <Card 
              key={habit.id} 
              className={`border-l-4 border-${habit.color}-500 hover:shadow-md transition-all duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`text-${habit.color}-500 mr-3`}>
                    {renderIcon(habit.iconType)}
                  </div>
                  <span className={habit.completed ? "line-through text-gray-400" : ""}>
                    {habit.name}
                  </span>
                </div>
                <Checkbox 
                  checked={habit.completed} 
                  onCheckedChange={() => toggleHabitCompletion(habit.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Add a new habit..." 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit}>Add</Button>
        </div>
        
        <Card className="animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Water Intake Tracker</CardTitle>
            <CardDescription>Aim for 8 glasses of water daily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={decrementWater}
                disabled={waterIntake <= 0}
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Droplets 
                    key={index}
                    size={24} 
                    className={index < waterIntake ? "text-blue-500 animate-bounce-gentle" : "text-gray-300"}
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={incrementWater}
                disabled={waterIntake >= 8}
              >
                <ArrowRight size={16} />
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">
              {waterIntake} of 8 glasses
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFoodSection = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Mood & Nutrition Guide</h2>
          <p className="text-gray-500 mb-4">
            What you eat significantly impacts how you feel. Select your current mood to see food suggestions that can help.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {moodBoostingFoods.map((item) => (
              <Button
                key={item.mood}
                variant={selectedMood === item.mood ? "default" : "outline"}
                onClick={() => setSelectedMood(item.mood)}
                className="animate-scale-in"
                style={{ animationDelay: `${moodBoostingFoods.findIndex(m => m.mood === item.mood) * 100}ms` }}
              >
                {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
              </Button>
            ))}
          </div>
          
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>
                Foods to boost your mood when you're feeling {selectedMood}
              </CardTitle>
              <CardDescription>
                {moodBoostingFoods.find(item => item.mood === selectedMood)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {moodBoostingFoods
                  .find(item => item.mood === selectedMood)
                  ?.foods.map((food, index) => (
                    <li key={index} className="flex items-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {food}
                    </li>
                  ))}
              </ul>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex items-center">
              <Info size={14} className="mr-2" />
              Always consult a healthcare professional for personalized nutrition advice.
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  const renderWorkoutSection = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Mind & Body Workouts</h2>
        <p className="text-gray-500 mb-4">
          These gentle exercises are designed to reduce stress, boost your mood, and help you feel more connected to your body.
        </p>
        
        <div className="space-y-6">
          {mindBodyWorkouts.map((category, categoryIndex) => (
            <div key={category.category} className="animate-slide-up" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
              <h3 className="text-xl font-medium mb-3">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.exercises.map((exercise, exerciseIndex) => (
                  <Card 
                    key={exercise.name} 
                    className="animate-scale-in hover:shadow-md transition-shadow" 
                    style={{ animationDelay: `${(categoryIndex * 200) + (exerciseIndex * 100)}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span className="mr-3">{exercise.duration}</span>
                        <span>{exercise.difficulty}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{exercise.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full hover-scale">
                        Start Workout
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Add ambient background orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>
      
      <div className="flex items-center mb-8 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ChevronLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">Fitness & Lifestyle</h1>
      </div>
      
      {(selectedIssue || selectedSubcategory || selectedPost) ? (
        renderMentalHealthSection()
      ) : (
        <>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="habits">Daily Habits</TabsTrigger>
              <TabsTrigger value="mental">Mental Health</TabsTrigger>
              <TabsTrigger value="food">Nutrition Guide</TabsTrigger>
              <TabsTrigger value="workouts">Mind-Body Workouts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="habits" className="animate-fade-in">
              {renderHabitsSection()}
            </TabsContent>
            
            <TabsContent value="mental" className="animate-fade-in">
              {renderMentalHealthSection()}
            </TabsContent>
            
            <TabsContent value="food" className="animate-fade-in">
              {renderFoodSection()}
            </TabsContent>
            
            <TabsContent value="workouts" className="animate-fade-in">
              {renderWorkoutSection()}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FitnessLifestyle;
