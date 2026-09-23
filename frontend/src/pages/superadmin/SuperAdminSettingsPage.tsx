import React, { useState } from 'react';

export const SuperAdminSettingsPage: React.FC = () => {
  const [platformCommission, setPlatformCommission] = useState(15);
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [checkEnabled, setCheckEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            System Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Platform Settings & Protocols
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Global policies for financial settlement, payment gateway parameters, and security policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-base">save</span>
          <span>{saved ? 'Saved Successfully!' : 'Save System Settings'}</span>
        </button>
      </div>

      {/* Settings Cards */}
      <div className="space-y-6 text-xs">
        {/* Commission Rate */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-contrast">Platform Commission Share</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Percentage retained by Obsidian platform on course sales. Remainder paid directly to faculty.
              </p>
            </div>
            <span className="text-lg font-bold font-mono text-primary bg-primary-container/10 px-3 py-1 rounded border border-primary-container/30">
              {platformCommission}% Platform / {100 - platformCommission}% Instructor
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="40"
            value={platformCommission}
            onChange={(e) => setPlatformCommission(Number(e.target.value))}
            className="w-full accent-primary-container cursor-pointer"
          />
        </div>

        {/* Payment Gateways Config */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-text-contrast">Settlement Gateways</h3>

          <div className="divide-y divide-border-subtle">
            {/* Stripe Card Settlement */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">Stripe Credit & Debit Cards</div>
                <div className="text-[11px] text-text-muted">Direct Visa/Mastercard online payment processing</div>
              </div>
              <button
                onClick={() => setStripeEnabled(!stripeEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  stripeEnabled ? 'bg-primary-container' : 'bg-surface-secondary'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    stripeEnabled ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>

            {/* Offline Check Settlement */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">Offline Check & Wire Payments</div>
                <div className="text-[11px] text-text-muted">Generates pending invoices requiring manual admin confirmation</div>
              </div>
              <button
                onClick={() => setCheckEnabled(!checkEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  checkEnabled ? 'bg-primary-container' : 'bg-surface-secondary'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    checkEnabled ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Maintenance Policies */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-text-contrast">Security & Telemetry Policies</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle">
              <div>
                <div className="font-semibold text-text-contrast">Max Video Lesson Duration Limit</div>
                <div className="text-[11px] text-text-muted">Limits single video uploads to 60 minutes as required by product spec</div>
              </div>
              <span className="font-mono text-status-success font-bold">60 MIN (ENFORCED)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle">
              <div>
                <div className="font-semibold text-text-contrast">Credential Signing Authority Key</div>
                <div className="text-[11px] text-text-muted">Ed25519 Cryptographic verification key active</div>
              </div>
              <span className="font-mono text-primary font-bold">ED25519-LIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border-subtle">
              <div>
                <div className="font-semibold text-text-contrast">Emergency Maintenance Shield</div>
                <div className="text-[11px] text-text-muted">Restrict platform access to SuperAdmins only during migration</div>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                  maintenanceMode
                    ? 'bg-status-danger text-white'
                    : 'bg-surface-interactive text-text-muted hover:text-text-primary'
                }`}
              >
                {maintenanceMode ? 'ENABLED (OFFLINE)' : 'DISABLED (NORMAL)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
