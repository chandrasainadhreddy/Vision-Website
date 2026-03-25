import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UserDashboard } from './pages/UserDashboard'
import { TakeTestPage } from './pages/TakeTestPage'
import { ResultsPage } from './pages/ResultsPage'
import { TestHistoryPage } from './pages/TestHistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { CheckEmailPage } from './pages/CheckEmailPage'
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/take-test" element={<TakeTestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<TestHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
