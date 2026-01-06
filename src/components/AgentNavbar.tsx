import { Leaf, Truck, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface AgentNavbarProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AgentNavbar({ onNavigate, onLogout }: AgentNavbarProps) {
  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-[#d4c5b0] bg-[#f5f5dc] z-50">
      <div className="flex items-center gap-3 p-6 border-b border-[#d4c5b0]">
        <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-[#faf0e6]" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <span className="text-xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
          <div className="flex items-center gap-1 mt-1">
            <Truck className="w-3 h-3 text-[#8b6f47]" strokeWidth={2.5} />
            <span className="text-xs text-[#8b6f47] font-medium uppercase tracking-wider">Agent</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Agent-specific navigation can be added here */}
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
