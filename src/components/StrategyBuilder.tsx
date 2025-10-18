import { useState } from 'react';
import { Target, TrendingUp, Shield, PieChart, BarChart3 } from 'lucide-react';

type RiskProfile = 'conservative' | 'balanced' | 'aggressive';

export function StrategyBuilder() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    investmentGoal: '',
    timeHorizon: '',
    riskTolerance: '',
    investmentAmount: '',
    preferredSectors: [] as string[],
  });
  const [result, setResult] = useState<RiskProfile | null>(null);

  const strategies = {
    conservative: {
      name: 'Conservative Growth',
      description: 'Focus on capital preservation with steady, lower-risk returns',
      allocation: [
        { category: 'Green Energy', percentage: 40, color: 'from-green-500 to-emerald-400' },
        { category: 'Real Estate', percentage: 35, color: 'from-purple-500 to-pink-400' },
        { category: 'Established Startups', percentage: 20, color: 'from-cyan-500 to-blue-400' },
        { category: 'Crypto (Low Risk)', percentage: 5, color: 'from-yellow-500 to-orange-400' },
      ],
      expectedROI: '8-12%',
      riskScore: 25,
    },
    balanced: {
      name: 'Balanced Portfolio',
      description: 'Mix of growth and stability with moderate risk',
      allocation: [
        { category: 'Tech Startups', percentage: 30, color: 'from-cyan-500 to-blue-400' },
        { category: 'Green Energy', percentage: 25, color: 'from-green-500 to-emerald-400' },
        { category: 'Crypto Pool', percentage: 25, color: 'from-yellow-500 to-orange-400' },
        { category: 'Real Estate', percentage: 20, color: 'from-purple-500 to-pink-400' },
      ],
      expectedROI: '15-25%',
      riskScore: 50,
    },
    aggressive: {
      name: 'Aggressive Growth',
      description: 'Maximum growth potential with higher risk tolerance',
      allocation: [
        { category: 'Early-Stage Startups', percentage: 40, color: 'from-cyan-500 to-blue-400' },
        { category: 'Crypto Pool', percentage: 35, color: 'from-yellow-500 to-orange-400' },
        { category: 'High-Risk Tech', percentage: 15, color: 'from-red-500 to-orange-400' },
        { category: 'Green Energy', percentage: 10, color: 'from-green-500 to-emerald-400' },
      ],
      expectedROI: '30-50%',
      riskScore: 75,
    },
  };

  const calculateStrategy = () => {
    const { riskTolerance, timeHorizon } = answers;

    if (riskTolerance === 'low' || timeHorizon === 'short') {
      setResult('conservative');
    } else if (riskTolerance === 'high' && timeHorizon === 'long') {
      setResult('aggressive');
    } else {
      setResult('balanced');
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      calculateStrategy();
    }
  };

  const toggleSector = (sector: string) => {
    setAnswers(prev => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter(s => s !== sector)
        : [...prev.preferredSectors, sector],
    }));
  };

  if (result) {
    const strategy = strategies[result];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Personalized Strategy</h1>
          <button
            onClick={() => {
              setResult(null);
              setStep(1);
              setAnswers({
                investmentGoal: '',
                timeHorizon: '',
                riskTolerance: '',
                investmentAmount: '',
                preferredSectors: [],
              });
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{strategy.name}</h2>
              <p className="text-slate-400">{strategy.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">Expected ROI</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{strategy.expectedROI}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">Risk Score</p>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">{strategy.riskScore}/100</span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">Profile Type</p>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span className="text-lg font-bold capitalize">{result}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <PieChart className="w-6 h-6 mr-2 text-cyan-400" />
                Asset Allocation
              </h3>

              <div className="space-y-4">
                {strategy.allocation.map((asset, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{asset.category}</span>
                      <span className="text-slate-400">{asset.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${asset.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${asset.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-cyan-400" />
                Backtest Simulation
              </h3>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Past 1 Year Performance</span>
                  <span className="text-green-400 font-bold text-xl">+{strategy.expectedROI.split('-')[0]}</span>
                </div>
                <div className="h-48 flex items-end space-x-2">
                  {[12, 15, 18, 16, 20, 22, 19, 24, 26, 23, 28, 30].map((value, idx) => (
                    <div key={idx} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t" style={{ height: `${value * 2}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Your Preferences</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Investment Goal</p>
                  <p className="font-semibold capitalize">{answers.investmentGoal}</p>
                </div>
                <div>
                  <p className="text-slate-400">Time Horizon</p>
                  <p className="font-semibold capitalize">{answers.timeHorizon}</p>
                </div>
                <div>
                  <p className="text-slate-400">Risk Tolerance</p>
                  <p className="font-semibold capitalize">{answers.riskTolerance}</p>
                </div>
                <div>
                  <p className="text-slate-400">Investment Amount</p>
                  <p className="font-semibold">${answers.investmentAmount}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300">
                  Apply Strategy
                </button>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all duration-300">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Build Your Investment Strategy</h1>
        <p className="text-slate-400">Answer a few questions to get personalized recommendations</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Question {step} of 5</span>
              <span className="text-sm text-slate-400">{Math.round((step / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What is your primary investment goal?</h2>
              <div className="grid gap-3">
                {['growth', 'income', 'preservation', 'balanced'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setAnswers({ ...answers, investmentGoal: goal })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      answers.investmentGoal === goal
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold capitalize">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What is your investment time horizon?</h2>
              <div className="grid gap-3">
                {[
                  { value: 'short', label: 'Short Term (< 1 year)' },
                  { value: 'medium', label: 'Medium Term (1-3 years)' },
                  { value: 'long', label: 'Long Term (3-5 years)' },
                  { value: 'verylong', label: 'Very Long Term (5+ years)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, timeHorizon: option.value })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      answers.timeHorizon === option.value
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What is your risk tolerance?</h2>
              <div className="grid gap-3">
                {[
                  { value: 'low', label: 'Low', desc: 'I prefer stable, predictable returns' },
                  { value: 'medium', label: 'Medium', desc: 'I can handle some volatility' },
                  { value: 'high', label: 'High', desc: 'I seek maximum growth despite risks' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, riskTolerance: option.value })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      answers.riskTolerance === option.value
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold block mb-1">{option.label}</span>
                    <span className="text-sm text-slate-400">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">How much do you plan to invest?</h2>
              <div className="grid gap-3">
                {['1000', '5000', '10000', '25000', '50000+'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAnswers({ ...answers, investmentAmount: amount })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      answers.investmentAmount === amount
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold">${amount}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Which sectors interest you? (Select multiple)</h2>
              <div className="grid gap-3">
                {['Tech Startups', 'Green Energy', 'Crypto', 'Real Estate', 'Healthcare'].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      answers.preferredSectors.includes(sector)
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold">{sector}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all duration-300"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !answers.investmentGoal) ||
                (step === 2 && !answers.timeHorizon) ||
                (step === 3 && !answers.riskTolerance) ||
                (step === 4 && !answers.investmentAmount) ||
                (step === 5 && answers.preferredSectors.length === 0)
              }
              className="ml-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 5 ? 'Generate Strategy' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
