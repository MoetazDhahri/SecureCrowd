import { TrendingUp, Shield, Zap, Network } from 'lucide-react';

type HeroPageProps = {
  onGetStarted: () => void;
  onExploreDashboard: () => void;
};

export function HeroPage({ onGetStarted, onExploreDashboard }: HeroPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SecureCrowd
          </span>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium">
                Tunisia's Premier Investment Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Invest Smarter.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Safer.
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              AI-powered investment recommendations with dual financial and cybersecurity risk scoring.
              Full blockchain transparency for every transaction.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Get Started
              </button>
              <button
                onClick={onExploreDashboard}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
              >
                Explore Projects
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold">AI-Powered</span>
                </div>
                <p className="text-sm text-slate-400">Smart Recommendations</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold">Secure</span>
                </div>
                <p className="text-sm text-slate-400">Cyber Risk Scoring</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold">Blockchain</span>
                </div>
                <p className="text-sm text-slate-400">Full Transparency</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Portfolio</span>
                  <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <div className="text-4xl font-bold">$124,580</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">+24.5%</span>
                  <span className="text-slate-400 text-sm">This month</span>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Green Energy Fund</span>
                      <span className="text-green-400 text-sm font-semibold">+18%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Tech Startups</span>
                      <span className="text-cyan-400 text-sm font-semibold">+32%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Crypto Pool</span>
                      <span className="text-yellow-400 text-sm font-semibold">+45%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Security Score: 92/100</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
