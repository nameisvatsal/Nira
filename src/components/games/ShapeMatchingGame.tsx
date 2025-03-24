
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Shape definitions
const shapes = [
  { id: 'circle', path: 'M50,25 a25,25 0 1,1 0,50 a25,25 0 1,1 0,-50', color: '#FF6B6B' },
  { id: 'square', path: 'M25,25 h50 v50 h-50 z', color: '#4ECDC4' },
  { id: 'triangle', path: 'M50,25 L75,75 L25,75 z', color: '#FFD166' },
  { id: 'star', path: 'M50,25 L57,43 L75,43 L60,55 L65,75 L50,62 L35,75 L40,55 L25,43 L43,43 L50,25', color: '#6A0572' },
  { id: 'heart', path: 'M50,35 C50,35 65,25 75,35 C85,45 75,60 50,75 C25,60 15,45 25,35 C35,25 50,35 50,35', color: '#F06292' }
];

const ShapeMatchingGame = () => {
  const [slots, setSlots] = useState<Array<{id: string, filled: boolean}>>([]);
  const [draggableShapes, setDraggableShapes] = useState<Array<{id: string, x: number, y: number}>>([]);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  
  // Initialize the game
  useEffect(() => {
    setupGame(gameLevel);
  }, [gameLevel]);
  
  const setupGame = (level: number) => {
    // Determine number of shapes based on level
    const numShapes = Math.min(shapes.length, level + 2);
    
    // Create slots for the shapes
    const newSlots = Array(numShapes).fill(null).map((_, i) => ({
      id: shapes[i].id,
      filled: false
    }));
    
    // Create draggable shapes (randomized order)
    const shuffledShapes = [...Array(numShapes).keys()]
      .map(i => shapes[i])
      .sort(() => Math.random() - 0.5);
    
    const newDraggableShapes = shuffledShapes.map((shape, i) => ({
      id: shape.id,
      x: 20 + (i * 30),
      y: 30
    }));
    
    setSlots(newSlots);
    setDraggableShapes(newDraggableShapes);
    setScore(0);
  };
  
  const handleDragStart = (shapeId: string, e: React.MouseEvent | React.TouchEvent) => {
    setDraggedShape(shapeId);
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Find the shape being dragged
    const shape = draggableShapes.find(s => s.id === shapeId);
    if (!shape) return;
    
    // Calculate offset from the cursor to the shape's origin
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    
    // Prevent default behavior for touch events
    if ('touches' in e) {
      e.preventDefault();
    }
  };
  
  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedShape) return;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const container = document.getElementById('shape-game-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    // Update the position of the dragged shape
    setDraggableShapes(shapes => shapes.map(shape => {
      if (shape.id === draggedShape) {
        return {
          ...shape,
          x: clientX - containerRect.left - dragOffset.x,
          y: clientY - containerRect.top - dragOffset.y
        };
      }
      return shape;
    }));
  };
  
  const handleDragEnd = () => {
    if (!draggedShape) return;
    
    // Find the shape and all slots
    const shape = draggableShapes.find(s => s.id === draggedShape);
    if (!shape) return;
    
    const slotsElements = document.querySelectorAll('.shape-slot');
    let matched = false;
    
    // Check if the shape is over any slot
    slotsElements.forEach((slotEl) => {
      const slot = slots.find(s => s.id === slotEl.id);
      if (!slot || slot.filled) return;
      
      const slotRect = slotEl.getBoundingClientRect();
      const container = document.getElementById('shape-game-container');
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate slot position relative to the container
      const slotX = slotRect.left - containerRect.left + slotRect.width / 2;
      const slotY = slotRect.top - containerRect.top + slotRect.height / 2;
      
      // Check if shape is close to the slot center
      const distance = Math.sqrt(
        Math.pow(shape.x - slotX, 2) + 
        Math.pow(shape.y - slotY, 2)
      );
      
      if (distance < 30 && slot.id === shape.id) {
        // Match!
        setSlots(slots => slots.map(s => 
          s.id === slot.id ? { ...s, filled: true } : s
        ));
        
        // Remove the draggable shape
        setDraggableShapes(shapes => 
          shapes.filter(s => s.id !== shape.id)
        );
        
        setScore(prev => prev + 100);
        matched = true;
      }
    });
    
    // If not matched, return to a default position
    if (!matched) {
      setDraggableShapes(shapes => shapes.map(s => {
        if (s.id === shape.id) {
          return {
            ...s,
            x: 20 + (draggableShapes.findIndex(ds => ds.id === s.id) * 30),
            y: 30
          };
        }
        return s;
      }));
    }
    
    setDraggedShape(null);
    
    // Check if all slots are filled
    const allFilled = slots.every(slot => slot.filled);
    if (allFilled && slots.length > 0) {
      // Level complete!
      setTimeout(() => {
        const nextLevel = gameLevel + 1;
        if (nextLevel <= shapes.length) {
          setGameLevel(nextLevel);
        } else {
          // Game complete!
          alert('Congratulations! You completed all levels!');
          setGameLevel(1); // Restart from level 1
        }
      }, 1000);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Shape Matching</span>
          <div className="text-sm font-normal">
            <span className="text-gray-600 dark:text-gray-400 mr-3">
              Level: {gameLevel}
            </span>
            <span className="text-nira-600 dark:text-nira-400">
              Score: {score}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div 
            id="shape-game-container"
            className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 overflow-hidden"
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Slots */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around p-4">
              {slots.map((slot, index) => (
                <div 
                  key={index}
                  id={slot.id}
                  className={`shape-slot w-20 h-20 flex items-center justify-center border-2 border-dashed ${
                    slot.filled ? 'border-green-500' : 'border-gray-400'
                  }`}
                >
                  {slot.filled && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <path 
                        d={shapes.find(s => s.id === slot.id)?.path} 
                        fill={shapes.find(s => s.id === slot.id)?.color}
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            
            {/* Draggable Shapes */}
            {draggableShapes.map((shape, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${shape.x}px`,
                  top: `${shape.y}px`,
                  width: '60px',
                  height: '60px',
                  cursor: 'grab',
                  zIndex: draggedShape === shape.id ? 10 : 1,
                  opacity: draggedShape === shape.id ? 0.8 : 1
                }}
                onMouseDown={(e) => handleDragStart(shape.id, e)}
                onTouchStart={(e) => handleDragStart(shape.id, e)}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <path 
                    d={shapes.find(s => s.id === shape.id)?.path} 
                    fill={shapes.find(s => s.id === shape.id)?.color}
                  />
                </svg>
              </div>
            ))}
          </div>
          
          <div className="mb-4 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center">
            <p className="text-sm">Drag and drop the shapes into the matching slots</p>
          </div>
          
          <Button
            onClick={() => setupGame(gameLevel)}
            className="bg-nira-500 hover:bg-nira-600"
          >
            Reset Level
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapeMatchingGame;
