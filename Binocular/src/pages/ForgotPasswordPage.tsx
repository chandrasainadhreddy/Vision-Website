import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, MailIcon } from 'lucide-react'
import { forgotPassword } from '../services/authService'
export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await forgotPassword(email)
      navigate('/check-email', { state: { email } })
    } catch (err: any) {
      setError(err.backendMessage || err.message || 'Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        {/* Back to Login */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Login
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <MailIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm text-blue-500 leading-relaxed">
            Enter your email address and we'll send
            <br />
            you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-sm transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Remember your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
