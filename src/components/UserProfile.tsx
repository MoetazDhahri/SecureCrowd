import { useState } from 'react';
import { User, Shield, DollarSign, Save, CheckCircle, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function UserProfile() {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [riskProfile, setRiskProfile] = useState(profile?.risk_profile || 'balanced');
  const [investmentLimit, setInvestmentLimit] = useState(profile?.investment_limit || 10000);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        risk_profile: riskProfile,
        investment_limit: investmentLimit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and investment preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-cyan-400" />
              Personal Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  KYC Verification Status
                </label>
                <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                  profile?.kyc_verified
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                  {profile?.kyc_verified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Verified</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Pending Verification</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-cyan-400" />
              Investment Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Risk Profile
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'conservative', label: 'Conservative', desc: 'Low risk' },
                    { value: 'balanced', label: 'Balanced', desc: 'Medium risk' },
                    { value: 'aggressive', label: 'Aggressive', desc: 'High risk' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRiskProfile(option.value)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        riskProfile === option.value
                          ? 'bg-cyan-500/20 border-2 border-cyan-500'
                          : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                      }`}
                    >
                      <span className="font-semibold block mb-1">{option.label}</span>
                      <span className="text-xs text-slate-400">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Investment Limit
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={investmentLimit}
                    onChange={(e) => setInvestmentLimit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Maximum amount you can invest per transaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-cyan-400" />
              Linked Wallets
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">MetaMask</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                    Connected
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500">0x7a2F...8b4c</p>
              </div>

              <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all duration-300 text-sm">
                + Add Wallet
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Account Stats</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Member Since</p>
                <p className="font-semibold">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-1">Total Investments</p>
                <p className="font-semibold">${profile?.total_aum.toLocaleString() || 0}</p>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-1">Risk Profile</p>
                <p className="font-semibold capitalize">{profile?.risk_profile}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
