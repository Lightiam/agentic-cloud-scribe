
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BackendStatus from '../BackendStatus';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#181d35] rounded-xl p-6 w-full max-w-md relative border border-[#2f396a]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-[#21284a] rounded-xl flex items-center justify-center text-white hover:bg-[#2f396a] z-10"
        >
          ×
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[#8e99cc]">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join us to start deploying infrastructure'
            }
          </p>
        </div>

        <BackendStatus />

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        
        <div className="mt-6 text-center">
          <p className="text-[#8e99cc]">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#607afb] hover:text-[#4a62d3] font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
