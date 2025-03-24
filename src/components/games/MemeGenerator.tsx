
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample meme templates
const memeTemplates = [
  {
    id: 'drake',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    name: 'Drake Hotline Bling',
    textPositions: [
      { x: 350, y: 130, width: 300, align: 'center' },
      { x: 350, y: 380, width: 300, align: 'center' }
    ]
  },
  {
    id: 'distracted',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    name: 'Distracted Boyfriend',
    textPositions: [
      { x: 160, y: 140, width: 140, align: 'center' },
      { x: 380, y: 140, width: 140, align: 'center' },
      { x: 270, y: 320, width: 140, align: 'center' }
    ]
  },
  {
    id: 'button',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    name: 'Two Buttons',
    textPositions: [
      { x: 145, y: 130, width: 120, align: 'center' },
      { x: 295, y: 130, width: 120, align: 'center' },
      { x: 230, y: 320, width: 150, align: 'center' }
    ]
  },
  {
    id: 'change',
    url: 'https://i.imgflip.com/24y43o.jpg',
    name: 'Change My Mind',
    textPositions: [
      { x: 240, y: 150, width: 260, align: 'center' }
    ]
  },
  {
    id: 'doge',
    url: 'https://i.imgflip.com/4t0m5.jpg',
    name: 'Doge',
    textPositions: [
      { x: 240, y: 100, width: 260, align: 'center' },
      { x: 240, y: 400, width: 260, align: 'center' }
    ]
  }
];

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(memeTemplates[0]);
  const [texts, setTexts] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Initialize texts array when template changes
  useEffect(() => {
    setTexts(Array(selectedTemplate.textPositions.length).fill(''));
    setEditMode(true);
  }, [selectedTemplate]);
  
  const handleTemplateChange = () => {
    // Pick a random template different from the current one
    const availableTemplates = memeTemplates.filter(t => t.id !== selectedTemplate.id);
    const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    setSelectedTemplate(randomTemplate);
  };
  
  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };
  
  const generateMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Load the template image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      
      selectedTemplate.textPositions.forEach((pos, index) => {
        if (!texts[index]) return;
        
        ctx.font = 'bold 36px Impact, sans-serif';
        ctx.textAlign = pos.align as CanvasTextAlign;
        
        // Process text to fit within width
        const words = texts[index].split(' ');
        let lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          
          if (width < pos.width) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        
        // Draw each line of text
        lines.forEach((line, lineIndex) => {
          const y = pos.y + (lineIndex * 40);
          ctx.strokeText(line, pos.x, y);
          ctx.fillText(line, pos.x, y);
        });
      });
      
      // Set the preview URL
      setPreviewUrl(canvas.toDataURL('image/png'));
      setEditMode(false);
      
      toast({
        title: "Meme Created!",
        description: "Your meme has been generated successfully.",
      });
    };
    
    img.onerror = () => {
      toast({
        title: "Image Error",
        description: "Failed to load the template image. Please try another template.",
        variant: "destructive"
      });
    };
    
    img.src = selectedTemplate.url;
  };
  
  const downloadMeme = () => {
    if (previewUrl) {
      try {
        const link = document.createElement('a');
        link.download = `nira-meme-${Date.now()}.png`;
        link.href = previewUrl;
        link.click();
        
        toast({
          title: "Meme Downloaded",
          description: "Your meme has been saved to your device.",
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "There was an error downloading your meme.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Meme Generator</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTemplateChange}
            className="flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            New Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {editMode ? (
            <>
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={selectedTemplate.url} 
                  alt={selectedTemplate.name}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '300px' }}
                  onError={() => {
                    toast({
                      title: "Image Error",
                      description: "Failed to load the template image. Please try another template.",
                      variant: "destructive"
                    });
                    handleTemplateChange();
                  }}
                />
              </div>
              
              <div className="w-full mb-6 space-y-3">
                <h3 className="text-lg font-medium mb-2">{selectedTemplate.name}</h3>
                
                {Array(selectedTemplate.textPositions.length).fill(null).map((_, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Text {index + 1}
                    </label>
                    <Input
                      value={texts[index] || ''}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      placeholder={`Enter text ${index + 1}...`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              
              <Button
                onClick={generateMeme}
                className="bg-nira-500 hover:bg-nira-600 w-full flex items-center justify-center"
              >
                Generate Meme
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </>
          ) : (
            <>
              <div className="mb-6 rounded-lg overflow-hidden max-w-full">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Generated meme" 
                    className="max-w-full h-auto"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <canvas 
                    ref={canvasRef} 
                    className="max-w-full h-auto hidden"
                  ></canvas>
                )}
              </div>
              
              <div className="flex space-x-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(true)}
                  className="flex-1"
                >
                  Edit Again
                </Button>
                
                <Button
                  onClick={downloadMeme}
                  className="bg-nira-500 hover:bg-nira-600 flex-1 flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  Download Meme
                </Button>
              </div>
            </>
          )}
          
          <div className="mt-6 p-4 bg-nira-100 dark:bg-nira-900/20 text-nira-700 dark:text-nira-300 rounded-lg text-center w-full">
            <p className="text-sm">Creating and sharing humor can be a great way to relieve stress!</p>
          </div>
          
          {/* Hidden canvas for generating the meme */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MemeGenerator;
