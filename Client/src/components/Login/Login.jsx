import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import CONFIG from '../../config/config.js';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(CONFIG.API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem(
          'user',
          JSON.stringify({ username: data.username, role: data.role })
        );

        // redirection selon rôle
        if (data.role === 'admin') navigate('/dashboardAdmin');
        else navigate('/dashboardAdmin');
      } else {
        setError(data.detail || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.log(err);
      setError('Impossible de se connecter au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-[#a34ee5]/30">
          
          <div className="text-center mb-8">
            <div className="inline-block mb-4 p-4 bg-gradient-to-br from-[#a34ee5] to-[#fec603] rounded-xl shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">SantaStyle</h1>
            <p className="text-gray-400 text-sm">Espace Administration</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-gray-300 text-sm font-bold flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#a34ee5]" /> Nom d'utilisateur
              </label>
              <input
                type="text"
                placeholder="admin@santastyle.gn"
                className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 border border-[#a34ee5]/30 focus:outline-none focus:border-[#a34ee5]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-300 text-sm font-bold flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-[#fec603]" /> Mot de passe
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 border border-[#fec603]/30 focus:outline-none focus:border-[#fec603]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {passwordVisible ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] text-white font-bold shadow-lg disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;