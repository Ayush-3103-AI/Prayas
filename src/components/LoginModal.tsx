import { useState } from 'react';
import { X, User, Shield, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserRole } from '../App';

interface LoginModalProps {
  onLogin: (role: UserRole) => void;
  onClose: () => void;
}

export function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<'user' | 'agent' | 'admin'>('user');

  const roles = [
    { id: 'user' as const, label: 'User', icon: User, description: 'Book pickups & track impact' },
    { id: 'agent' as const, label: 'Agent', icon: Truck, description: 'Collect recyclables' },
    { id: 'admin' as const, label: 'Admin', icon: Shield, description: 'Manage operations' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl text-gray-900 mb-2">Welcome to Prayas</h2>
        <p className="text-gray-600 mb-6">Select your role to continue</p>
        
        <div className="space-y-3 mb-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                selectedRole === role.id
                  ? 'border-[#3BAF69] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedRole === role.id ? 'bg-[#3BAF69]' : 'bg-gray-100'
              }`}>
                <role.icon className={`w-6 h-6 ${
                  selectedRole === role.id ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="text-gray-900">{role.label}</div>
                <div className="text-sm text-gray-500">{role.description}</div>
              </div>
            </button>
          ))}
        </div>
        
        <Button
          onClick={() => onLogin(selectedRole)}
          className="w-full bg-[#3BAF69] hover:bg-[#2d9355]"
        >
          Continue as {roles.find(r => r.id === selectedRole)?.label}
        </Button>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Demo mode - Click to explore the platform
        </p>
      </Card>
    </div>
  );
}
