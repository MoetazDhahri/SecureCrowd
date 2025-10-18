import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, AlertTriangle, Shield,
  DollarSign, PieChart, Activity, Bell, User, LogOut,
  Layers, Target, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Project, Portfolio, Alert } from '../lib/supabase';
import { ProjectGrid } from './ProjectGrid';
import { ProjectDetail } from './ProjectDetail';
import { CapitalCallsInbox } from './CapitalCallsInbox';
import { AlertsPanel } from './AlertsPanel';
import { StrategyBuilder } from './StrategyBuilder';
import { UserProfile } from './UserProfile';

export function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [portfolios, setPortfolios] = useState<(Portfolio & { project: Project })[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'strategy' | 'capital-calls' | 'alerts' | 'profile'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    if (user) {
      loadPortfolios();
      loadAlerts();
    }
  }, [user]);

  const loadPortfolios = async () => {
    const { data } = await supabase
      .from('portfolios')
      .select('*, project:projects(*)')
      .eq('user_id', user?.id);

    if (data) {
      setPortfolios(data as any);
    }
  };

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setAlerts(data);
    }
  };

  const totalValue = portfolios.reduce((sum, p) => sum + p.current_value, 0);
  const totalInvested = portfolios.reduce((sum, p) => sum + p.amount_invested, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const avgFinancialRisk = portfolios.length > 0
    ? portfolios.reduce((sum, p) => sum + p.project.financial_risk_score, 0) / portfolios.length
    : 50;
  const avgCyberRisk = portfolios.length > 0
    ? portfolios.reduce((sum, p) => sum + p.project.cyber_risk_score, 0) / portfolios.length
    : 50;
  const combinedRiskScore = Math.round((avgFinancialRisk + avgCyberRisk) / 2);

  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  const getRiskBadge = (score: number) => {
    if (score < 30) return { text: 'Safe', color: 'bg-green-500', textColor: 'text-green-400' };
    if (score < 60) return { text: 'Caution', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    return { text: 'High Risk', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const riskBadge = getRiskBadge(combinedRiskScore);

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInvest={() => {
          setSelectedProject(null);
          loadPortfolios();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-7 h-7 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SecureCrowd
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setActiveView('profile')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={signOut}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('projects')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'projects'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveView('strategy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'strategy'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              Strategy Builder
            </button>
            <button
              onClick={() => setActiveView('capital-calls')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'capital-calls'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              Capital Calls
            </button>
          </div>
        </div>
      </nav>

      {showAlerts && (
        <div className="container mx-auto px-6 py-4">
          <AlertsPanel alerts={alerts} onClose={() => setShowAlerts(false)} onUpdate={loadAlerts} />
        </div>
      )}

      <main className="container mx-auto px-6 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Investor'}</h1>
                <p className="text-slate-400 mt-1">Here's your portfolio overview</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-cyan-400" />
                  <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Total Portfolio</p>
                <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {totalGain >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={totalGain >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">P&L (24h)</p>
                <p className="text-3xl font-bold">${totalGain.toLocaleString()}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-slate-400">Invested: ${totalInvested.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Combined Risk Score</p>
                <p className="text-3xl font-bold">{combinedRiskScore}/100</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskBadge.color}/20 ${riskBadge.textColor} border border-${riskBadge.color}/30`}>
                    {riskBadge.text}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Active Alerts</p>
                <p className="text-3xl font-bold">{unreadAlerts}</p>
                <div className="mt-2">
                  <button
                    onClick={() => setShowAlerts(true)}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-2 text-cyan-400" />
                  Your Investments
                </h2>
                {portfolios.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No investments yet</p>
                    <button
                      onClick={() => setActiveView('projects')}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300"
                    >
                      Browse Projects
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolios.map((portfolio) => (
                      <div
                        key={portfolio.id}
                        className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition-all cursor-pointer"
                        onClick={() => setSelectedProject(portfolio.project)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Layers className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{portfolio.project.name}</h3>
                              <p className="text-sm text-slate-400">{portfolio.project.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${portfolio.current_value.toLocaleString()}</p>
                            <p className={`text-sm ${portfolio.roi_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {portfolio.roi_percentage >= 0 ? '+' : ''}{portfolio.roi_percentage.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((portfolio.roi_percentage + 50), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveView('projects')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 text-left"
                  >
                    Explore Projects
                  </button>
                  <button
                    onClick={() => setActiveView('strategy')}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all duration-300 text-left"
                  >
                    Build Strategy
                  </button>
                  <button
                    onClick={() => setActiveView('capital-calls')}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all duration-300 text-left"
                  >
                    View Capital Calls
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="font-semibold mb-3 text-sm text-slate-400">Latest Alerts</h3>
                  <div className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                        onClick={() => setShowAlerts(true)}
                      >
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            'text-yellow-400'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-slate-400 text-xs mt-1">{alert.message?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'projects' && (
          <ProjectGrid onSelectProject={setSelectedProject} />
        )}

        {activeView === 'strategy' && (
          <StrategyBuilder />
        )}

        {activeView === 'capital-calls' && (
          <CapitalCallsInbox />
        )}

        {activeView === 'profile' && (
          <UserProfile />
        )}
      </main>
    </div>
  );
}
