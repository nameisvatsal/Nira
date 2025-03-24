
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SmileIcon, Frown, Meh, ChevronRight, ChevronLeft, RefreshCw, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define quiz questions with scenarios
const quizQuestions = [
  {
    id: 1,
    scenario: "You've been trying to complete an important project, but keep encountering obstacles. How do you typically respond?",
    options: [
      { id: 'a', text: "I get frustrated and may give up", score: 1 },
      { id: 'b', text: "I feel stressed but push through", score: 2 },
      { id: 'c', text: "I take a break and return with fresh perspective", score: 3 },
      { id: 'd', text: "I see obstacles as learning opportunities", score: 4 }
    ]
  },
  {
    id: 2,
    scenario: "Your friend cancels plans at the last minute. What's your first reaction?",
    options: [
      { id: 'a', text: "I feel rejected and hurt", score: 1 },
      { id: 'b', text: "I'm disappointed but understand", score: 2 },
      { id: 'c', text: "I'm relieved to have unexpected free time", score: 3 },
      { id: 'd', text: "I immediately make alternative plans", score: 4 }
    ]
  },
  {
    id: 3,
    scenario: "You receive unexpected criticism about your work. How do you handle it?",
    options: [
      { id: 'a', text: "I take it personally and feel upset", score: 1 },
      { id: 'b', text: "I feel defensive but try to listen", score: 2 },
      { id: 'c', text: "I consider if there's something to learn from it", score: 3 },
      { id: 'd', text: "I appreciate the feedback as a growth opportunity", score: 4 }
    ]
  },
  {
    id: 4,
    scenario: "You wake up in the morning feeling tired. How does this affect your outlook for the day?",
    options: [
      { id: 'a', text: "I expect the whole day to be difficult", score: 1 },
      { id: 'b', text: "I worry I won't accomplish everything", score: 2 },
      { id: 'c', text: "I adjust my expectations but stay positive", score: 3 },
      { id: 'd', text: "I focus on self-care while still being productive", score: 4 }
    ]
  },
  {
    id: 5,
    scenario: "You're in a social gathering where you don't know many people. What's your approach?",
    options: [
      { id: 'a', text: "I feel anxious and stay on the sidelines", score: 1 },
      { id: 'b', text: "I stick close to the few people I know", score: 2 },
      { id: 'c', text: "I make an effort to meet one or two new people", score: 3 },
      { id: 'd', text: "I see it as an exciting chance to expand my network", score: 4 }
    ]
  }
];

// Define mood results based on score ranges
const moodResults = [
  {
    range: [5, 10],
    mood: "Could use support",
    description: "You may be experiencing some challenging emotions right now. Consider prioritizing self-care and reaching out for support.",
    icon: <Frown className="h-12 w-12 text-red-500 mx-auto mb-4" />,
    suggestions: [
      "Try a simple 5-minute meditation",
      "Reach out to a trusted friend",
      "Practice gentle self-compassion",
      "Consider journaling about your feelings"
    ]
  },
  {
    range: [11, 15],
    mood: "Balanced",
    description: "You're maintaining a balanced outlook, though you might benefit from some additional emotional support strategies.",
    icon: <Meh className="h-12 w-12 text-amber-500 mx-auto mb-4" />,
    suggestions: [
      "Incorporate a daily gratitude practice",
      "Try a brief mindfulness exercise",
      "Engage in a hobby you enjoy",
      "Connect with a supportive person"
    ]
  },
  {
    range: [16, 20],
    mood: "Resilient",
    description: "You're displaying strong emotional resilience and positive coping strategies.",
    icon: <SmileIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />,
    suggestions: [
      "Share your positive strategies with others",
      "Challenge yourself to learn something new",
      "Celebrate your emotional intelligence",
      "Continue building on your strengths"
    ]
  }
];

const MoodAssessmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [result, setResult] = useState<typeof moodResults[0] | null>(null);
  const { toast } = useToast();

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption) {
      // Save current answer
      const questionId = quizQuestions[currentQuestion].id;
      setAnswers({...answers, [questionId]: selectedOption});
      
      // Calculate score for this question
      const option = quizQuestions[currentQuestion].options.find(opt => opt.id === selectedOption);
      const score = option ? option.score : 0;
      
      // Add to total
      setTotalScore(prevScore => prevScore + score);
      
      // Move to next question or show results
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
        setSelectedOption(null);
      } else {
        // Quiz completed - determine result
        const finalScore = totalScore + score;
        const matchedResult = moodResults.find(
          r => finalScore >= r.range[0] && finalScore <= r.range[1]
        );
        
        setResult(matchedResult || null);
        setShowResults(true);
        
        // Store result in localStorage
        if (matchedResult) {
          localStorage.setItem('currentMood', matchedResult.mood.toLowerCase());
          localStorage.setItem('lastAssessmentDate', new Date().toISOString());
        }
        
        toast({
          title: "Quiz Completed!",
          description: "Thank you for completing the mood assessment."
        });
      }
    } else {
      toast({
        title: "Please select an option",
        description: "Select a response to continue",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prevQuestion => prevQuestion - 1);
      
      // Restore previous answer if available
      const questionId = quizQuestions[currentQuestion - 1].id;
      setSelectedOption(answers[questionId] || null);
      
      // Subtract the score from the previous question
      const prevQuestionId = quizQuestions[currentQuestion].id;
      const prevOption = quizQuestions[currentQuestion].options.find(opt => opt.id === answers[prevQuestionId]);
      const prevScore = prevOption ? prevOption.score : 0;
      
      setTotalScore(prevScore => Math.max(0, prevScore - prevScore));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResults(false);
    setTotalScore(0);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-nira-500" />
          Mood Assessment Quiz
        </CardTitle>
        <CardDescription>
          Explore your emotional responses to different scenarios
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestion].scenario}</h3>
              
              <RadioGroup 
                value={selectedOption || ""} 
                onValueChange={handleOptionSelect}
                className="space-y-3"
              >
                {quizQuestions[currentQuestion].options.map(option => (
                  <div 
                    key={option.id} 
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <RadioGroupItem 
                      value={option.id} 
                      id={`option-${option.id}`} 
                      className="text-nira-500"
                    />
                    <Label 
                      htmlFor={`option-${option.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                className="bg-nira-500 hover:bg-nira-600 text-white flex items-center"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            {result?.icon}
            <h3 className="text-xl font-bold mb-2">{result?.mood}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {result?.description}
            </p>
            
            <div className="bg-nira-50 dark:bg-nira-900/20 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Suggestions:</h4>
              <ul className="text-left space-y-2">
                {result?.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block mr-2 text-nira-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={resetQuiz}
              className="flex items-center mx-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodAssessmentQuiz;
