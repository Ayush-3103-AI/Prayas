import { Leaf, Home, Plus, Package, TrendingUp, Trophy, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

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
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-[#d4c5b0] bg-[#f5f5dc] z-50">
        <div className="flex items-center gap-3 p-6 border-b border-[#d4c5b0]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#faf0e6]" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-[#6b8e6b]/20 text-[#6b8e6b]"
                    : "text-[#6b5d4f] hover:bg-[#faf0e6] hover:text-[#3d2817]"
                )}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#6b8e6b] rounded-l-full" />
                )}
                <item.icon 
                  className="w-5 h-5" 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-sm font-medium tracking-wide uppercase">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-[#d4c5b0]">
          <Button 
            onClick={onLogout} 
            variant="ghost" 
            className="w-full justify-start text-[#6b5d4f] hover:text-[#3d2817] hover:bg-[#faf0e6]"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium tracking-wide uppercase">Logout</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#d4c5b0] bg-[#f5f5dc] z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-[#6b8e6b]/20 text-[#6b8e6b]"
                    : "text-[#6b5d4f]"
                )}
              >
                <item.icon 
                  className="w-5 h-5" 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
