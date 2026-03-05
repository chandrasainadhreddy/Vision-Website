import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-2">
            <Eye className="w-8 h-8" />
            VisionAI
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Start your vision assessment journey today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{success}</div>
            )}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  onBlur={() => checkEmailAvailability(formData.email)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                {checkingEmail && <div className="text-xs text-gray-500 mt-1">Checking email...</div>}
                {emailAvailable && !checkingEmail && (
                  <div className="text-xs text-red-600 mt-1">Email already registered</div>
                )}
              </div>
            </div>

            {/* phone number field added below email */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="(123) 456-7890"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">

              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: 'user',
                    })
                  }
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${formData.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
              
                </button> */}
                {/* <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: 'doctor',
                    })
                  }
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${formData.role === 'doctor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  
                </button> */}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
