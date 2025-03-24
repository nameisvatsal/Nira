
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LightDimmerGame = () => {
  const [brightness, setBrightness] = useState(50);
  const [color, setColor] = useState('#FFD700'); // Golden yellow
  const [adjustments, setAdjustments] = useState(0);

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(parseInt(e.target.value));
    setAdjustments(prev => prev + 1);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setAdjustments(prev => prev + 1);
  };

  const resetGame = () => {
    setBrightness(50);
    setColor('#FFD700');
    setAdjustments(0);
  };

  // Calculate opacity based on brightness
  const opacity = brightness / 100;
  // Calculate a background glow color
  const backgroundStyle = {
    boxShadow: `0 0 ${brightness}px ${brightness / 2}px ${color}`,
    backgroundColor: color,
    opacity: opacity
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Light Dimmer</span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Adjustments: {adjustments}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-6 p-6 bg-gray-800 rounded-lg w-full flex flex-col items-center">
            <div 
              className="w-32 h-32 rounded-full mb-6 transition-all"
              style={backgroundStyle}
            ></div>

            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Brightness: {brightness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={handleBrightnessChange}
                className="w-full accent-nira-500"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
          
          {adjustments > 10 && (
            <div className="mb-6 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center">
              <p className="font-medium">Finding your perfect light?</p>
              <p className="text-sm">Adjusting lights can be calming and meditative.</p>
            </div>
          )}
          
          <Button
            onClick={resetGame}
            className="bg-nira-500 hover:bg-nira-600"
          >
            Reset Light
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LightDimmerGame;
