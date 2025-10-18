import { AlertTriangle, CheckCircle, XCircle, Shield, TrendingUp, X } from 'lucide-react';
import { Alert } from '../lib/supabase';
import { supabase } from '../lib/supabase';

type AlertsPanelProps = {
  alerts: Alert[];
  onClose: () => void;
  onUpdate: () => void;
};

export function AlertsPanel({ alerts, onClose, onUpdate }: AlertsPanelProps) {
  const handleMarkRead = async (alertId: string) => {
    await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);
    onUpdate();
  };

  const handleAction = async (alertId: string, action: string) => {
    await supabase
      .from('alerts')
      .update({ action_taken: action, is_read: true })
      .eq('id', alertId);
    onUpdate();
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          pulse: true,
        };
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          pulse: false,
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          pulse: false,
        };
      default:
        return {
          icon: Shield,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          pulse: false,
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
      case 'rug_pull':
      case 'phishing':
        return Shield;
      case 'market':
        return TrendingUp;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
          Alerts & Threat Monitoring
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Clear</h3>
          <p className="text-slate-400">No alerts at the moment</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.map((alert) => {
            const severityConfig = getSeverityConfig(alert.severity);
            const TypeIcon = getTypeIcon(alert.type);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${severityConfig.bg} ${severityConfig.border} ${
                  !alert.is_read ? 'ring-2 ring-cyan-500/20' : ''
                } transition-all`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <severityConfig.icon
                      className={`w-6 h-6 ${severityConfig.color} ${severityConfig.pulse ? 'animate-pulse' : ''}`}
                    />
                    {!alert.is_read && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${severityConfig.bg} ${severityConfig.color} uppercase`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <TypeIcon className="w-3 h-3" />
                            <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                          </span>
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {alert.action_taken && (
                      <div className="mt-3 p-2 bg-slate-800/50 rounded text-sm">
                        <span className="text-slate-400">Action taken: </span>
                        <span className="font-semibold capitalize">{alert.action_taken}</span>
                      </div>
                    )}

                    {!alert.action_taken && alert.severity !== 'low' && (
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => handleAction(alert.id, 'freeze')}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded text-sm font-semibold transition-all"
                        >
                          Freeze Assets
                        </button>
                        <button
                          onClick={() => handleAction(alert.id, 'dismiss')}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm font-semibold transition-all"
                        >
                          Dismiss
                        </button>
                        {!alert.is_read && (
                          <button
                            onClick={() => handleMarkRead(alert.id)}
                            className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded text-sm font-semibold transition-all"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
