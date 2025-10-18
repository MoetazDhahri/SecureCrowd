import { useState, useEffect } from 'react';
import {
  X, TrendingUp, Shield, CheckCircle, XCircle, AlertTriangle,
  DollarSign, BarChart3, Activity, Lock, FileCheck, Globe
} from 'lucide-react';
import { supabase, Project, ProjectSecurity, AIRecommendation } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProjectDetailProps = {
  project: Project;
  onClose: () => void;
  onInvest: () => void;
};

export function ProjectDetail({ project, onClose, onInvest }: ProjectDetailProps) {
  const { user } = useAuth();
  const [security, setSecurity] = useState<ProjectSecurity | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [investAmount, setInvestAmount] = useState(project.min_investment);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [project.id]);

  const loadProjectDetails = async () => {
    const { data: secData } = await supabase
      .from('project_security')
      .select('*')
      .eq('project_id', project.id)
      .maybeSingle();

    if (secData) {
      setSecurity(secData);
    }

    const { data: recData } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('project_id', project.id)
      .eq('user_id', user?.id)
      .maybeSingle();

    if (recData) {
      setRecommendation(recData);
    }
  };

  const handleInvest = async () => {
    if (!user) return;

    const { error } = await supabase.from('portfolios').insert({
      user_id: user.id,
      project_id: project.id,
      amount_invested: investAmount,
      current_value: investAmount,
      roi_percentage: 0,
    });

    if (!error) {
      setShowInvestModal(false);
      onInvest();
    }
  };

  const combinedRisk = (project.financial_risk_score + project.cyber_risk_score) / 2;

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'invest':
        return { text: 'Invest', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle };
      case 'caution':
        return { text: 'Caution', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertTriangle };
      case 'avoid':
        return { text: 'Avoid', color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle };
      default:
        return { text: 'Neutral', color: 'text-slate-400', bg: 'bg-slate-500/20', icon: Activity };
    }
  };

  const recBadge = recommendation ? getRecommendationBadge(recommendation.recommendation) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={onClose}
          className="mb-6 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                  <p className="text-slate-400">{project.description}</p>
                </div>
                <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold">
                  {project.category}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Expected ROI</p>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">+{project.expected_roi}%</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Min Investment</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold">${project.min_investment}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Risk Score</p>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold">{combinedRisk.toFixed(0)}/100</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-cyan-400" />
                  Financial Metrics
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Financial Risk Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-48 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${project.financial_risk_score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{project.financial_risk_score}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Amount</span>
                    <span className="font-semibold">${project.target_amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Funding</span>
                    <span className="font-semibold">${project.current_amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Funding Progress</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-48 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full"
                          style={{ width: `${Math.min((project.current_amount / project.target_amount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">
                        {((project.current_amount / project.target_amount) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-green-400" />
                Cybersecurity Panel
              </h2>

              {security ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cyber Risk Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-48 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${project.cyber_risk_score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{project.cyber_risk_score}/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className={`p-4 rounded-xl border ${security.smart_contract_audit ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {security.smart_contract_audit ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">Smart Contract Audit</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {security.smart_contract_audit ? 'Verified' : 'Not verified'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${security.kyc_verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {security.kyc_verified ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">Team KYC</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {security.kyc_verified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${security.domain_verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {security.domain_verified ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">Domain Verification</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {security.domain_verified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${security.ssl_verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {security.ssl_verified ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">SSL Certificate</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {security.ssl_verified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">No security data available</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {recBadge && recommendation && (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                  AI Recommendation
                </h2>

                <div className={`p-4 rounded-xl ${recBadge.bg} border border-${recBadge.color}/30 mb-4`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <recBadge.icon className={`w-6 h-6 ${recBadge.color}`} />
                    <span className={`text-lg font-bold ${recBadge.color}`}>{recBadge.text}</span>
                  </div>
                  {recommendation.allocation_percentage && (
                    <p className="text-sm text-slate-400">
                      Suggested allocation: {recommendation.allocation_percentage}%
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Rationale</p>
                    <p className="text-sm">{recommendation.rationale}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Confidence Score</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full"
                          style={{ width: `${recommendation.confidence_score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{recommendation.confidence_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Invest Now</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Investment Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      min={project.min_investment}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Minimum: ${project.min_investment}
                  </p>
                </div>

                <button
                  onClick={handleInvest}
                  disabled={investAmount < project.min_investment}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Invest ${investAmount.toLocaleString()}
                </button>

                <div className="pt-4 border-t border-white/10 space-y-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Secured by blockchain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4" />
                    <span>Smart contract verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
