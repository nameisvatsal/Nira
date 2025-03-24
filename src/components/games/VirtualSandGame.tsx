
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VirtualSandGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [sandColor, setSandColor] = useState('#F6D7B0'); // Light sand color
  const [interactions, setInteractions] = useState(0);
  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number, color: string}>>([]);
  
  // Initialize the canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear particles
    particlesRef.current = [];
    
    // Animation loop
    let animationId: number;
    
    const render = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Apply gravity and friction
        p.vy += 0.1; // Gravity
        p.vx *= 0.99; // Horizontal friction
        p.vy *= 0.99; // Vertical friction
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -0.5;
          p.x = Math.max(0, Math.min(p.x, canvas.width));
        }
        
        // Bounce off floor
        if (p.y > canvas.height) {
          p.vy *= -0.5;
          p.y = canvas.height;
          
          // Random chance to come to rest
          if (Math.random() < 0.1 && Math.abs(p.vy) < 1) {
            p.vy = 0;
          }
        }
        
        // Draw the particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const createParticles = (x: number, y: number) => {
    // Create 10 particles at the mouse position
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: sandColor
      });
    }
    
    setInteractions(prev => prev + 1);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createParticles(x, y);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    createParticles(x, y);
  };
  
  const resetGame = () => {
    particlesRef.current = [];
    setInteractions(0);
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSandColor(e.target.value);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Virtual Sand</span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Interactions: {interactions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sand Color
            </label>
            <input
              type="color"
              value={sandColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6"
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsMouseDown(true)}
            onTouchEnd={() => setIsMouseDown(false)}
            onTouchMove={handleTouchMove}
          ></canvas>
          
          <div className="mb-4 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center">
            <p className="text-sm">Click and drag or touch and move to create flowing sand patterns</p>
          </div>
          
          <Button
            onClick={resetGame}
            className="bg-nira-500 hover:bg-nira-600"
          >
            Clear Sand
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualSandGame;
