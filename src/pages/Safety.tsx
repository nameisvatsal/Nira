
import { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, MessageSquare, Globe, ExternalLink, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SafetyResources from '@/components/ui/SafetyResources';

const Safety = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const safetyTips = [
    {
      title: "Recognize Warning Signs",
      description: "Learn to identify signs of mental health crisis in yourself and others",
      tips: [
        "Extreme mood changes or emotional outbursts",
        "Withdrawal from friends, family, and regular activities",
        "Changes in sleeping or eating patterns",
        "Increased feelings of hopelessness or worthlessness",
        "Talking about death, suicide, or self-harm",
        "Giving away possessions or saying goodbyes",
        "Increased substance use"
      ]
    },
    {
      title: "Create a Safety Plan",
      description: "Develop a personal plan for when you're experiencing a mental health crisis",
      tips: [
        "Identify personal warning signs and triggers",
        "List coping strategies that work for you",
        "Have contact information for trusted friends and family",
        "Know professional resources and crisis hotlines",
        "Remove access to means of self-harm",
        "Create a safe and calming environment",
        "Have a list of reasons to live"
      ]
    },
    {
      title: "Practice Self-Care",
      description: "Maintain daily habits that support mental wellness",
      tips: [
        "Establish regular sleep patterns",
        "Eat nutritious meals and stay hydrated",
        "Engage in regular physical activity",
        "Practice mindfulness or meditation",
        "Limit exposure to negative news and social media",
        "Spend time in nature",
        "Maintain social connections"
      ]
    }
  ];

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center mb-6">
          <ShieldAlert className="mr-3 text-red-500" size={28} />
          <h1 className="text-3xl md:text-4xl font-medium">Safety Resources</h1>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/20 rounded-lg p-4 mb-8 flex items-start">
          <Info className="text-red-500 mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Emergency Notice</h3>
            <p className="text-red-700 dark:text-red-200">
              If you or someone else is in immediate danger or needs urgent medical attention, please call emergency services (911 in the US) immediately. The resources provided here are not a substitute for professional help in an emergency situation.
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="crisis" className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="crisis">Crisis Resources</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crisis">
            <SafetyResources />
          </TabsContent>
          
          <TabsContent value="prevention">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {safetyTips.map((section, index) => (
                <Card key={index} className="glass-panel">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <Heart className="text-nira-500 mr-2 flex-shrink-0 mt-1" size={16} />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="education">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Mental Health Resources & Education</CardTitle>
                <CardDescription>Learn more about mental health conditions and treatment options</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>National Mental Health Organizations</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="font-medium mb-1">National Alliance on Mental Illness (NAMI)</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            The nation's largest grassroots mental health organization dedicated to building better lives for those affected by mental illness.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              Visit NAMI
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Mental Health America</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Promotes mental health and works toward preventing mental illness through advocacy, education, research, and services.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.mhanational.org" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              Visit Mental Health America
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Free Mental Health Courses</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="font-medium mb-1">Yale's "The Science of Well-Being"</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            A free course on the science of happiness and how to lead a more fulfilling life.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.coursera.org/learn/the-science-of-well-being" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              View Course
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Mental Health First Aid</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Learn how to identify, understand and respond to signs of mental illnesses and substance use disorders.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.mentalhealthfirstaid.org" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              Learn More
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Mental Health Apps & Tools</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="font-medium mb-1">Headspace</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Meditation and mindfulness app to help with stress, anxiety, sleep, and focus.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.headspace.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              Visit Headspace
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Calm</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            App for meditation, sleep stories, breathing programs, and relaxing music.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.calm.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Globe className="mr-2" size={14} />
                              Visit Calm
                              <ExternalLink className="ml-2" size={12} />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="glass-panel bg-gradient-to-br from-nira-50/50 to-purple-50/50 dark:from-nira-900/30 dark:to-purple-900/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-2">Need to talk to someone now?</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Professional help is available 24/7. You don't have to face difficult times alone.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button className="bg-red-500 hover:bg-red-600 flex items-center justify-center" asChild>
                  <a href="tel:988" className="flex items-center justify-center">
                    <PhoneCall className="mr-2" size={18} />
                    Call 988 Suicide & Crisis Lifeline
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="sms:988" className="flex items-center justify-center">
                    <MessageSquare className="mr-2" size={18} />
                    Text 988 for Crisis Support
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Safety;
