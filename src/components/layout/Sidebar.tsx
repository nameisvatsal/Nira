
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Activity,
  BookOpen,
  Leaf,
  Moon,
  Sun,
  GamepadIcon,
  Calendar,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';

const NiraSidebar = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      title: "AI Chat",
      path: "/chat",
      icon: MessageSquare,
      description: "Talk to Nira for emotional support"
    },
    {
      title: "Meditation",
      path: "/meditate",
      icon: Leaf,
      description: "Guided sessions for relaxation"
    },
    {
      title: "Journal",
      path: "/journal",
      icon: BookOpen,
      description: "Record your thoughts and feelings"
    },
    {
      title: "Mood Tracker",
      path: "/mood-tracker",
      icon: Activity,
      description: "Monitor your emotional patterns"
    },
    {
      title: "Period Tracker",
      path: "/period-tracker",
      icon: Calendar,
      description: "Track your menstrual cycle"
    },
    {
      title: "Wellness Games",
      path: "/wellness-games",
      icon: GamepadIcon,
      description: "Fun activities to boost your mood"
    },
    {
      title: "Fitness & Lifestyle",
      path: "/fitness-lifestyle",
      icon: Dumbbell,
      description: "Mental health guidance and tips"
    },
    {
      title: "Safety Resources",
      path: "/safety",
      icon: ShieldAlert,
      description: "Crisis support and help"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-nira-500 to-nira-300 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-display font-semibold text-2xl transition-all duration-300">Nira</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {features.map((feature) => (
                <SidebarMenuItem key={feature.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(feature.path)}
                    tooltip={feature.description}
                    className="text-base py-3"
                  >
                    <Link to={feature.path}>
                      <feature.icon size={22} />
                      <span className="text-base">{feature.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-sidebar-accent transition-colors text-base"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <Sun size={22} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={22} />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default NiraSidebar;
