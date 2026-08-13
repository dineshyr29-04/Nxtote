import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authprovider";  
import api from "../api/axios";
import Toast from "../components/Toastnotification";
function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const { loginUser } = useAuth();
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Email and Password needed");
    }
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await api.post("/auth/signup", { name,email, password });
        //sending them to signin page
        setIsSignUp(false);
        setToast({ show: true, message: "Signup successful! Please log in.", type: "success" });
      } else {
        //sendind login request to express through /auth/login
        const response = await api.post("/auth/login", { email, password });
        const data = response.data;

        const token = data.data.session?.access_token || data.user?.token;
        loginUser(token, email, name || "User");
      
        navigate("/home");
      }
    } catch (err) {
      console.error("Auth Error:", err);

      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginUser("guest_token", "dineshyr2904@gmail.com", "Dinesh");
      navigate("/home");
    }, 1000);
};

  // Basic password strength checker
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* 🔮 Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/20 blur-[120px] pointer-events-none animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-fuchsia-600/20 blur-[130px] pointer-events-none animate-pulse duration-3000"></div>

      {/* 🪟 Interactive Glassmorphism Form Card */}
      <div className="relative w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl shadow-violet-500/5 overflow-hidden transition-all duration-300">
        
        {/* Decorative top accent line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            {isSignUp ? "Join the single-user workspace workspace" : "Please enter your credentials"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          {/* Name Field (Sign Up Only) */}
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-fuchsia-500/50 text-sm transition text-slate-200"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-fuchsia-500/50 text-sm transition text-slate-200"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Password</label>
              {!isSignUp && (
                <a href="#forgot" className="text-[10px] text-fuchsia-400 hover:text-fuchsia-300 font-medium">Forgot?</a>
              )}
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-fuchsia-500/50 text-sm transition text-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password Strength Meter (Sign Up Only) */}
          {isSignUp && password && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>Password Strength</span>
                <span className={
                  strength === 4 ? "text-emerald-400" :
                  strength >= 2 ? "text-amber-400" : "text-rose-400"
                }>
                  {strength === 4 ? "Very Strong" :
                   strength >= 2 ? "Moderate" : "Weak"}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full flex gap-1 overflow-hidden">
                <div className={`h-full flex-1 transition-all duration-300 ${strength >= 1 ? 'bg-rose-500' : 'bg-transparent'}`}></div>
                <div className={`h-full flex-1 transition-all duration-300 ${strength >= 2 ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                <div className={`h-full flex-1 transition-all duration-300 ${strength >= 3 ? 'bg-amber-400' : 'bg-transparent'}`}></div>
                <div className={`h-full flex-1 transition-all duration-300 ${strength === 4 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
              </div>
            </div>
          )}
          {error && (
            <div className="test-xs text-rose-400 bg-rose-700 border border-rose-300 p-3 rounded-xs"> {error} </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-fuchsia-500/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>{isSignUp ? "Create Account" : "Access Workspace"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="grow border-t border-slate-800"></div>
          <span className="shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-wider">or</span>
          <div className="grow border-t border-slate-800"></div>
        </div>

        {/* Guest access option */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full py-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          🔑 Continue as Guest
        </button>

        {/* Switch Card Modes (Login <-> Sign Up) */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-fuchsia-400 font-medium transition"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>

      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default Login;
