import React, { useState } from 'react';
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase';
import { Mail, Lock, User, Sparkles, TrendingUp, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthOverlayProps {
  onAuthSuccess: (user: any, profileData: any) => void;
}

export default function AuthOverlay({ onAuthSuccess }: AuthOverlayProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Player' | 'CourtOwner' | 'SuperAdmin'>('Player');
  const [dupr, setDupr] = useState('3.50');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Rate-limiting states to protect Firebase quotas and unnecessary auth billing
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [cumulativeRequests, setCumulativeRequests] = useState<{ timestamp: number }[]>([]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // 1. Enforce a minimum 3-second spacing between any action
    const timeSinceLast = now - lastActionTime;
    if (lastActionTime > 0 && timeSinceLast < 3000) {
      const waitSecs = Math.ceil((3000 - timeSinceLast) / 1000);
      setError(`Spacing Protection ACTIVE: Please wait ${waitSecs} second${waitSecs > 1 ? 's' : ''} between authentication requests to mitigate Firebase billing bursts.`);
      return false;
    }

    // 2. Enforce a sliding-window maximum of 5 requests per 60 seconds
    const oneMinuteAgo = now - 60000;
    const currentRequests = [...cumulativeRequests, { timestamp: now }].filter(
      r => r.timestamp > oneMinuteAgo
    );
    setCumulativeRequests(currentRequests);

    if (currentRequests.length > 5) {
      setError('Rapid Request Throttle: Maximum of 5 auth attempts per minute implemented to prevent Firebase rate limit spikes. Please wait a minute.');
      return false;
    }

    setLastActionTime(now);
    return true;
  };

  // Handle manual Email/Password sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkRateLimit()) return;
    if (!email || !password || !name) {
      setError('Please fill in all required fields (Name, Email, Password)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Update auth displayName
        await user.updateProfile({ displayName: name });

        // 2. Write custom profile record to Firebase RTDB
        const profilePayload = {
          id: user.uid,
          name: name,
          email: user.email || '',
          duprRating: Number(dupr) || 3.50,
          role: role,
          gender: gender,
          wins: 0,
          losses: 0,
          avatarColor: role === 'SuperAdmin' ? 'bg-indigo-500' : (role === 'CourtOwner' ? 'bg-amber-400' : 'bg-lime-400'),
          hometown: 'Dumaguete City',
          createdAt: new Date().toISOString()
        };

        await db.ref(`users/${user.uid}`).set(profilePayload);

        // Notify parent matching the success states
        onAuthSuccess(user, profilePayload);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err?.message || 'An error occurred during account creation');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual Email/Password sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkRateLimit()) return;
    if (!email || !password) {
      setError('Please fill in both Email and Password fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Fetch existing RTDB record to retrieve registered properties
        const snapshot = await db.ref(`users/${user.uid}`).once('value');
        let profile = snapshot.val();

        if (!profile) {
          // Fallback if record does not exist
          profile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Anonymous Athlete',
            email: user.email || '',
            duprRating: 3.50,
            role: 'Player',
            gender: 'Male',
            wins: 0,
            losses: 0,
            avatarColor: 'bg-lime-400',
            hometown: 'Dumaguete City',
            createdAt: new Date().toISOString()
          };
          await db.ref(`users/${user.uid}`).set(profile);
        }

        onAuthSuccess(user, profile);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err?.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generic Social Sign In (Google / Facebook)
  const handleOAuthSignIn = async (provider: any) => {
    if (!checkRateLimit()) return;
    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth.signInWithPopup(provider);
      const user = userCredential.user;

      if (user) {
        // Check if DB profile exists; write default if missing
        const snapshot = await db.ref(`users/${user.uid}`).once('value');
        let profile = snapshot.val();

        if (!profile) {
          profile = {
            id: user.uid,
            name: user.displayName || 'Social Athlete',
            email: user.email || '',
            duprRating: 3.50,
            role: 'Player',
            gender: 'Male',
            wins: 0,
            losses: 0,
            avatarColor: 'bg-lime-400',
            hometown: 'Dumaguete City',
            createdAt: new Date().toISOString()
          };
          await db.ref(`users/${user.uid}`).set(profile);
        }

        onAuthSuccess(user, profile);
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      if (err?.code === 'auth/unauthorized-domain' || (err?.message && (err.message.includes('auth/unauthorized-domain') || err.message.includes('unauthorized-domain')))) {
        setError('unauthorized-domain-error');
      } else {
        // Detail the error politely for the sandbox environment
        setError(err?.message || 'Authentication with social provider cancelled or blocked by the preview frame');
      }
    } finally {
      setLoading(false);
    }
  };

  // One-click helper presets to bypass domain authorized limitations instantly
  const handleQuickDemoLogin = async (presetRole: 'Player' | 'CourtOwner' | 'SuperAdmin') => {
    if (!checkRateLimit()) return;
    setLoading(true);
    setError(null);
    const presetEmails = {
      Player: 'player@pickletown.com',
      CourtOwner: 'owner@pickletown.com',
      SuperAdmin: 'admin@pickletown.com'
    };
    const presetNames = {
      Player: 'Demo Player (Athlete)',
      CourtOwner: 'Demo Facility Manager',
      SuperAdmin: 'PickleTown Director'
    };
    const presetDupr = {
      Player: 3.80,
      CourtOwner: 4.15,
      SuperAdmin: 4.90
    };
    const presetGenders = {
      Player: 'Male' as const,
      CourtOwner: 'Female' as const,
      SuperAdmin: 'Other' as const
    };

    const targetEmail = presetEmails[presetRole];
    const targetPassword = 'demo123456password';
    const targetName = presetNames[presetRole];

    try {
      let user;
      try {
        // Attempt fast sign-in with preset credentials
        const userCredential = await auth.signInWithEmailAndPassword(targetEmail, targetPassword);
        user = userCredential.user;
      } catch (signInErr: any) {
        // In case the credential doesn't exist on this Firebase project yet, register it dynamically!
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/wrong-password' || signInErr.message?.includes('user-not-found') || signInErr.message?.includes('wrong-password')) {
          const userCredential = await auth.createUserWithEmailAndPassword(targetEmail, targetPassword);
          user = userCredential.user;
          if (user) {
            await user.updateProfile({ displayName: targetName });
          }
        } else {
          throw signInErr;
        }
      }

      if (user) {
        const snapshot = await db.ref(`users/${user.uid}`).once('value');
        let profile = snapshot.val();
        if (!profile) {
          profile = {
            id: user.uid,
            name: targetName,
            email: targetEmail,
            duprRating: presetDupr[presetRole],
            role: presetRole,
            gender: presetGenders[presetRole],
            wins: presetRole === 'Player' ? 14 : (presetRole === 'CourtOwner' ? 8 : 22),
            losses: presetRole === 'Player' ? 9 : (presetRole === 'CourtOwner' ? 11 : 4),
            avatarColor: presetRole === 'SuperAdmin' ? 'bg-indigo-500' : (presetRole === 'CourtOwner' ? 'bg-amber-400' : 'bg-lime-400'),
            hometown: 'Dumaguete City',
            createdAt: new Date().toISOString()
          };
          await db.ref(`users/${user.uid}`).set(profile);
        }
        onAuthSuccess(user, profile);
      }
    } catch (err: any) {
      console.error('Quick sandbox preset error:', err);
      setError(err?.message || 'An error occurred during quick sandbox login. Please try creating a manual Email & Password instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md z-50">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 max-h-[92vh] overflow-y-auto"
        id="auth-ui-container"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 mb-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">🏓</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans uppercase">
            {isSignUp ? 'Create Athlete Account' : 'Sign In — PickleTown 6200'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-sans">
            {isSignUp ? 'Join Dumaguete communities & claim your live localized leaderboard ratings' : 'Access active pickleball courts, live game lobbies & clinic tracking'}
          </p>
        </div>

        {/* Local Error alert banner */}
        {error && (
          error === 'unauthorized-domain-error' ? (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
              <div className="flex gap-2 items-start mb-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-500 mt-0.5" />
                <span className="font-bold tracking-tight font-sans text-sm">Firebase Authorized Domain Needed</span>
              </div>
              <p className="font-sans leading-relaxed mb-3">
                This app runs in an isolated sandbox. To log in with <strong>Google/Facebook</strong>, Firebase requires authorizing the active domain:
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10.5px] select-all break-all mb-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                {window.location.hostname}
              </div>

              <h4 className="font-bold font-sans text-[11px] uppercase tracking-wider mb-1.5 text-amber-800 dark:text-amber-300">How to Fix in Firebase Console:</h4>
              <ol className="list-decimal list-inside space-y-1 font-sans text-[11px] text-slate-600 dark:text-slate-400 mb-4">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-600 dark:text-indigo-400">Firebase Console</a>.</li>
                <li>Go to <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong>.</li>
                <li>Click <strong>Add Domain</strong> and paste the host URL highlighted above.</li>
              </ol>

              <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-sans leading-relaxed font-semibold">
                ⚡ <strong>Immediate Workaround:</strong> You don't need to configure anything right now! Simply enter an <strong>Email &amp; Password</strong> in the form above and click <em>Register/Sign In</em> — it works instantly!
              </div>
            </div>
          ) : (
            <div className="mb-4.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-600 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-500" />
              <div className="font-sans leading-relaxed">{error}</div>
            </div>
          )
        )}

        {/* Input Forms */}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3.5">
          {/* Sign Up Specific Fields */}
          {isSignUp && (
            <>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-xs font-bold font-sans uppercase mb-1.5 label-id-name">
                  Full Athlete Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                    id="signup-name-input"
                  />
                </div>
              </div>

              {/* DUPR Rating, Athlete Role, & Gender Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-[10px] font-bold font-sans uppercase mb-1 label-id-dupr">
                    Init DUPR Rating
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="2.00"
                      max="8.00"
                      value={dupr}
                      onChange={(e) => setDupr(e.target.value)}
                      className="w-full text-xs py-2 pl-8.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-sans"
                      id="signup-dupr-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-[10px] font-bold font-sans uppercase mb-1">
                    Gender Mode
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-sans cursor-pointer"
                    id="signup-gender-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-[10px] font-bold font-sans uppercase mb-1">
                  Athlete System Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
                  {['Player', 'CourtOwner', 'SuperAdmin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r as any)}
                      className={`py-1 text-[10px] font-bold font-sans rounded-lg transition active:scale-95 text-center ${
                        role === r
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      id={`role-opt-${r}`}
                    >
                      {r === 'CourtOwner' ? 'Owner' : (r === 'SuperAdmin' ? 'Admin' : 'Player')}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Standard Email & Password fields */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-bold font-sans uppercase mb-1.5 label-id-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@domain.com"
                className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                id="auth-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-bold font-sans uppercase mb-1.5 label-id-password">
              Security Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full text-sm py-2.5 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
                id="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl text-center text-sm font-bold font-sans tracking-wide uppercase transition-all duration-200 ${
              loading 
                ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-650 text-white shadow-md shadow-emerald-500/10 active:scale-98 cursor-pointer'
            }`}
            id="auth-primary-submit-btn"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">⚙️</span>
                <span>Authenticating...</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create Athlete Profile' : 'Sign In Now'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className="relative px-3 text-[10px] font-bold font-sans text-slate-400 uppercase bg-white dark:bg-slate-900">
            or connect with
          </span>
        </div>

        {/* OAuth Social Buttons (Google and Facebook) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleOAuthSignIn(googleProvider)}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer text-xs font-semibold font-sans text-slate-700 dark:text-slate-300 active:scale-95 transition"
            id="google-signin-btn"
          >
            <span className="text-base">🌐</span>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn(facebookProvider)}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer text-xs font-semibold font-sans text-slate-700 dark:text-slate-300 active:scale-95 transition"
            id="facebook-signin-btn"
          >
            <span className="text-base text-blue-600 font-bold">f</span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Instant Sandbox Testing Presets */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-slate-800 dark:text-slate-100">
          <span className="block text-[10px] font-extrabold font-sans text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-center mb-2.5">
            ⚡ Instant Sandbox Presets (No Setup Required)
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Player')}
              disabled={loading}
              className="flex flex-col items-center justify-center py-2 px-1 bg-white dark:bg-slate-950 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition active:scale-95 group"
              id="sandbox-preset-player-btn"
            >
              <span className="text-base group-hover:scale-110 duration-200">🏃</span>
              <span className="font-extrabold text-[9px] mt-1 text-slate-700 dark:text-slate-300">Player</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('CourtOwner')}
              disabled={loading}
              className="flex flex-col items-center justify-center py-2 px-1 bg-white dark:bg-slate-950 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition active:scale-95 group"
              id="sandbox-preset-owner-btn"
            >
              <span className="text-base group-hover:scale-110 duration-200">👑</span>
              <span className="font-extrabold text-[9px] mt-1 text-slate-700 dark:text-slate-300">Court Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SuperAdmin')}
              disabled={loading}
              className="flex flex-col items-center justify-center py-2 px-1 bg-white dark:bg-slate-950 hover:bg-indigo-500/10 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition active:scale-95 group"
              id="sandbox-preset-admin-btn"
            >
              <span className="text-base group-hover:scale-110 duration-200">🛡️</span>
              <span className="font-extrabold text-[9px] mt-1 text-slate-700 dark:text-slate-300">Super Admin</span>
            </button>
          </div>
        </div>

        {/* Navigation toggle link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs font-bold font-sans text-emerald-600 dark:text-emerald-400 hover:underline hover:opacity-90 transition active:scale-95 focus:outline-none cursor-pointer"
            id="toggle-auth-mode-btn"
          >
            {isSignUp ? 'Already registered? Log in to your profile' : "Don't have an athlete account? Join here"}
          </button>
        </div>
      </div>
    </div>
  );
}
