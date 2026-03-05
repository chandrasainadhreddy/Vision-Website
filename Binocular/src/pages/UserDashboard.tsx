import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Activity,
  CheckCircle,
  User,
  Mail,
  Phone,
} from 'lucide-react'

export function UserDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfilePanel, setShowProfilePanel] = useState(false)

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // ── Sync user data from localStorage automatically ──────────────────────────
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to sync user storage', e)
      }
    }

    // Listen for storage changes in OTHER tabs/windows
    window.addEventListener('storage', handleStorageChange)

    // Also check on a small interval or when the window gets focus for local-tab changes
    // (React doesn't trigger 'storage' event for changes in the SAME window)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const userData = {
    id: localStorage.getItem('user_id') || user?.id || '',
    name: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    initials: (user?.name || 'U')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  }

  // ── Dashboard stats from backend ────────────────────────────────────────────
  const [dashData, setDashData] = useState<{
    latest_test: { percentage: number; classification: string; test_type: string; started_at: string } | null
    recent_tests: { test_id: number; test_type: string; started_at: string; percentage: number; classification: string }[]
    total_tests: number
  }>({ latest_test: null, recent_tests: [], total_tests: 0 })
  const [loadingDash, setLoadingDash] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = userData.id || localStorage.getItem('user_id')
        if (!userId) {
          setLoadingDash(false)
          return
        }
        
        // Fetch dashboard data (recent tests + latest test)
        const dashResponse = await fetch(`http://127.0.0.1:5000/home_dashboard?user_id=${encodeURIComponent(userId)}`)
        const dashData = await dashResponse.json()
        
        // Fetch full history to get accurate total count
        const historyResponse = await fetch(`http://127.0.0.1:5000/history?user_id=${encodeURIComponent(userId)}`)
        const historyData = await historyResponse.json()
        
        if (dashData.status === true || dashData.status === 'success') {
          const totalTestsCount = Array.isArray(historyData.history) ? historyData.history.length : 0
          
          setDashData({
            latest_test: dashData.latest_test || null,
            recent_tests: Array.isArray(dashData.recent_tests) ? dashData.recent_tests : [],
            total_tests: totalTestsCount,
          })
        } else {
          console.warn('Dashboard API returned status:', dashData.status)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoadingDash(false)
      }
    }

    fetchDashboardData()
  }, [userData.id])

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user')
    navigate('/')
  }

  const classColor = (cls: string) => {
    if (cls === 'Normal') return 'bg-green-100 text-green-700'
    if (cls === 'Mild Issue') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }


  return (
    <div className="min-h-screen w-full bg-gray-50 flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Eye className="w-6 h-6" />
            VisionAI
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/take-test')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FlaskConical className="w-5 h-5" />
            Take Test
          </button>
          <button
            onClick={() => navigate('/history')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <History className="w-5 h-5" />
            Test History
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {userData.name.split(' ')[0]}!
            </p>
          </div>
          <button
            onClick={() => setShowProfilePanel(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {userData.name}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {userData.initials}
            </div>
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100">

          {/* HERO SECTION */}
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-10 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-3">
                  Start Your Vision Assessment
                </h2>
                <p className="text-indigo-100 mb-6">
                  Monitor and improve your cognitive vision performance with AI analysis.
                </p>
                <button
                  onClick={() => navigate('/take-test')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform"
                >
                  Start Test
                </button>
              </div>

              <FlaskConical className="w-24 h-24 opacity-20" />
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Total Tests */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-indigo-600 text-sm font-semibold">
                  {loadingDash ? '…' : `${dashData.total_tests} total`}
                </span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900">
                {loadingDash ? '—' : dashData.total_tests}
              </h3>
              <p className="text-sm text-gray-500">Total Tests Completed</p>
            </div>

            {/* Latest Score */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                {dashData.latest_test && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classColor(dashData.latest_test.classification)}`}>
                    {dashData.latest_test.classification}
                  </span>
                )}
              </div>
              <h3 className="text-4xl font-bold text-gray-900">
                {loadingDash ? '—' : dashData.latest_test ? `${dashData.latest_test.percentage}%` : 'N/A'}
              </h3>
              {dashData.latest_test && (
                <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dashData.latest_test.percentage}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">Latest Percentage</p>
            </div>

            {/* Last Assessment */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-teal-600 text-sm font-semibold">Recent</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {loadingDash ? '—' : dashData.latest_test
                  ? new Date(dashData.latest_test.started_at).toLocaleDateString()
                  : 'No tests yet'}
              </h3>
              <p className="text-sm text-gray-500">Last Assessment</p>
            </div>
          </div>

          {/* Recent Tests */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Tests
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View All →
              </button>
            </div>

            <div className="space-y-6">
              {loadingDash ? (
                <p className="text-center text-gray-400 py-8">Loading tests…</p>
              ) : dashData.recent_tests.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No tests taken yet. Take your first test!</p>
              ) : (
                dashData.recent_tests.map((test) => (
                  <div
                    key={test.test_id}
                    className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {test.test_type.toUpperCase()} Test
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(test.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{test.percentage}%</p>
                        <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${classColor(test.classification)}`}>
                          {test.classification}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${test.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </main>
      </div>

      {/* Profile Panel Slide-over - with visible dashboard background */}
      {showProfilePanel && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowProfilePanel(false)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                <button
                  onClick={() => setShowProfilePanel(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Profile Header */}
              <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl p-6 text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl font-bold">
                  {userData.initials}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {userData.name}
                </h3>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">Account Details</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        {userData.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-800">
                        {userData.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowProfilePanel(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
