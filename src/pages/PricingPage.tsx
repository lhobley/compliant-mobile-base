import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStripe } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import { Check, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small venues getting started',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_BASIC,
    features: [
      'Up to 1 location',
      'Basic inventory tracking',
      'Standard audits',
      'Email support',
      '5 team members',
    ],
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing businesses with multiple locations',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_PRO,
    features: [
      'Up to 5 locations',
      'AI-powered inventory',
      'Voice-guided audits',
      'Priority support',
      'Unlimited team members',
      'Advanced analytics',
      'Custom checklists',
    ],
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large chains with custom needs',
    priceId: null,
    features: [
      'Unlimited locations',
      'Custom AI training',
      'Dedicated account manager',
      '24/7 phone support',
      'SLA guarantee',
      'API access',
      'White-label options',
    ],
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    popular: false,
  },
];

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId: string | null) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!priceId) {
      // Enterprise plan - redirect to contact
      window.location.href = 'mailto:sales@compliancedaddy.com?subject=Enterprise Plan Inquiry';
      return;
    }

    setLoading(planId);

    try {
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create checkout session via your backend/cloud function
      // For now, we'll redirect to Stripe Checkout directly
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        successUrl: `${window.location.origin}/settings?subscription=success`,
        cancelUrl: `${window.location.origin}/pricing?subscription=cancelled`,
        customerEmail: user.email,
      });

      if (error) {
        console.error('Stripe error:', error);
        alert(error.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Choose Your Plan
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Start with AI-powered compliance management today. 
          Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl overflow-hidden group ${
              plan.popular ? 'md:-mt-4 md:mb-4' : ''
            }`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold z-10">
                MOST POPULAR
              </div>
            )}

            {/* Card background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg" />
            <div className={`absolute inset-0 border ${plan.popular ? 'border-purple-500/50' : 'border-white/10'} rounded-2xl`} />
            
            {/* Glow effect for popular */}
            {plan.popular && (
              <div className="absolute inset-0 bg-purple-500/10 blur-xl" />
            )}

            <div className={`relative p-8 ${plan.popular ? 'pt-12' : ''}`}>
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <plan.icon className="text-white" size={32} />
              </div>

              {/* Plan name */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-white/50">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-white/80">
                    <Check className="mr-3 text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id, plan.priceId)}
                disabled={loading === plan.id}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : plan.priceId ? (
                  'Get Started'
                ) : (
                  'Contact Sales'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
        <div className="flex items-center">
          <Check className="mr-2 text-green-400" size={16} />
          14-day free trial
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
