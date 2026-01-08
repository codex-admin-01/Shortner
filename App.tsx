
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, ExternalLink, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { TARGET_CONFIG } from './constants';
import { detectTrafficSource, getRandomDelay, TrafficSourceInfo } from './utils';

const App: React.FC = () => {
  const [status, setStatus] = useState<'analyzing' | 'redirecting' | 'error'>('analyzing');
  const [sourceData, setSourceData] = useState<TrafficSourceInfo | null>(null);
  const [countdown, setCountdown] = useState(0);

  const performRedirect = useCallback((target: string) => {
    // We use location.replace to prevent the current page from staying in history
    // This is better for UX and redirect logic
    window.location.replace(target);
  }, []);

  useEffect(() => {
    // 1. Analyze the traffic source
    const analysis = detectTrafficSource();
    setSourceData(analysis);
    
    // Log for transparency (helps with debugging ad compliance)
    console.group('Traffic Analysis');
    console.log('Source:', analysis.isFacebook ? 'Facebook' : 'General/Direct');
    console.log('Referrer:', analysis.referrer);
    console.log('FBCLID Present:', analysis.hasFbclid);
    console.groupEnd();

    // 2. Set random delay (500-800ms)
    const delay = getRandomDelay(TARGET_CONFIG.REDIRECT_DELAY_MIN, TARGET_CONFIG.REDIRECT_DELAY_MAX);
    setCountdown(delay);

    const timer = setTimeout(() => {
      setStatus('redirecting');
      
      // 3. Logic: Redirect to specific landing if FB, otherwise fallback to Telegram
      if (analysis.isFacebook) {
        performRedirect(TARGET_CONFIG.FACEBOOK_LANDING);
      } else {
        performRedirect(TARGET_CONFIG.FALLBACK_TARGET);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [performRedirect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl transition-all duration-500 transform scale-100 hover:scale-[1.01]">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-all duration-1000 ${status === 'analyzing' ? 'animate-pulse' : ''}`}></div>
              <div className="relative bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-inner">
                {status === 'analyzing' ? (
                  <Shield className="w-10 h-10 text-blue-400 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-green-400" />
                )}
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {status === 'analyzing' ? 'Securing Connection' : 'Routing Traffic'}
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {status === 'analyzing' 
                ? 'Verifying your session integrity for a safe experience...' 
                : 'Connection established. Forwarding to destination...'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-10 mb-6">
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-[800ms] ease-out`}
                style={{ width: status === 'analyzing' ? '40%' : '100%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 px-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Analysis</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Safe Redirect</span>
            </div>
          </div>

          {/* Detection Info (Transparent/Compliant display) */}
          {sourceData && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Source Path</p>
                  <div className="flex items-center space-x-2">
                    <Search className="w-3 h-3 text-blue-400" />
                    <p className="text-xs font-mono text-blue-100 truncate">
                      {sourceData.isFacebook ? 'FB-OPTIMIZED' : 'SECURE-FALLBACK'}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                    <p className="text-xs font-mono text-indigo-100">STABLE</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-[11px] font-medium tracking-wide flex items-center justify-center space-x-2 uppercase">
            <span>Powered by Smart Routing Protocol v2.4</span>
            <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-500">Encrypted Transition</span>
          </p>
        </div>
      </div>

      {/* Manual Fallback (Optional, but good for accessibility) */}
      <button 
        onClick={() => performRedirect(sourceData?.isFacebook ? TARGET_CONFIG.FACEBOOK_LANDING : TARGET_CONFIG.FALLBACK_TARGET)}
        className="mt-12 text-slate-500 hover:text-slate-300 transition-colors text-xs flex items-center space-x-1"
      >
        <span>Redirecting automatically</span>
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};

export default App;
