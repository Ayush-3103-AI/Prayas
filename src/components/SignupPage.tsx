import { PageView, UserRole } from '../App';
import { Leaf, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { apiClient } from '../utils/apiClient';

interface SignupPageProps {
  navigate: (page: PageView) => void;
  login: (role: UserRole, name: string, id: string) => void;
}

export default function SignupPage({ navigate, login }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.userRegister({
        name: formData.name,
        email: formData.email,
        phone: '', // Phone removed per requirements
        address: formData.address,
        password: formData.password,
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ 
        id: response.user.id, 
        name: response.user.name, 
        role: 'user' 
      }));

      login('user', response.user.name, response.user.id);
      navigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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

      {/* Signup Form */}
      <div className="max-w-md mx-auto px-4 py-20">
        <Button variant="ghost" onClick={() => navigate('landing')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3BAF69] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join the recycling revolution</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Your complete address"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300" required />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button type="submit" className="w-full bg-[#3BAF69] hover:bg-[#2d9755]" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'} <UserPlus className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-[#3BAF69] hover:underline">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
