
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Frown, Meh as MehIcon, SmileIcon, Hammer } from 'lucide-react';

const PunchingBagGame = () => {
  const [punchCount, setPunchCount] = useState(0);
  const [power, setPower] = useState(0);
  const [bagName, setBagName] = useState('Stress Bag');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFace, setSelectedFace] = useState<string>('meh');
  const bagRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const punchingArmRef = useRef<HTMLDivElement>(null);
  
  const punchBag = () => {
    if (isAnimating) return;
    
    const bagElement = bagRef.current;
    const ropeElement = ropeRef.current;
    const armElement = punchingArmRef.current;
    if (!bagElement || !ropeElement || !armElement) return;
    
    // Set animation state
    setIsAnimating(true);
    
    // Increment punch count
    setPunchCount(prev => prev + 1);
    
    // Increment power - resets at 100
    setPower(prev => (prev + 5) % 101);
    
    // Get random angle for punch effect
    const angle = Math.random() * 30 - 15; // -15 to 15 degrees
    
    // Apply animations for punching arm
    armElement.style.transform = 'rotate(-30deg) translateX(-20px)';
    
    // Apply animation timeout for arm coming back
    setTimeout(() => {
      armElement.style.transform = 'rotate(0deg) translateX(0)';
    }, 150);
    
    // Apply animations for bag
    setTimeout(() => {
      bagElement.style.transform = `rotate(${angle}deg) translateX(60px)`;
      ropeElement.style.transform = `rotate(${angle/2}deg)`;
      
      // Reset bag position after animation
      setTimeout(() => {
        bagElement.style.transform = 'rotate(0deg) translateX(0)';
        ropeElement.style.transform = 'rotate(0deg)';
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    }, 50);
  };
  
  const resetGame = () => {
    setPunchCount(0);
    setPower(0);
  };
  
  const getFaceIcon = () => {
    switch(selectedFace) {
      case 'angry': return <Frown size={48} className="text-red-500" />;
      case 'sad': return <Frown size={48} className="text-blue-500" />;
      case 'meh': return <MehIcon size={48} className="text-yellow-500" />;
      case 'happy': return <SmileIcon size={48} className="text-green-500" />;
      default: return <MehIcon size={48} className="text-yellow-500" />;
    }
  };
  
  const faces = [
    { id: 'angry', label: 'Angry', icon: <Frown size={20} className="text-red-500" /> },
    { id: 'sad', label: 'Sad', icon: <Frown size={20} className="text-blue-500" /> },
    { id: 'meh', label: 'Neutral', icon: <MehIcon size={20} className="text-yellow-500" /> },
    { id: 'happy', label: 'Happy', icon: <SmileIcon size={20} className="text-green-500" /> }
  ];

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Hammer className="h-5 w-5 mr-2 text-nira-500" />
            Punching Bag
          </span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Punches: {punchCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name Your Punching Bag
            </label>
            <Input
              value={bagName}
              onChange={(e) => setBagName(e.target.value)}
              placeholder="Name your punching bag..."
              className="w-full"
            />
          </div>
          
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Face
            </label>
            <div className="flex space-x-2 justify-center">
              {faces.map(face => (
                <Button
                  key={face.id}
                  variant={selectedFace === face.id ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedFace(face.id)}
                >
                  {face.icon}
                  <span className="ml-2 text-xs">{face.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="relative w-full h-72 flex items-center justify-center mb-6">
            {/* Punch power meter */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                style={{ width: `${power}%` }}
              ></div>
            </div>
            
            {/* Rope */}
            <div 
              ref={ropeRef}
              className="absolute top-0 left-1/2 w-4 h-32 bg-gradient-to-b from-amber-800 to-amber-600 rounded-full transform -translate-x-1/2 origin-top transition-transform duration-300"
              style={{ transformOrigin: 'top center' }}
            ></div>
            
            {/* Punching bag */}
            <div 
              ref={bagRef}
              onClick={punchBag}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-b from-red-600 to-red-800 rounded-b-full rounded-t-3xl cursor-pointer flex items-center justify-center flex-col transition-transform duration-300 shadow-xl select-none hover:shadow-glow"
              style={{ transformOrigin: 'top center' }}
            >
              {getFaceIcon()}
              <div className="mt-2 font-bold text-white text-center">
                {bagName}
              </div>
              <div className="absolute -bottom-4 w-20 h-4 bg-red-900 rounded-full"></div>
            </div>
            
            {/* Man punching - improved stick figure */}
            <div className="absolute bottom-2 right-8 w-20 h-48 flex items-end">
              <div className="relative w-full h-40">
                {/* Head */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gray-800"></div>
                
                {/* Body */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-20 bg-gray-800"></div>
                
                {/* Arms */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                  {/* Static arm */}
                  <div className="absolute top-0 left-0 w-12 h-2 bg-gray-800 transform rotate-135"></div>
                  
                  {/* Punching arm */}
                  <div 
                    ref={punchingArmRef}
                    className="absolute top-0 left-0 w-24 h-2 bg-gray-800 transform origin-left transition-transform duration-150"
                  >
                    {/* Fist */}
                    <div className="absolute right-0 top-0 w-6 h-6 rounded-full bg-gray-800 transform -translate-y-2"></div>
                  </div>
                </div>
                
                {/* Legs */}
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800" style={{ transform: 'rotate(20deg)' }}></div>
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800" style={{ transform: 'rotate(-20deg)' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center">
            <p className="text-sm">Click or tap on the punching bag to release stress and frustration</p>
          </div>
          
          <Button
            onClick={resetGame}
            className="bg-nira-500 hover:bg-nira-600"
          >
            Reset Count
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PunchingBagGame;
