import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';
import CONFIG from '../../config/config.js';

/**
 * 🎨 LOGIN PAGE - TEKACOM ULTRA MODERNE
 * Charte: violet #a34ee5, or #fec603, violet foncé #7828a8, noir #0a0a0a
 * Style: Glassmorphism + Gradient animations + Floating elements
 */

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('user', JSON.stringify({ username }));

        navigate('/dashboardAdmin');
      } else {
        setError(data.detail || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.log(err);
      setError("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Animated Background Effects - TEKACOM Colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7828a8]/20 rounded-full blur-3xl"></div>
        
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}
        ></div>

        {/* Animated gradient lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a34ee5]/30 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fec603]/30 to-transparent"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-[#a34ee5] rounded-full animate-pulse"></div>
        <div className="absolute top-[30%] right-[15%] w-3 h-3 bg-[#fec603] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-[#7828a8] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[40%] right-[10%] w-3 h-3 bg-[#a34ee5] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md z-10">
        
        {/* Outer glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] rounded-3xl blur-xl opacity-30 animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Card Container */}
        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#a34ee5]/30 overflow-hidden">
          
          {/* Top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8]"></div>

          {/* Content */}
          <div className="relative p-8 md:p-10">
            
            {/* Logo & Header */}
            <div className="text-center mb-10">
              {/* Animated Logo */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] to-[#fec603] blur-2xl rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#a34ee5] via-[#fec603] to-[#7828a8] rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-[#a34ee5]/50 transform hover:rotate-6 transition-transform duration-300">
                  <Shield className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#fec603] rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#0a0a0a]" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent">
                  TEKACOM
                </span>
              </h1>
              <p className="text-gray-400 text-sm font-semibold mb-4">Espace Administration</p>
              
              {/* Animated divider */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#a34ee5]"></div>
                <div className="w-2 h-2 bg-[#fec603] rounded-full animate-pulse"></div>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#a34ee5]"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 relative animate-shake">
                <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-2xl"></div>
                <div className="relative bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 text-sm font-bold mb-1">Erreur de connexion</p>
                      <p className="text-red-400/80 text-xs">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#a34ee5]" />
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  {/* Focus glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] rounded-2xl blur-lg opacity-0 ${focusedField === 'username' ? 'opacity-50' : 'group-hover:opacity-20'} transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-center">
                    {/* Icon container */}
                    <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-[#a34ee5] to-[#7828a8] rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    
                    <input
                      type="text"
                      className="w-full pl-16 pr-4 py-4 bg-[#41124f]/30 border-2 border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a34ee5] focus:bg-[#41124f]/50 transition-all duration-300 font-medium"
                      placeholder="admin@tekacom.gn"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-[#fec603]" />
                  Mot de passe
                </label>
                <div className="relative group">
                  {/* Focus glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r from-[#fec603] to-[#a34ee5] rounded-2xl blur-lg opacity-0 ${focusedField === 'password' ? 'opacity-50' : 'group-hover:opacity-20'} transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-center">
                    {/* Icon container */}
                    <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-[#fec603] to-[#a34ee5] rounded-xl flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="w-full pl-16 pr-14 py-4 bg-[#41124f]/30 border-2 border-[#fec603]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#fec603] focus:bg-[#41124f]/50 transition-all duration-300 font-medium"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    
                    {/* Toggle visibility */}
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      {passwordVisible ? (
                        <EyeOff className="w-5 h-5 text-[#fec603]" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-[#a34ee5]/30 bg-[#41124f]/30 flex items-center justify-center group-hover:border-[#a34ee5]/60 transition-all">
                    <div className="w-3 h-3 bg-[#a34ee5] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Se souvenir</span>
                </label>
                
                <a 
                  href="#" 
                  className="text-sm text-[#a34ee5] hover:text-[#fec603] font-semibold transition-colors duration-300 flex items-center gap-1 group"
                >
                  Mot de passe oublié ?
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="relative w-full group/btn overflow-hidden mt-8"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] opacity-100 group-hover/btn:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7828a8] via-[#a34ee5] to-[#fec603] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] to-[#fec603] blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-black text-lg shadow-2xl border-2 border-white/20 group-hover/btn:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white">CONNEXION...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 text-white" />
                      <span className="text-white">SE CONNECTER</span>
                      <ArrowRight className="w-6 h-6 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-[#a34ee5]/20">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#41124f]/30 border border-[#a34ee5]/30 rounded-full">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-xs font-semibold">Connexion sécurisée SSL</span>
                </div>
              </div>
              
              {/* Version */}
              <div className="text-center mt-4">
                <p className="text-gray-600 text-xs font-medium">
                  TEKACOM Admin v2.0 • © 2026
                </p>
              </div>
            </div>
          </div>

          {/* Bottom accent gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7828a8] via-[#a34ee5] to-[#fec603]"></div>
        </div>
      </div>

      {/* Animated CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;