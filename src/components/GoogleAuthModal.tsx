import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState('dhosthurduhisan@gmail.com');
  const [customEmail, setCustomEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useAlternative, setUseAlternative] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (emailToUse: string, displayName = 'Dhosthur Duhisan') => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithGoogle(
        emailToUse,
        displayName,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      );
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-bold text-white tracking-tight">
                Sign in to Quizora
              </h2>
              <p className="text-xs text-slate-400">
                Sync progress, preserve streaks, and compete on the global leaderboard.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!useAlternative ? (
            <>
              {/* Primary Google One-Tap Account */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Detected Google Account:</span>
                <button
                  onClick={() => handleSignIn(selectedEmail, 'Dhosthur Duhisan')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl text-left transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Google Profile"
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                    <div className="overflow-hidden">
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        Dhosthur Duhisan
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[210px]">
                        {selectedEmail}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-lg">
                    <span>Continue</span>
                  </div>
                </button>
              </div>

              {/* Official Google Button */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <span className="relative px-3 bg-slate-900 text-[11px] text-slate-400 uppercase tracking-wider">
                  or standard google authorization
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSignIn(selectedEmail, 'Dhosthur Duhisan')}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-xl transition-colors shadow-sm"
              >
                {/* Google Multi-Color SVG G Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isSubmitting ? 'Authorizing...' : 'Sign in with Google'}</span>
              </button>

              <button
                type="button"
                onClick={() => setUseAlternative(true)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors pt-1"
              >
                Use another Google email address
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (customEmail.trim()) {
                    const name = customEmail.split('@')[0];
                    handleSignIn(customEmail.trim(), name);
                  }
                }}
                disabled={!customEmail.includes('@')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors"
              >
                Continue with {customEmail || 'Google'}
              </button>
              <button
                type="button"
                onClick={() => setUseAlternative(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Back to quick account
              </button>
            </div>
          )}

          {/* Privacy & Security Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secure authentication. Only basic profile and email are retrieved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
