import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Mail, Lock, User, ChevronRight, ArrowLeft, Tractor, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

type UserRole = 'farmer' | 'buyer';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your Grovix account
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password, name, role);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>

          {step === 'role' ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Join Grovix
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Select your role to get started
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('farmer')}
                  className="w-full p-6 border-2 border-gray-200 hover:border-emerald-500 rounded-2xl transition-all group flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <Tractor className="w-7 h-7 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Farmer</h3>
                    <p className="text-sm text-gray-600">Sell crops, get advisory, AI scanning</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('buyer')}
                  className="w-full p-6 border-2 border-gray-200 hover:border-teal-500 rounded-2xl transition-all group flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                    <ShoppingBag className="w-7 h-7 text-teal-600 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Buyer</h3>
                    <p className="text-sm text-gray-600">Buy fresh produce directly from farmers</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full mt-6 py-3 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
              >
                Already have an account? Sign In
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep('role')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <p className="text-sm text-gray-600">Signing up as</p>
                  <p className="font-semibold text-gray-900 capitalize">{role}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ChevronRight className="w-5 h-5" />}
                </button>
              </form>
            </>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
