import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, Crown, Loader2, ExternalLink } from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Use Stripe Payment Link for the $39.99 plan
    // This is the recommended approach for client-only apps
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    
    if (!paymentLink) {
      alert('Payment link not configured. Please contact support.');
      return;
    }

    // Append customer email to pre-fill it in Stripe Checkout
    const url = new URL(paymentLink);
    url.searchParams.append('prefilled_email', user.email);
    
    // Open in same window (or use _blank for new tab)
    window.location.href = url.toString();
  };

  const features = [
    'Unlimited locations',
    'AI-powered inventory',
    'Voice-guided audits',
    'Priority support',
    'Unlimited team members',
    'Advanced analytics',
    'Custom checklists',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Simple, Transparent Pricing
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          One plan, everything included. Start with AI-powered compliance management today.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        <div className="relative rounded-2xl overflow-hidden group w-full max-w-md md:-mt-4 md:mb-4">
          {/* Popular badge */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold z-10">
            ALL INCLUSIVE
          </div>

          {/* Card background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-lg" />
          <div className="absolute inset-0 border border-purple-500/50 rounded-2xl" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-purple-500/10 blur-xl" />

          <div className="relative p-8 pt-12">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Crown className="text-white" size={32} />
            </div>

            {/* Plan name */}
            <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
            <p className="text-white/50 text-sm mb-6">Complete compliance management for your business</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-5xl font-black text-white">$39.99</span>
              <span className="text-white/50">/month</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-white/80">
                  <Check className="mr-3 text-green-400 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleSubscribe('pro')}
              disabled={loading === 'pro'}
              className="w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center justify-center"
            >
              {loading === 'pro' ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Get Started
                  <ExternalLink className="ml-2" size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
        <div className="flex items-center">
          <Check className="mr-2 text-green-400" size={16} />
          2-day free trial
        </div>
        <div className="flex items-center">
          <Check className="mr-2 text-green-400" size={16} />
          No credit card required
        </div>
        <div className="flex items-center">
          <Check className="mr-2 text-green-400" size={16} />
          Cancel anytime
        </div>
        <div className="flex items-center">
          <Check className="mr-2 text-green-400" size={16} />
          Secure SSL checkout
        </div>
      </div>

      {/* FAQ teaser */}
      <div className="text-center">
        <p className="text-white/50">
          Have questions?{' '}
          <a href="mailto:support@compliancedaddy.com" className="text-cyan-400 hover:text-cyan-300">
            Contact our team
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
