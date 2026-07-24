import React, { useState } from 'react';
import { Mail, Lock, User, Shield, CheckCircle, ArrowRight, Save, Phone } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserType, autoSave: boolean) => void;
  usersList: UserType[];
  onRegisterUser: (newUser: UserType) => void;
  onCancel: () => void;
  isCheckoutRedirect?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  usersList,
  onRegisterUser,
  onCancel,
  isCheckoutRedirect,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Customer' | 'Admin'>('Customer');
  const [autoSave, setAutoSave] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (isRegister && (!fullName || !phone))) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isRegister) {
      // Check if user already exists
      const exists = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser: UserType = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        role: 'Customer',
        password: password,
        phone: phone.trim(),
      };

      onRegisterUser(newUser);
      setSuccess('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(newUser, autoSave);
      }, 1200);
    } else {
      // Login attempt
      const foundUser = usersList.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        setError('Invalid email or password combination.');
        return;
      }

      setSuccess(`Welcome back, ${foundUser.fullName}! Redirecting...`);
      setTimeout(() => {
        onLoginSuccess(foundUser, autoSave);
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-emerald-100 rounded-3xl p-8 shadow-md relative overflow-hidden animate-fadeIn text-emerald-950">
      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {isCheckoutRedirect && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 space-y-1 text-center">
          <p className="text-xs font-black uppercase text-amber-950 font-mono flex items-center justify-center gap-1.5">
            <span>🔐 LOGIN REQUIRED TO ORDER</span>
          </p>
          <p className="text-[10px] text-amber-900 font-bold leading-normal font-sans">
            You must sign in or register with your email to proceed to checkout and place your order.
          </p>
        </div>
      )}

      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <span className="h-1.5 w-8 bg-emerald-800 rounded-full inline-block" />
        <h2 className="text-2xl font-black uppercase tracking-tight font-sans text-emerald-950">
          {isRegister ? 'Create Your Account' : 'Sign In To Jersey Addicts BD'}
        </h2>
        <p className="text-xs text-emerald-700 font-mono">
          {isRegister ? 'Join the authentic football jersey community' : 'Access custom locker, orders, and dashboard'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3.5 rounded-xl mb-6 text-center font-semibold font-mono">
          ⚠ {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl mb-6 text-center font-bold font-mono">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name field (Register only) */}
        {isRegister && (
          <div className="space-y-1.5">
            <label className="text-[10px] text-emerald-700 font-mono block uppercase">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. David Beckham"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-emerald-100 rounded-xl py-3 pl-11 pr-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            </div>
          </div>
        )}

        {/* Mobile Number Field (Register only) */}
        {isRegister && (
          <div className="space-y-1.5">
            <label className="text-[10px] text-emerald-700 font-mono block uppercase">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="e.g. 01840990700"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-emerald-100 rounded-xl py-3 pl-11 pr-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-emerald-700 font-mono block uppercase">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-3 pl-11 pr-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-emerald-700 font-mono block uppercase">Secret Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-3 pl-11 pr-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isRegister ? 'Create Account' : 'Sign In'}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Switch Form Trigger */}
      <div className="mt-8 border-t border-emerald-100 pt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setSuccess('');
          }}
          className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline transition-colors"
        >
          {isRegister ? 'Already have an ID? Login' : 'New Collector? Create ID Password'}
        </button>
      </div>

      {/* Close button */}
      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="text-[10px] font-mono text-emerald-700 hover:text-emerald-950 uppercase tracking-wider cursor-pointer"
        >
          Browse Anonymously
        </button>
      </div>
    </div>
  );
};
