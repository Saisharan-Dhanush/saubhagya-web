import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(phone, password)
      // Redirect to dashboard after successful login
      console.log('Login successful, redirecting to dashboard')
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const translations = {
    en: {
      title: 'SAUBHAGYA',
      subtitle: 'Biogas Management & Rural Energy Distribution',
      phone: 'Phone Number',
      password: 'Password',
      login: 'Login',
      loading: 'Logging in...',
      phonePlaceholder: 'Enter your phone number',
      passwordPlaceholder: 'Enter your password'
    },
    hi: {
      title: 'सौभाग्य',
      subtitle: 'बायोगैस प्रबंधन और ग्रामीण ऊर्जा वितरण',
      phone: 'फ़ोन नंबर',
      password: 'पासवर्ड',
      login: 'लॉगिन',
      loading: 'लॉगिन हो रहा है...',
      phonePlaceholder: 'अपना फ़ोन नंबर दर्ज करें',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें'
    }
  }

  const t = translations[language]

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {/* Wide panoramic pastoral landscape with cows */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2560&q=80"), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"), url("https://images.unsplash.com/photo-1595058542840-20d2ce4e77f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"), linear-gradient(135deg, #22c55e 0%, #059669 100%)`
          }}
        ></div>

        {/* Balanced natural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-blue-900/70 to-emerald-900/75 z-10"></div>

        {/* Additional texture overlay */}
        <div
          className="absolute inset-0 opacity-20 z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Subtle natural floating animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft natural orbs */}
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/5 w-48 h-48 bg-slate-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-teal-400/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/6 right-1/3 w-40 h-40 bg-cyan-400/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '6s'}}></div>

          {/* Floating particles */}
          <div className="absolute top-1/5 left-3/4 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-blue-300/40 rounded-full animate-bounce" style={{animationDelay: '3s', animationDuration: '4s'}}></div>
          <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 bg-teal-300/35 rounded-full animate-bounce" style={{animationDelay: '5s', animationDuration: '3.5s'}}></div>
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 border border-white/30 p-1">
                {/* Your Original Dhanush Logo */}
                <img
                  src="/images/dhanush_group_logo.jpg"
                  alt="Dhanush Group Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 w-28 h-28 border-2 border-white/20 rounded-2xl animate-ping"></div>
              <div className="absolute inset-2 w-24 h-24 border border-white/10 rounded-xl animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-white/90 text-lg mb-8 drop-shadow">
            {t.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              {t.phone}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? t.loading : t.login}
          </button>
        </form>

      </div>
    </div>
  )
}
