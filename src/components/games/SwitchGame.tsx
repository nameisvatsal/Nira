
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const SwitchGame = () => {
  const [switches, setSwitches] = useState([false, false, false]);
  const [clicks, setClicks] = useState(0);
  const [goal, setGoal] = useState(20);

  const handleToggle = (index: number) => {
    const newSwitches = [...switches];
    newSwitches[index] = !newSwitches[index];
    setSwitches(newSwitches);
    setClicks(prev => prev + 1);
  };

  const resetGame = () => {
    setSwitches([false, false, false]);
    setClicks(0);
    setGoal(Math.floor(Math.random() * 10) + 15); // Random goal between 15-25
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Switch On-Off Game</span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Clicks: {clicks}/{goal}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full flex flex-col space-y-10">
            {switches.map((isOn, index) => (
              <div key={index} className="flex items-center justify-between w-full">
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                  Switch {index + 1}
                </span>
                <div className="scale-150 transform">
                  <Switch
                    checked={isOn}
                    onCheckedChange={() => handleToggle(index)}
                    className="data-[state=checked]:bg-nira-500"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {clicks >= goal && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-center">
              <p className="font-medium">Goal reached! How satisfying was that?</p>
              <p className="text-sm">Feel free to continue or start a new challenge.</p>
            </div>
          )}
          
          <Button
            onClick={resetGame}
            className="bg-nira-500 hover:bg-nira-600"
          >
            New Challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwitchGame;
