
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MeditationPlayerProps {
  title: string;
  duration: number; // in seconds
  coverImage?: string;
  audioSrc?: string;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({
  title,
  duration,
  coverImage,
  audioSrc
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      audioRef.current.play();
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  return (
    <div className="glass-card p-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-32 h-32 shrink-0 overflow-hidden rounded-lg relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-nira-600/80 to-nira-300/80 z-10 text-white">
            <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ${isPlaying ? 'animate-pulse-subtle' : ''}`}>
              {isPlaying ? (
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-transparent border-t-[8px] border-b-transparent border-b-[8px] border-r-transparent border-l-white border-l-[12px] ml-1"></div>
              )}
            </div>
          </div>
          <img 
            src={coverImage || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2070&q=80"} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatTime(currentTime)}
            </span>
            
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={seekTo}
              className="w-full max-w-[70%] mx-2 h-1 accent-nira-500"
            />
            
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
            >
              <SkipBack size={16} />
            </button>
            
            <button
              className="p-2 rounded-full bg-nira-500 text-white hover:bg-nira-600 transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
            >
              <SkipForward size={16} />
            </button>
          </div>
          
          <div className="mt-2 flex items-center">
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              className="w-full max-w-[80px] ml-2 h-1 accent-nira-500"
            />
          </div>
        </div>
      </div>
      
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}
    </div>
  );
};

export default MeditationPlayer;
