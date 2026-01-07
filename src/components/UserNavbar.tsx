import { Leaf, Home, Plus, Package, TrendingUp, Trophy, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface UserNavbarProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
}

export function UserNavbar({ onNavigate, onLogout, activePage }: UserNavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'book-pickup', label: 'Book Pickup', icon: Plus },
    { id: 'pickup-status', label: 'Status', icon: Package },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl text-[#3BAF69]">Prayas</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-green-50 text-[#3BAF69]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            <Button onClick={onLogout} variant="ghost" className="hidden md:flex">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                activePage === item.id
                  ? 'bg-green-50 text-[#3BAF69]'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
