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
      title: 'SAUBHAGYA Admin Dashboard',
      subtitle: 'Biogas Management & Rural Energy Distribution',
      phone: 'Phone Number',
      password: 'Password',
      login: 'Login',
      loading: 'Logging in...',
      phonePlaceholder: 'Enter your phone number',
      passwordPlaceholder: 'Enter your password'
    },
    hi: {
      title: 'सौभाग्य एडमिन डैशबोर्ड',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t.phone}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.loading : t.login}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p><strong>Demo Credentials:</strong></p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <p><strong>Field Worker:</strong> +919876543210</p>
            <p><strong>Cluster Mgr:</strong> +918765432109</p>
            <p><strong>CBG Sales:</strong> +917654321098</p>
            <p><strong>Admin:</strong> +915432109876</p>
            <p><strong>Purification:</strong> +913210987654</p>
            <p><strong>Transport:</strong> +912109876543</p>
            <p><em>Password for all: password123</em></p>
          </div>
        </div>
      </div>
    </div>
  )
}
