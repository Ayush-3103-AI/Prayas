import { Leaf, LayoutDashboard, Package, Heart, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-[#3BAF69]">Prayas</span>
            <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Admin
            </span>
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
          
          <Button onClick={onLogout} variant="ghost">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
