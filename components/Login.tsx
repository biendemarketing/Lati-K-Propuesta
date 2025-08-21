
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { login, sendPasswordResetEmail } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    const { success, error: loginError } = await login(email, password);
    setLoading(false);
    if (!success) {
      if (loginError === 'Invalid login credentials') {
        setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      } else {
        setError(loginError || 'An unknown error occurred.');
      }
    } else {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      closeModal(); // Close modal on successful login
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Por favor, introduce tu email para restablecer la contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    setResetMessage('');
    const { success, error: resetError } = await sendPasswordResetEmail(email);
    setLoading(false);

    if (!success) {
      setError(resetError || 'Ocurrió un error desconocido.');
    } else {
      setResetMessage('Si existe una cuenta, se ha enviado un enlace para restablecer la contraseña.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: isShaking ? [0, -8, 8, -8, 8, -4, 4, 0] : 0,
        }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          default: { duration: 0.3, ease: 'easeOut' },
          x: { duration: 0.4, ease: 'easeInOut' }
        }}
      >
        <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
          <X size={24}/>
        </button>

        <div className="text-center mb-8">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/drossmediapro.appspot.com/o/logo%20lati%20actual%202023%20(2)-04.png?alt=media&token=6a2bb838-c3a1-4162-b438-603bd74d836a" 
              alt="Lati K Publicidad Logo" 
              className="w-64 mx-auto"
            />
        </div>
        <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-400 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6 flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-slate-300">
                Recordar email
              </label>
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="font-medium text-[var(--color-primary)] hover:opacity-80"
              disabled={loading}
            >
              ¿Olvidaste la contraseña?
            </button>
          </div>
          {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
          {resetMessage && <p className="text-green-400 text-center text-sm mb-4">{resetMessage}</p>}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
