
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BubbleWrapGame = () => {
  const [bubbles, setBubbles] = useState<boolean[][]>([]);
  const [popped, setPopped] = useState(0);
  const rows = 8;
  const cols = 8;

  useEffect(() => {
    // Initialize the bubble wrap
    const initialBubbles = Array(rows).fill(null).map(() => 
      Array(cols).fill(false)
    );
    setBubbles(initialBubbles);
  }, []);

  const popBubble = (row: number, col: number) => {
    if (bubbles[row][col]) return; // Already popped

    const newBubbles = [...bubbles];
    newBubbles[row][col] = true;
    setBubbles(newBubbles);
    setPopped(prev => prev + 1);

    // Play pop sound
    const audio = new Audio('/pop.mp3');
    audio.volume = 0.3;
    try {
      audio.play().catch(e => console.log('Audio play error:', e));
    } catch (error) {
      console.log('Audio error:', error);
    }
  };

  const resetBubbles = () => {
    const initialBubbles = Array(rows).fill(null).map(() => 
      Array(cols).fill(false)
    );
    setBubbles(initialBubbles);
    setPopped(0);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Bubble Wrap Pop</span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Popped: {popped}/{rows * cols}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div 
            className="grid grid-cols-8 gap-2 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            style={{ touchAction: 'manipulation' }}
          >
            {bubbles.map((row, rowIndex) => (
              row.map((isPopped, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 rounded-full transition-all ${
                    isPopped 
                      ? 'bg-gray-200 dark:bg-gray-700 scale-90' 
                      : 'bg-nira-100 dark:bg-nira-900/30 hover:bg-nira-200 dark:hover:bg-nira-800/30 shadow-md'
                  }`}
                  onClick={() => popBubble(rowIndex, colIndex)}
                  disabled={isPopped}
                ></button>
              ))
            ))}
          </div>
          
          <Button
            onClick={resetBubbles}
            className="bg-nira-500 hover:bg-nira-600"
          >
            New Bubble Wrap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BubbleWrapGame;
