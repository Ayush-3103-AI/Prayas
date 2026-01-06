import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { UserDashboard } from './components/UserDashboard';
import { BookPickupPage } from './components/BookPickupPage';
import { PickupStatusPage } from './components/PickupStatusPage';
import { ImpactPage } from './components/ImpactPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPickupManagement } from './components/AdminPickupManagement';
import { AdminNGOManagement } from './components/AdminNGOManagement';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { GarbagePileBackground } from './components/background/GarbagePileBackground';

export type UserRole = 'user' | 'agent' | 'admin' | null;
export type PageView = 'landing' | 'about' | 'contact' | 'login' | 'signup' | 'dashboard' | 'book-pickup' | 'pickup-status' | 'impact' | 'leaderboard' | 'profile' | 'agent-dashboard' | 'admin-dashboard' | 'admin-pickups' | 'admin-ngos';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole, name: string, id: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Navigate to appropriate dashboard
    if (role === 'user') setCurrentPage('dashboard');
    if (role === 'agent') setCurrentPage('agent-dashboard');
    if (role === 'admin') setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('landing');
  };

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} onLogin={() => setCurrentPage('login')} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} login={handleLogin} />;
      case 'signup':
        return <SignupPage navigate={navigate} login={handleLogin} />;
      case 'dashboard':
        return <UserDashboard onNavigate={navigate} onLogout={handleLogout} />;
      case 'book-pickup':
        return <BookPickupPage onNavigate={navigate} onLogout={handleLogout} />;
      case 'pickup-status':
        return <PickupStatusPage onNavigate={navigate} onLogout={handleLogout} />;
      case 'impact':
        return <ImpactPage onNavigate={navigate} onLogout={handleLogout} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={navigate} onLogout={handleLogout} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} onLogout={handleLogout} />;
      case 'agent-dashboard':
        return <AgentDashboard onNavigate={navigate} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigate} onLogout={handleLogout} />;
      case 'admin-pickups':
        return <AdminPickupManagement onNavigate={navigate} onLogout={handleLogout} />;
      case 'admin-ngos':
        return <AdminNGOManagement onNavigate={navigate} onLogout={handleLogout} />;
      default:
        return <LandingPage onNavigate={navigate} onLogin={() => setCurrentPage('login')} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <GarbagePileBackground />
      <div className="relative z-10">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
