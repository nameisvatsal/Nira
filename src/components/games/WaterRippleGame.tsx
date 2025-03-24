
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets } from 'lucide-react';

const WaterRippleGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rippleColor, setRippleColor] = useState('#00BFFF'); // Default blue ripple
  const [interactionCount, setInteractionCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const ripplesRef = useRef<Array<{x: number, y: number, radius: number, opacity: number, color: string}>>([]);
  
  // Initialize the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initial draw of water surface
    drawWaterSurface(ctx, canvas.width, canvas.height);
    
    // Animation loop
    let animationId: number;
    
    const render = () => {
      if (!canvas || !ctx) return;
      
      // Redraw water surface
      drawWaterSurface(ctx, canvas.width, canvas.height);
      
      // Update and draw ripples
      const ripples = ripplesRef.current;
      let hasActiveRipples = false;
      
      for (let i = 0; i < ripples.length; i++) {
        const ripple = ripples[i];
        
        // Expand ripple
        ripple.radius += 2;
        // Fade ripple
        ripple.opacity -= 0.02;
        
        if (ripple.opacity > 0) {
          hasActiveRipples = true;
          
          // Draw ripple
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${ripple.color}${Math.floor(ripple.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Add a second, slightly smaller ripple for effect
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = `${ripple.color}${Math.floor(ripple.opacity * 200).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Filter out faded ripples
      ripplesRef.current = ripples.filter(ripple => ripple.opacity > 0);
      
      // Continue animation if there are active ripples
      if (hasActiveRipples) {
        setIsAnimating(true);
        animationId = requestAnimationFrame(render);
      } else {
        setIsAnimating(false);
      }
    };
    
    if (isAnimating) {
      animationId = requestAnimationFrame(render);
    }
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isAnimating, rippleColor]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawWaterSurface(ctx, canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const drawWaterSurface = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create gradient for water background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#84c5f7');
    gradient.addColorStop(1, '#1e88e5');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw some random waves for texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const y = Math.random() * height;
      ctx.moveTo(0, y);
      
      for (let x = 0; x < width; x += 20) {
        ctx.lineTo(x, y + Math.sin(x / 30) * 3);
      }
      
      ctx.stroke();
    }
  };
  
  const createRipple = (x: number, y: number) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 10,
      opacity: 1,
      color: rippleColor
    });
    
    setInteractionCount(prev => prev + 1);
    setIsAnimating(true);
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    createRipple(x, y);
  };
  
  const resetCanvas = () => {
    ripplesRef.current = [];
    setInteractionCount(0);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawWaterSurface(ctx, canvas.width, canvas.height);
    }
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRippleColor(e.target.value);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-nira-500" />
            Water Ripple Effect
          </span>
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Ripples: {interactionCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ripple Color
            </label>
            <input
              type="color"
              value={rippleColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg mb-6 cursor-pointer"
            onClick={handleCanvasClick}
            onTouchStart={handleTouchStart}
          ></canvas>
          
          <div className="mb-4 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center">
            <p className="text-sm">Click or tap on the water to create peaceful ripple effects</p>
          </div>
          
          <Button
            onClick={resetCanvas}
            className="bg-nira-500 hover:bg-nira-600"
          >
            Clear Ripples
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterRippleGame;
