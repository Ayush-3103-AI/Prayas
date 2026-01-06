import { PageView, UserRole } from '../App';
import { Leaf, ArrowLeft, LogIn, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiClient } from '../utils/apiClient';
import { RecycledPaperCard } from './ui/RecycledPaperCard';

interface LoginPageProps {
  navigate: (page: PageView) => void;
  login: (role: UserRole, name: string, id: string) => void;
}

export default function LoginPage({ navigate, login }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('user');
  const [agentId, setAgentId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      let userData;

      if (role === 'user') {
        response = await apiClient.userLogin(email, password);
        console.log('Login response:', response);
        userData = response.user;
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('✅ Token stored successfully:', response.token.substring(0, 20) + '...');
          console.log('✅ Token verification:', localStorage.getItem('token') ? 'Token in localStorage' : 'Token NOT in localStorage');
        } else {
          console.error('❌ No token in login response');
        }
        const displayName = name.trim() || userData.name || 'User';
        localStorage.setItem('user', JSON.stringify({ id: userData.id, name: displayName, role: 'user' }));
        login('user', displayName, userData.id);
        navigate('dashboard');
      } else if (role === 'agent') {
        response = await apiClient.agentLogin(agentId, password);
        console.log('Agent login response:', response);
        userData = response.agent;
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('✅ Agent token stored successfully:', response.token.substring(0, 20) + '...');
          console.log('✅ Token verification:', localStorage.getItem('token') ? 'Token in localStorage' : 'Token NOT in localStorage');
        } else {
          console.error('❌ No token in agent login response');
        }
        localStorage.setItem('user', JSON.stringify({ id: userData.id, name: userData.name, role: 'agent' }));
        login('agent', userData.name, userData.agentId);
        navigate('agent-dashboard');
      } else if (role === 'admin') {
        response = await apiClient.adminLogin(adminId, password);
        console.log('Admin login response:', response);
        userData = response.admin;
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('✅ Admin token stored successfully:', response.token.substring(0, 20) + '...');
          console.log('✅ Token verification:', localStorage.getItem('token') ? 'Token in localStorage' : 'Token NOT in localStorage');
        } else {
          console.error('❌ No token in admin login response');
        }
        localStorage.setItem('user', JSON.stringify({ id: userData.id, adminId: userData.adminId, role: 'admin' }));
        login('admin', 'Admin', userData.adminId);
        navigate('admin-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md blur-zone-strong p-8 rounded-lg">
        <Button variant="ghost" onClick={() => navigate('landing')} className="mb-8 text-[#6b5d4f] hover:text-[#3d2817]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <RecycledPaperCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-[#faf0e6]" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl text-[#3d2817] mb-2">Welcome Back</h1>
            <p className="text-[#2c1810]">Login to continue your impact journey</p>
          </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="role" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Login As</label>
                  <Select value={role} onValueChange={(value) => {
                    setRole(value);
                    setError('');
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === 'user' && (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Full Name</label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                      <p className="text-xs text-[#6b5d4f] mt-1">Optional - will use your profile name if not provided</p>
                    </div>
                  </>
                )}

                {role === 'agent' && (
                  <div>
                    <label htmlFor="agentId" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Agent ID</label>
                    <Input
                      id="agentId"
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      placeholder="AG-00001"
                      required
                    />
                  </div>
                )}

                {role === 'admin' && (
                  <div>
                    <label htmlFor="adminId" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Admin ID</label>
                    <Input
                      id="adminId"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="AD-00001"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-[#3d2817] mb-2 text-sm uppercase tracking-wide">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[#2c1810] text-sm">
                    <input type="checkbox" className="rounded border-[#d4c5b0]" />
                    Remember me
                  </label>
                  <a href="#" className="text-[#6b8e6b] hover:text-[#5a7a5a] text-sm hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" variant="emerald" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Initializing Session...' : 'Initialize Session'} <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {role === 'user' && (
                <div className="mt-6 text-center text-[#2c1810]">
                  Don't have an account?{' '}
                  <button onClick={() => navigate('signup')} className="text-[#6b8e6b] hover:text-[#5a7a5a] hover:underline">
                    Sign up
                  </button>
                </div>
              )}
            </RecycledPaperCard>
      </div>
    </div>
  );
}
