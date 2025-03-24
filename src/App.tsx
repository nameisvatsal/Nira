
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Index from '@/pages/Index';
import Journal from '@/pages/Journal';
import MoodTracker from '@/pages/MoodTracker';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Meditate from '@/pages/Meditate';
import Chat from '@/pages/Chat';
import Notifications from '@/pages/Notifications';
import Safety from '@/pages/Safety';
import WellnessGames from '@/pages/WellnessGames';
import PeriodTracker from '@/pages/PeriodTracker';
import FitnessLifestyle from '@/pages/FitnessLifestyle';
import NiraSidebar from '@/components/layout/Sidebar';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Gender-based route component (for hiding period tracker for male users)
const GenderProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { profile, loading: profileLoading } = useProfile();

  if (loading || profileLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (profile?.gender === 'male') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Footer component that is only rendered on the home page
const ConditionalFooter = () => {
  const location = useLocation();
  const showFooter = location.pathname === '/';
  
  if (!showFooter) return null;
  return <Footer />;
};

// Mobile menu drawer
const MobileMenuDrawer = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  if (!isMobile || location.pathname === '/auth') return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-2">
      <div className="flex justify-around items-center">
        <a href="/" className="text-center p-2">
          <span className="block h-6 w-6 mx-auto mb-1">🏠</span>
          <span className="text-xs">Home</span>
        </a>
        <a href="/journal" className="text-center p-2">
          <span className="block h-6 w-6 mx-auto mb-1">📓</span>
          <span className="text-xs">Journal</span>
        </a>
        <a href="/mood-tracker" className="text-center p-2">
          <span className="block h-6 w-6 mx-auto mb-1">😊</span>
          <span className="text-xs">Mood</span>
        </a>
        <a href="/meditate" className="text-center p-2">
          <span className="block h-6 w-6 mx-auto mb-1">🧘</span>
          <span className="text-xs">Meditate</span>
        </a>
        <a href="/profile" className="text-center p-2">
          <span className="block h-6 w-6 mx-auto mb-1">👤</span>
          <span className="text-xs">Profile</span>
        </a>
      </div>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Add ambient background elements
    const app = document.getElementById('root');
    if (app) {
      const orb1 = document.createElement('div');
      orb1.className = 'ambient-orb orb-1';
      const orb2 = document.createElement('div');
      orb2.className = 'ambient-orb orb-2';
      const orb3 = document.createElement('div');
      orb3.className = 'ambient-orb orb-3';
      
      app.appendChild(orb1);
      app.appendChild(orb2);
      app.appendChild(orb3);
    }

    return () => {
      const orbs = document.querySelectorAll('.ambient-orb');
      orbs.forEach(orb => orb.remove());
    };
  }, []);

  // Add padding at the bottom for mobile menu
  const contentStyle = isMobile ? { paddingBottom: '60px' } : {};

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        {/* Always show sidebar except on Auth page */}
        {location.pathname !== '/auth' && !isMobile && (
          <aside className="w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <NiraSidebar />
          </aside>
        )}
        <main 
          className={`flex-1 overflow-y-auto ${location.pathname === '/auth' ? 'w-full' : ''}`}
          style={contentStyle}
        >
          {location.pathname !== '/auth' && <Header />}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/journal" element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/mood-tracker" element={
              <ProtectedRoute>
                <MoodTracker />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/meditate" element={<Meditate />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/safety" element={<Safety />} />
            <Route path="/wellness-games" element={<WellnessGames />} />
            <Route path="/period-tracker" element={
              <GenderProtectedRoute>
                <PeriodTracker />
              </GenderProtectedRoute>
            } />
            <Route path="/fitness-lifestyle" element={<FitnessLifestyle />} />
            <Route path="/fitness-lifestyle/:issueId" element={<FitnessLifestyle />} />
            <Route path="/fitness-lifestyle/:issueId/:categoryId" element={<FitnessLifestyle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConditionalFooter />
          <MobileMenuDrawer />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
