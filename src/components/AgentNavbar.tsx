import { Leaf, Truck, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface AgentNavbarProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AgentNavbar({ onNavigate, onLogout }: AgentNavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-[#3BAF69]">Prayas</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Agent
            </span>
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
