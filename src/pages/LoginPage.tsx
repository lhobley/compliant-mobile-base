import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { VideoIntro } from '../components/VideoIntro';
import VenueSetup from '../components/VenueSetup';

type AuthMode = 'login' | 'signup' | 'forgot' | 'setup';

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
        setLoading(false);
        setIsAnimating(true);
        setTimeout(() => navigate('/'), 2800);
      } else if (mode === 'signup') {
        await signup(email, password, name);
        setLoading(false);
        // Move to setup phase
        setMode('setup');
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

  const handleSetupComplete = () => {
    setIsAnimating(true);
    setTimeout(() => navigate('/'), 2800);
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
          <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="text"
              required={mode === 'signup'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none text-white placeholder-white/30"
              placeholder="John Doe"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-focus-within:from-cyan-500/10 group-focus-within:via-transparent group-focus-within:to-cyan-500/10 transition-all pointer-events-none" />
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={20} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none text-white placeholder-white/30"
            placeholder="you@company.com"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-focus-within:from-cyan-500/10 group-focus-within:via-transparent group-focus-within:to-cyan-500/10 transition-all pointer-events-none" />
        </div>
      </div>

      {mode !== 'forgot' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="password"
              required={mode === 'login' || mode === 'signup'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none text-white placeholder-white/30"
              placeholder="••••••••"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-focus-within:from-cyan-500/10 group-focus-within:via-transparent group-focus-within:to-cyan-500/10 transition-all pointer-events-none" />
          </div>
        </motion.div>
      )}

      {mode === 'login' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => switchMode('forgot')}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="relative w-full py-4 rounded-xl font-bold text-lg overflow-hidden group transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        {/* Button gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 shadow-lg shadow-cyan-500/50" />
        
        {/* Button content */}
        <span className="relative flex items-center justify-center text-white">
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'} 
              {mode !== 'forgot' && <ChevronRight className="ml-2" size={20} />}
            </>
          )}
        </span>
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src="/login-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <AnimatePresence>
        {!isAnimating ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className={`w-full ${mode === 'setup' ? 'max-w-2xl' : 'max-w-md'} p-8 z-10 transition-all duration-500`}
          >
            {/* Glassmorphism card */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Card background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              
              <div className="relative p-8">
                {mode === 'setup' ? (
                  <VenueSetup onComplete={handleSetupComplete} />
                ) : (
                  <>
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center p-1 shadow-2xl shadow-cyan-500/30">
                          <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="ComplianceDaddy" className="w-20 h-20 object-contain" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-900 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-3xl font-black text-center text-white mb-2">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                        {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Reset Password'}
                      </span>
                    </h2>
                    <p className="text-center text-white/50 mb-8">
                      {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Create your free account' : 'Enter your email to receive instructions'}
                    </p>

                    {/* Alerts */}
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                      >
                        {successMsg}
                      </motion.div>
                    )}

                    {renderForm()}

                    {/* Switch mode */}
                    <div className="mt-6 text-center">
                      {mode === 'login' ? (
                        <p className="text-sm text-white/50">
                          Don't have an account?{' '}
                          <button onClick={() => switchMode('signup')} className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                            Sign Up
                          </button>
                        </p>
                      ) : (
                        <p className="text-sm text-white/50">
                          Already have an account?{' '}
                          <button onClick={() => switchMode('login')} className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                            Sign In
                          </button>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* AI Badge */}
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-xs text-white/60">AI-Powered Compliance</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <VideoIntro />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
