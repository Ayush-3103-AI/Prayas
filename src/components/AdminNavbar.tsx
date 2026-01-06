import { Leaf, LayoutDashboard, Package, Heart, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface AdminNavbarProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
}

export function AdminNavbar({ onNavigate, onLogout, activePage }: AdminNavbarProps) {
  const navItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-pickups', label: 'Pickup Management', icon: Package },
    { id: 'admin-ngos', label: 'NGO Management', icon: Heart },
  ];

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-[#d4c5b0] bg-[#f5f5dc] z-50">
      <div className="flex items-center gap-3 p-6 border-b border-[#d4c5b0]">
        <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-[#faf0e6]" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <span className="text-xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
          <div className="flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3 text-[#8b6f47]" strokeWidth={2.5} />
            <span className="text-xs text-[#8b6f47] font-medium uppercase tracking-wider">Admin</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all",
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
  );
}
