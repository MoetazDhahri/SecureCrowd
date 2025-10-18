import { useState, useEffect } from 'react';
import { Layers, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { supabase, Project, ProjectSecurity } from '../lib/supabase';

type ProjectGridProps = {
  onSelectProject: (project: Project) => void;
};

export function ProjectGrid({ onSelectProject }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
  };

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'startup': return 'from-cyan-500 to-blue-600';
      case 'crypto': return 'from-yellow-500 to-orange-600';
      case 'green': return 'from-green-500 to-emerald-600';
      case 'real_estate': return 'from-purple-500 to-pink-600';
      default: return 'from-cyan-500 to-blue-600';
    }
  };

  const getRiskBadge = (score: number) => {
    if (score < 30) return { text: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score < 60) return { text: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { text: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Investment Projects</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('startup')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'startup'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Startups
          </button>
          <button
            onClick={() => setFilter('crypto')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'crypto'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setFilter('green')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'green'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Green Energy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const combinedRisk = (project.financial_risk_score + project.cyber_risk_score) / 2;
          const riskBadge = getRiskBadge(combinedRisk);
          const fundingProgress = (project.current_amount / project.target_amount) * 100;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className={`h-48 bg-gradient-to-br ${getCategoryColor(project.category)} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layers className="w-20 h-20 text-white/20" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Expected ROI</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-green-400">+{project.expected_roi}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Risk Score</p>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold">{combinedRisk.toFixed(0)}/100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Funding Progress</span>
                    <span className="text-xs font-semibold">{fundingProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getCategoryColor(project.category)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">
                      ${project.current_amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      ${project.target_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskBadge.bg} ${riskBadge.color}`}>
                    {riskBadge.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No projects found in this category</p>
        </div>
      )}
    </div>
  );
}
