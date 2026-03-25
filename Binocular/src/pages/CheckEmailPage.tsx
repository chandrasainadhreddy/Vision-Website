import React, { useState } from 'react'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export const CheckEmailPage = () => {
  const navigate = useNavigate()
  const [isResent, setIsResent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const handleResendEmail = () => {
    navigate(-1 as any)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              {isResent ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <Mail className="w-10 h-10 text-indigo-600" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isResent ? 'Email Sent!' : 'Check Your Email'}
          </h1>

          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed">
            {isResent
              ? 'A new password reset link has been sent to your email address.'
              : "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
          </p>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200 mb-4"
          >
            <RefreshCw className="w-4 h-4" />
            Resend Email
          </button>

          {/* Back to Login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-indigo-600 font-medium rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Didn't receive the email? Check your spam folder or try a different
          email address.
        </p>
      </div>
    </div>
  )
}
