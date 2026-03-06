import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, ArrowLeft, Target, Bot, Activity, Mail, Lock } from 'lucide-react'
import { loginUser } from '../services/authService'
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const response = await loginUser({ email, password })
      console.log('Login response', response)

      // ✅ Store user_id — Flask returns { status: true, user_id: 123 }
      const userId = response.user_id
      if (userId !== undefined) {
        localStorage.setItem('user_id', String(userId))
      }

      // ✅ Fetch and cache the full profile so all pages have it instantly
      if (userId !== undefined) {
        try {
          const profileRes = await fetch(
            `http://127.0.0.1:5000/profile?user_id=${encodeURIComponent(userId)}`
          )
          const profileData = await profileRes.json()
          if (profileData.status && profileData.user) {
            localStorage.setItem('user', JSON.stringify(profileData.user))
          }
        } catch {
          // non-blocking — profile will be loaded lazily by settings page
        }
      }

      navigate('/dashboard')
    } catch (err: any) {
      console.error('Login error', err)
      if (err.backendMessage) {
        setError(err.backendMessage)
      } else if (err.message) {
        setError(`Login failed: ${err.message}`)
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex flex-col items-center justify-center p-4">
      <div className="max-w-[1000px] w-full flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center">

        {/* LEFT SIDE BLOCK */}
        <div className="flex-1 w-full max-w-md hidden md:flex flex-col">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">VisionAI</h2>
              <p className="text-sm text-gray-500 leading-tight">Vision Assessment System</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm text-sm">
            Continue exploring your vision health possibilities with AI-powered assessment and analysis.
          </p>

          <div className="space-y-4">
            {/* Card 1 */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Track Your Progress</h3>
                <p className="text-xs text-gray-500">Monitor improvements across all vision tests</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">AI-Powered Insights</h3>
                <p className="text-xs text-gray-500">Get personalized recommendations daily</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Detailed Analytics</h3>
                <p className="text-xs text-gray-500">Visualize your eye health patterns</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-10 border border-gray-100">

          <div className="md:hidden block mb-6">
            <button onClick={() => navigate('/')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Log In</h2>
            <p className="text-sm text-gray-500">Access your vision assessment account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-70 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 mt-4"
            >
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
