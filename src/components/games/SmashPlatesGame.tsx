
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer } from 'lucide-react';

const PLATE_COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 
  'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
];

interface PlateType {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  isSmashed: boolean;
}

const SmashPlatesGame = () => {
  const [plates, setPlates] = useState<PlateType[]>([]);
  const [plateCount, setPlateCount] = useState(0);
  const [draggedPlate, setDraggedPlate] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [moveSpeed, setMoveSpeed] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  
  // Initialize game
  useEffect(() => {
    if (isGameActive && plates.length === 0) {
      generatePlates();
    }
  }, [isGameActive, plates.length]);
  
  const generatePlates = () => {
    const newPlates: PlateType[] = [];
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const containerHeight = containerRef.current?.offsetHeight || 300;
    
    for (let i = 0; i < 6; i++) {
      newPlates.push({
        id: i,
        color: PLATE_COLORS[i % PLATE_COLORS.length],
        x: Math.random() * (containerWidth - 100) + 50,
        y: Math.random() * (containerHeight - 150) + 50,
        rotation: Math.random() * 60 - 30,
        isSmashed: false
      });
    }
    
    setPlates(newPlates);
  };
  
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const plateElement = e.currentTarget as HTMLDivElement;
    const rect = plateElement.getBoundingClientRect();
    
    setDraggedPlate(id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = Date.now();
    setIsDragging(true);
    setMoveSpeed(0);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPlate === null || !containerRef.current || !isDragging) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragOffset.x;
    const y = e.clientY - containerRect.top - dragOffset.y;
    
    // Calculate speed
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    
    if (dt > 0) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const speed = Math.sqrt(dx*dx + dy*dy) / dt * 10;
      setMoveSpeed(speed);
    }
    
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = now;
    
    setPlates(prev => prev.map(plate => 
      plate.id === draggedPlate
        ? { ...plate, x, y }
        : plate
    ));
  };
  
  const handleMouseUp = () => {
    if (draggedPlate === null || !isDragging) return;
    
    // Check if plate was thrown (fast movement)
    if (moveSpeed > 0.5) {
      smashPlate(draggedPlate);
    }
    
    setDraggedPlate(null);
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    const touch = e.touches[0];
    const plateElement = e.currentTarget as HTMLDivElement;
    const rect = plateElement.getBoundingClientRect();
    
    setDraggedPlate(id);
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTimeRef.current = Date.now();
    setIsDragging(true);
    setMoveSpeed(0);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedPlate === null || !containerRef.current || !isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - containerRect.left - dragOffset.x;
    const y = touch.clientY - containerRect.top - dragOffset.y;
    
    // Calculate speed
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    
    if (dt > 0) {
      const dx = touch.clientX - lastPosRef.current.x;
      const dy = touch.clientY - lastPosRef.current.y;
      const speed = Math.sqrt(dx*dx + dy*dy) / dt * 10;
      setMoveSpeed(speed);
    }
    
    lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTimeRef.current = now;
    
    setPlates(prev => prev.map(plate => 
      plate.id === draggedPlate
        ? { ...plate, x, y }
        : plate
    ));
  };
  
  const handleTouchEnd = () => {
    if (draggedPlate === null || !isDragging) return;
    
    // Check if plate was thrown with speed
    if (moveSpeed > 0.5) {
      smashPlate(draggedPlate);
    }
    
    setDraggedPlate(null);
    setIsDragging(false);
  };
  
  const smashPlate = (id: number) => {
    setPlateCount(prev => prev + 1);
    
    // Mark the plate as smashed first (for animation)
    setPlates(prev => prev.map(plate => 
      plate.id === id
        ? { ...plate, isSmashed: true }
        : plate
    ));
    
    // After animation, remove the plate
    setTimeout(() => {
      setPlates(prev => prev.filter(plate => plate.id !== id));
      
      // Generate new plates if all are smashed
      if (plates.length <= 1) {
        setTimeout(() => {
          generatePlates();
        }, 500);
      }
    }, 500);
  };
  
  const resetGame = () => {
    setPlates([]);
    setPlateCount(0);
    generatePlates();
  };
  
  // Start the game automatically
  useEffect(() => {
    setIsGameActive(true);
    
    // Add CSS for smash animation to the document head if not already there
    if (!document.getElementById('smash-plate-style')) {
      const style = document.createElement('style');
      style.id = 'smash-plate-style';
      style.innerHTML = `
        @keyframes smashPlate {
          0% { opacity: 1; transform: scale(1); }
          20% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.1); }
        }
        .smash-animation {
          animation: smashPlate 0.5s forwards;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      const styleElement = document.getElementById('smash-plate-style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Hammer className="h-5 w-5 mr-2 text-red-500" />
            Smash Plates
          </span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Plates: {plateCount}
          </span>
        </CardTitle>
        <CardDescription>
          Drag and throw plates to break them and release stress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {!isGameActive ? (
            <div className="text-center mb-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Drag plates quickly and release to smash them. Great for relieving frustration!
              </p>
              <Button 
                onClick={() => setIsGameActive(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                Start Smashing
              </Button>
            </div>
          ) : (
            <>
              <div 
                ref={containerRef}
                className="w-full h-64 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Floor */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800"></div>
                
                {/* Plates */}
                {plates.map(plate => (
                  <div 
                    key={plate.id}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center cursor-grab ${plate.color} ${plate.isSmashed ? 'smash-animation' : ''}`}
                    style={{ 
                      left: `${plate.x}px`, 
                      top: `${plate.y}px`, 
                      transform: `rotate(${plate.rotation}deg)`,
                      touchAction: 'none',
                      zIndex: draggedPlate === plate.id ? 20 : 10
                    }}
                    onMouseDown={(e) => handleMouseDown(e, plate.id)}
                    onTouchStart={(e) => handleTouchStart(e, plate.id)}
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-300 border-opacity-80"></div>
                  </div>
                ))}
                
                {plates.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
                      All plates smashed! Generating more...
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-center mb-4">
                <p className="text-sm">
                  Drag plates quickly and release to break them. The faster you throw, the more satisfying the smash!
                </p>
              </div>
              
              <Button
                onClick={resetGame}
                className="bg-red-500 hover:bg-red-600"
              >
                Reset Game
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmashPlatesGame;
