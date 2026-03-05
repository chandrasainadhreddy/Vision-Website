import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Download,
  TrendingUp,
  Activity,
  Target,
  Home,
  AlertCircle,
} from 'lucide-react'

const testDescriptions = {
  VRG: {
    name: 'Quick Screening',
    color: 'green',
    severity: {
      Normal: 'Your binocular coordination is healthy.',
      'Mild Issue': 'Minor eye coordination mismatch detected.',
      'Needs Attention': 'Significant binocular coordination issue detected.',
    },
  },
  PUR: {
    name: 'Full Assessment',
    color: 'blue',
    severity: {
      Normal: 'Your eye movement control is within normal limits.',
      'Mild Issue': 'Minor delay observed during rapid eye movements.',
      'Needs Attention': 'Reduced eye movement control detected.',
    },
  },
  RAN: {
    name: 'Fixation Test',
    color: 'purple',
    severity: {
      Normal: 'Your gaze stability is normal.',
      'Mild Issue': 'Slight eye drift detected during fixation.',
      'Needs Attention': 'Poor fixation stability detected.',
    },
  },
}

const severityColors = {
  Normal: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-100' },
  'Mild Issue': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100',
  },
  'Needs Attention': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    badge: 'bg-red-100',
  },
}

const testColors = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
}

export function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const retryRef = useRef(0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let testId = params.get('test_id')

    // Try reading from location state if URL param is missing
    const state = location.state as { testId?: string | number, testType?: string } | null
    if (!testId && state?.testId) {
      testId = String(state.testId)
    }

    if (!testId) {
      console.warn('ResultsPage: No test_id found in URL or State')
      navigate('/dashboard')
      return
    }

    const fetchResult = async () => {
      try {
        console.log(`[Results] Fetching for test_id: ${testId} (Attempt: ${retryRef.current + 1})`)
        const res = await fetch(`http://127.0.0.1:5000/get_result?test_id=${testId}`)

        if (!res.ok) throw new Error('Network response was not ok')

        const data = await res.json()
        if (data.status) {
          // Tolerate both app.py formats (wrapped "data" or root level parameters)
          const resultData = data.data || data

          setResult({
            test_type: (resultData.test_type || state?.testType || 'PUR').toUpperCase(),
            severity: resultData.classification || resultData.severity || 'Normal',
            score: resultData.percentage || resultData.score || 0,
            stability: resultData.stability || 0,
            tracking: resultData.tracking || 0,
            accuracy: resultData.accuracy || 0,
            reaction: resultData.reaction || 0,
            ai_notes: resultData.ai_notes || 'Analysis completed successfully. Your visual capabilities follow standard patterns.',
          })
          setLoading(false)
          setError(null)
        } else {
          // If not ready, retry up to 5 times
          if (retryRef.current < 5) {
            retryRef.current += 1
            console.log('[Results] Not ready, retrying in 2 seconds...')
            setTimeout(fetchResult, 2000)
          } else {
            setLoading(false)
            setError(data.message || data.error || 'Analysis results are still being processed.')
          }
        }
      } catch (err: any) {
        console.error('[Results] Error:', err)
        setLoading(false)
        setError('Connection error while loading results.')
      }
    }

    fetchResult()
  }, [location, navigate])

  if (loading) {
    const params = new URLSearchParams(window.location.search)
    const debugId = params.get('test_id') || ((window as any).state && (window as any).state.testId)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your results...</p>
          {debugId && <p className="text-xs text-gray-400 mt-2">test id: {debugId}</p>}
        </div>
      </div>
    )
  }

  if (error) {
    const params = new URLSearchParams(location.search)
    const debugId = params.get('test_id')
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Delayed</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          {debugId && <div className="text-xs font-mono text-gray-400 mb-8 bg-gray-50 p-3 rounded-2xl">Ref ID: {debugId}</div>}
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-3xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              Retry Loading Results
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!result)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No result data available for this test.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )

  const { test_type, severity, score, stability, tracking, reaction, accuracy, ai_notes } = result
  const testConfig = (testDescriptions as any)[test_type] || testDescriptions.PUR
  const severityColor = (severityColors as any)[severity] || severityColors.Normal

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
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
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
            onClick={() => {
              localStorage.removeItem('user_id');
              localStorage.removeItem('user');
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          <p className="text-sm text-gray-600">
            Your comprehensive vision assessment report
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Score Circle */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={
                        severity === 'Normal'
                          ? '#10b981'
                          : severity === 'Mild Issue'
                            ? '#f59e0b'
                            : '#ef4444'
                      }
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${score * 5.53} 553`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-5xl font-bold text-gray-900">{score}%</p>
                      <p className="text-sm text-gray-500 mt-1">Score</p>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {test_type} Test - {testConfig.name}
                </h2>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${severityColor.badge} ${severityColor.text}`}
                >
                  {severity === 'Normal' && '✓'} {severity}
                </span>
              </div>
            </div>

            {/* Test Description */}
            <div className={`rounded-2xl p-6 shadow-sm border border-gray-200 mb-8 ${(testColors as any)[testConfig.color]}`}>
              <p className="text-lg font-semibold">
                {testConfig.severity[severity]}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stability</p>
                    <p className="text-2xl font-bold text-gray-900">{stability}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${stability}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tracking</p>
                    <p className="text-2xl font-bold text-gray-900">{tracking}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{
                      width: `${tracking}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reaction</p>
                    <p className="text-2xl font-bold text-gray-900">{reaction}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${reaction}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Accuracy</p>
                    <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${accuracy}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* AI Notes */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI Analysis Notes
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {ai_notes}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                <Download className="w-5 h-5" />
                Download Report (PDF)
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
