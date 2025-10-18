import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { supabase, CapitalCall, Project } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function CapitalCallsInbox() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<(CapitalCall & { project: Project })[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  useEffect(() => {
    if (user) {
      loadCapitalCalls();
    }
  }, [user]);

  const loadCapitalCalls = async () => {
    const { data } = await supabase
      .from('capital_calls')
      .select('*, project:projects(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCalls(data as any);
    }
  };

  const handleResponse = async (callId: string, status: 'approved' | 'declined') => {
    const { error } = await supabase
      .from('capital_calls')
      .update({ status })
      .eq('id', callId);

    if (!error) {
      loadCapitalCalls();
    }
  };

  const filteredCalls = filter === 'all' ? calls : calls.filter(c => c.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'declined':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' };
      default:
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    }
  };

  const getRecommendationBadge = (rec: string | null) => {
    if (!rec) return null;
    switch (rec.toLowerCase()) {
      case 'approve':
        return { text: 'Recommend Approve', color: 'text-green-400' };
      case 'caution':
        return { text: 'Review Carefully', color: 'text-yellow-400' };
      case 'decline':
        return { text: 'Recommend Decline', color: 'text-red-400' };
      default:
        return null;
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Capital Calls</h1>
          <p className="text-slate-400 mt-1">Manage investment requests from your portfolio projects</p>
        </div>

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
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('declined')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'declined'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Declined
          </button>
        </div>
      </div>

      {filteredCalls.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Capital Calls</h3>
          <p className="text-slate-400">
            {filter === 'all'
              ? "You don't have any capital calls at the moment"
              : `No ${filter} capital calls found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCalls.map((call) => {
            const statusBadge = getStatusBadge(call.status);
            const recBadge = getRecommendationBadge(call.ai_recommendation);
            const overdue = isOverdue(call.deadline);

            return (
              <div
                key={call.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">{call.project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.color} flex items-center space-x-1`}>
                        <statusBadge.icon className="w-3 h-3" />
                        <span className="capitalize">{call.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <span>Amount: ${call.amount_requested.toLocaleString()}</span>
                      <span className={overdue && call.status === 'pending' ? 'text-red-400 flex items-center space-x-1' : ''}>
                        {overdue && call.status === 'pending' && <AlertTriangle className="w-4 h-4" />}
                        <span>Deadline: {new Date(call.deadline).toLocaleDateString()}</span>
                      </span>
                      <span>Created: {new Date(call.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {recBadge && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-4 h-4 ${recBadge.color}`} />
                      <span className="text-sm font-semibold">AI Recommendation:</span>
                      <span className={`text-sm ${recBadge.color}`}>{recBadge.text}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    {call.blockchain_tx_hash && (
                      <a
                        href={`https://etherscan.io/tx/${call.blockchain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on Blockchain</span>
                      </a>
                    )}
                  </div>

                  {call.status === 'pending' && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleResponse(call.id, 'declined')}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-all duration-300"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleResponse(call.id, 'approved')}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-lg font-semibold transition-all duration-300"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
