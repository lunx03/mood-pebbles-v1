
import React, { useState } from 'react';
import { User } from '../types';
import Pebble from '../components/Pebble';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const AuthView: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const users = JSON.parse(localStorage.getItem('moodpebbles_mock_users') || '{}');
    
    if (mode === 'signup') {
      if (users[email]) {
        setError('An account with this email already exists.');
        setIsLoading(false);
        return;
      }
      // Save mock user
      users[email] = password;
      localStorage.setItem('moodpebbles_mock_users', JSON.stringify(users));
    } else {
      // Check password
      if (!users[email]) {
        setError('No account found. Try creating one?');
        setIsLoading(false);
        return;
      }
      if (users[email] !== password) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: email.split('@')[0],
    };
    
    setIsLoading(false);
    onLogin(mockUser);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Enter your email first to recover your key.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('moodpebbles_mock_users') || '{}');
    if (users[email]) {
      setMessage(`A reminder of your key has been sent to ${email}. (Simulated: your password is ${users[email]})`);
    } else {
      setError('No sanctuary found with this email.');
    }
    
    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] opacity-20 floating">
           <Pebble color="#a3ad8b" shapeClass="organic-shape-1" finish="polished" size="lg" />
        </div>
        <div className="absolute bottom-[15%] right-[10%] opacity-20 floating" style={{ animationDelay: '1s' }}>
           <Pebble color="#EA7B30" shapeClass="organic-shape-5" finish="matte" size="lg" />
        </div>
        <div className="absolute top-[40%] right-[-5%] opacity-10 floating" style={{ animationDelay: '2s' }}>
           <Pebble color="#B5A3D3" shapeClass="organic-shape-6" finish="textured" size="xl" />
        </div>
      </div>

      <header className="text-center mb-12 z-10 animate-fade-in">
        <h1 className="font-display text-5xl tracking-tight text-primary dark:text-gray-100">Moodpebbles</h1>
      </header>

      <div className="w-full max-w-sm z-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass bg-white/60 dark:bg-zinc-900/60 border border-white dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          
          {mode !== 'forgot' ? (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] tracking-wider font-bold text-muted ml-4">Email address</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/80 dark:bg-black/40 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-action/50 dark:text-white placeholder:text-muted/30 font-sans"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] tracking-wider font-bold text-muted ml-4">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/80 dark:bg-black/40 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-action/50 dark:text-white placeholder:text-muted/30 font-sans"
                    placeholder="••••••••"
                  />
                </div>

                {mode === 'signup' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-[11px] tracking-wider font-bold text-muted ml-4">Confirm password</label>
                    <input 
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/80 dark:bg-black/40 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-action/50 dark:text-white placeholder:text-muted/30 font-sans"
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-[10px] text-red-500 font-bold tracking-widest text-center">{error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary dark:bg-zinc-800 text-white font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="text-sm tracking-wide">
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                  </span>
                )}
              </button>

              <div className="flex flex-col items-center gap-4 mt-4">
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="text-[11px] font-bold text-primary/70 dark:text-white/70 hover:text-action transition-colors"
                >
                  {mode === 'signin' ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                </button>
                
                {mode === 'signin' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold text-muted/60 hover:text-action transition-colors"
                  >
                    Forgot your key?
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-8 py-4">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-action/20 rounded-full flex items-center justify-center mx-auto text-action">
                   <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-serif italic leading-relaxed">
                  {message || "We can send a reminder of your key to your email."}
                </p>
                
                {!message && (
                  <div className="space-y-2 text-left">
                    <label className="text-[11px] tracking-wider font-bold text-muted ml-4">Email address</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/80 dark:bg-black/40 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-action/50 dark:text-white placeholder:text-muted/30 font-sans"
                      placeholder="your@email.com"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-[10px] text-red-500 font-bold tracking-widest text-center">{error}</p>}

              <div className="space-y-3">
                {!message && (
                  <button 
                    onClick={handleForgot}
                    disabled={isLoading}
                    className="w-full py-4 bg-primary dark:bg-zinc-800 text-white font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="text-sm tracking-wide">Send reminder</span>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => { setMode('signin'); setMessage(''); setError(''); }}
                  className="w-full py-4 border-2 border-primary/20 dark:border-white/10 text-primary dark:text-white font-bold rounded-full hover:bg-black/5 transition-all text-xs tracking-wide"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-16 z-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-2 opacity-40">
           <div className="w-1 h-1 rounded-full bg-primary dark:bg-white" />
           <div className="w-1 h-1 rounded-full bg-primary dark:bg-white" />
        </div>
      </footer>
    </div>
  );
};

export default AuthView;
