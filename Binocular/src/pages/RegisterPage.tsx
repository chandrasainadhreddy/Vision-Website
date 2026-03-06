import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { registerUser } from '../services/authService'
export function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const { fullName, email, phone, password, confirmPassword } = formData

    // prevent submitting if we already know the email exists
    if (emailAvailable === true) {
      setError('Email already registered')
      return
    }

    // validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // password complexity: min 8, uppercase, lowercase, number, special
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!complexity.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await registerUser({
        name: fullName,
        email,
        phone,
        password,
        confirm_password: confirmPassword,
      })

      console.log('Register response', response)
      setSuccess('Registration successful — redirecting to login...')

      setTimeout(() => navigate('/login'), 1400)
    } catch (err: any) {
      console.error('Error registering', err)
      if (err.backendMessage) {
        // Message directly from Flask (e.g. "Email already exists", "Passwords do not match")
        setError(err.backendMessage)
      } else if (err.status === 409) {
        setError('Email already registered')
      } else if (err.message) {
        setError(`Registration failed: ${err.message}`)
      } else {
        setError('Network error while registering. Please check your connection and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkEmailAvailability = async (email: string) => {
    setError('')
    setEmailAvailable(null)
    if (!email) return
    setCheckingEmail(true)
    try {
      const res = await fetch(`http://127.0.0.1:5000/check-email?email=${encodeURIComponent(email)}`)
      if (!res.ok) {
        // endpoint might not exist; don't block registration based on this
        setCheckingEmail(false)
        return
      }
      const data = await res.json().catch(() => null)
      // expecting { exists: true } from backend when email is registered
      if (data && data.exists) {
        setEmailAvailable(true)
        setError('Email already registered')
      } else {
        setEmailAvailable(false)
      }
    } catch (err) {
      // ignore network errors for this optional check
      console.debug('Email check failed (non-blocking)', err)
    } finally {
      setCheckingEmail(false)
    }
  }
  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center p-4">
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
            Start Your Journey
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm text-base">
            Make better decisions with AI-powered insights and analysis for your eyes.
          </p>

          <div className="space-y-4">
            {/* Check Items */}
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Unlimited AI Assessments</h3>
                <p className="text-xs text-gray-500">Run tests anytime for your visual health</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Personalized Insights</h3>
                <p className="text-xs text-gray-500">AI monitors your performance and trends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">24/7 Availability</h3>
                <p className="text-xs text-gray-500">Get guidance whenever you need it</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Detailed Analytics</h3>
                <p className="text-xs text-gray-500">Track outcomes and optimize health</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Privacy First</h3>
                <p className="text-xs text-gray-500">Your data is encrypted and secure</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm text-gray-500">Start managing your vision health today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => checkEmailAvailability(formData.email)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {checkingEmail && <div className="text-xs text-gray-500 mt-1">Checking email...</div>}
              {emailAvailable && !checkingEmail && (
                <div className="text-xs text-red-600 mt-1">Email already registered</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 ml-1">Minimum 8 characters with letters and numbers</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" required />
                <span className="text-xs text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-70 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 mt-2"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
