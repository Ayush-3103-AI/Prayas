import { PageView, UserRole } from '../App';
import { Leaf, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { apiClient } from '../utils/apiClient';
import { RecycledPaperCard } from './ui/RecycledPaperCard';

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
        phone: '',
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
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => navigate('landing')} className="mb-8 text-[#3d2817]/60 hover:text-[#3d2817]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>

            <RecycledPaperCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-[#3d2817]" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl text-[#3d2817] mb-2">Create Account</h1>
              <p className="text-[#3d2817]/60">Join the recycling revolution</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[#3d2817]/80 mb-2 text-sm uppercase tracking-wide">Full Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[#3d2817]/80 mb-2 text-sm uppercase tracking-wide">Email</label>
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
                <label htmlFor="address" className="block text-[#3d2817]/80 mb-2 text-sm uppercase tracking-wide">Address</label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Your complete address"
                  required
                  className="bg-white/5 border-white/10 text-[#3d2817] placeholder:text-[#3d2817]/40"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[#3d2817]/80 mb-2 text-sm uppercase tracking-wide">Password</label>
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
                <label htmlFor="confirmPassword" className="block text-[#3d2817]/80 mb-2 text-sm uppercase tracking-wide">Confirm Password</label>
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
                <input type="checkbox" id="terms" className="mt-1 rounded border-white/20 bg-transparent" required />
                <label htmlFor="terms" className="text-[#3d2817]/60 text-sm">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <Button type="submit" variant="emerald" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'} <UserPlus className="w-4 h-4 ml-2" strokeWidth={2} />
              </Button>
            </form>

            <div className="mt-6 text-center text-[#3d2817]/60">
              Already have an account?{' '}
              <button onClick={() => navigate('login')} className="text-emerald-400 hover:text-emerald-300 hover:underline">
                Login
              </button>
            </div>
            </RecycledPaperCard>
        </div>
      </div>
  );
}
