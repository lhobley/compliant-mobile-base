import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { VideoIntro } from '../components/VideoIntro';

type AuthMode = 'login' | 'signup' | 'forgot';

const LoginPage = () => {
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        // Login successful, play intro
        setLoading(false);
        setIsAnimating(true);
        setTimeout(() => navigate('/'), 2800);
      } else if (mode === 'signup') {
        await signup(email, password, name);
        // Signup successful, play intro
        setLoading(false);
        setIsAnimating(true);
        setTimeout(() => navigate('/'), 2800);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Check your email for password reset instructions.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      
      let msg = err.message || 'Failed to authenticate';
      if (err.code === 'auth/configuration-not-found') {
        msg = "Authentication is not enabled in the database yet. Please contact support.";
      }
      
      setError(msg);
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === 'signup' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              required={mode === 'signup'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="John Doe"
            />
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="you@company.com"
          />
        </div>
      </div>

      {mode !== 'forgot' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              required={mode === 'login' || mode === 'signup'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </motion.div>
      )}

      {mode === 'login' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => switchMode('forgot')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot Password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-slate-900/20"
      >
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'} 
            {mode !== 'forgot' && <ChevronRight className="ml-2" size={20} />}
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/login-bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to keep it readable but show the photo clearly */}
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>

      <AnimatePresence>
        {!isAnimating ? (
          /* Login Form Container */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className="w-full max-w-md p-8 z-10"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                     <img src="/logo.png" alt="ComplianceDaddy" className="w-full h-full object-contain" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Reset Password'}
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Create your free account' : 'Enter your email to receive instructions'}
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center">
                    {successMsg}
                  </div>
                )}

                {renderForm()}

                <div className="mt-6 text-center">
                  {mode === 'login' ? (
                    <p className="text-sm text-gray-500">
                      Don't have an account?{' '}
                      <button onClick={() => switchMode('signup')} className="font-bold text-slate-900 hover:underline">
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <button onClick={() => switchMode('login')} className="font-bold text-slate-900 hover:underline">
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <VideoIntro />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
