import { PageView, UserRole } from '../App';
import { Leaf, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiClient } from '../utils/apiClient';

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
        // Use name from form if provided, otherwise use backend name
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('landing')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3BAF69] rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">Prayas</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-20">
        <Button variant="ghost" onClick={() => navigate('landing')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        {/* Portal Selection Buttons */}
        <div className="mb-8 grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('dashboard')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#3BAF69] text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3BAF69] transition-colors">
                  Login as User
                </h3>
                <p className="text-sm text-gray-600 mt-1">Access user portal</p>
              </div>
              <div className="w-10 h-10 bg-[#3BAF69] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('agent-dashboard')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#3BAF69] text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3BAF69] transition-colors">
                  Login as Agent
                </h3>
                <p className="text-sm text-gray-600 mt-1">Access agent portal</p>
              </div>
              <div className="w-10 h-10 bg-[#3BAF69] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('admin-dashboard')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#3BAF69] text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3BAF69] transition-colors">
                  Login as Admin
                </h3>
                <p className="text-sm text-gray-600 mt-1">Access admin portal</p>
              </div>
              <div className="w-10 h-10 bg-[#3BAF69] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3BAF69] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to continue your impact journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-gray-700 mb-2">Login As</label>
              <Select value={role} onValueChange={(value) => {
                setRole(value);
                setError('');
              }}>
                <SelectTrigger>
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
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
                  <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - will use your profile name if not provided</p>
                </div>
              </>
            )}

            {role === 'agent' && (
              <div>
                <label htmlFor="agentId" className="block text-gray-700 mb-2">Agent ID</label>
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
                <label htmlFor="adminId" className="block text-gray-700 mb-2">Admin ID</label>
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
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
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
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <a href="#" className="text-[#3BAF69] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-[#3BAF69] hover:bg-[#2d9755]" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'} <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {role === 'user' && (
            <div className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => navigate('signup')} className="text-[#3BAF69] hover:underline">
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
