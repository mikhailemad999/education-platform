import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store';
import { MOCK_SUBSCRIPTION_PLANS } from '../../services/mockData';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const setItem = useCartStore((state) => state.setItem);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleSelectPlan = (planId: string, planName: string, price: number) => {
    setItem({
      subscriptionPlanId: planId,
      subscriptionPlanName: `${planName} (${billingCycle.toUpperCase()})`,
      price
    });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <span className="px-3 py-1 rounded-full bg-primary-container/15 text-primary text-[11px] font-mono font-bold uppercase tracking-wider">
          SaaS All-Access Subscriptions
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-contrast tracking-tight">
          Invest in High-Leverage Architecture Skills
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Zero marketing fluff. Unrestricted access to production codebases, multi-cluster labs, verifiable credentials, and private advisory sessions.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="p-1 rounded-xl bg-surface-card border border-border-standard inline-flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-surface-elevated text-text-contrast shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-mono font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {MOCK_SUBSCRIPTION_PLANS.map((plan) => {
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
          const isPro = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-2xl p-8 transition-all ${
                isPro
                  ? 'bg-surface-card border-2 border-primary-container shadow-2xl relative'
                  : 'bg-surface-card border border-border-standard shadow-lg'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-container text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  MOST POPULAR CHOICE
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-contrast">{plan.name}</h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-text-contrast font-mono">
                    ${price}
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    /{billingCycle === 'annual' ? 'yr' : 'mo'}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id, plan.name, price)}
                  className={`w-full h-11 rounded-lg text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                    isPro
                      ? 'bg-primary-container hover:brightness-110 active:scale-95 text-white'
                      : 'bg-surface-interactive hover:bg-surface-elevated text-text-primary border border-border-control'
                  }`}
                >
                  <span>{price === 0 ? 'Start Free' : 'Choose Plan'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                {/* Features List */}
                <div className="pt-6 border-t border-border-subtle space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                    Plan Features:
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">
                        check
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 text-center text-[11px] text-text-muted">
                Cancel anytime • Instant activation
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
