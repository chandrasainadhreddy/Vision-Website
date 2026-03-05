import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export function TestHistoryPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [testHistory, setTestHistory] = useState<any[]>([])
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/history?user_id=${userId}`)
        const data = await res.json()
        if (data.status) {
          setTestHistory(data.history)
        }
      } catch (err) {
        console.error('History fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [userId, navigate])

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Normal':
        return 'bg-green-100 text-green-800'
      case 'Mild Issue':
        return 'bg-orange-100 text-orange-800'
      case 'Needs Attention':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredHistory = testHistory.filter((test) => {
    const searchLow = searchQuery.toLowerCase()
    const matchesSearch =
      (test.test_type || '').toLowerCase().includes(searchLow) ||
      (test.classification || '').toLowerCase().includes(searchLow) ||
      (test.started_at || '').toLowerCase().includes(searchLow)

    // Normalize comparison: backend uses lowercase ('ran'), UI uses uppercase ('RAN')
    const matchesFilter = filterType === 'all' ||
      (test.test_type || '').toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesFilter
  })

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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-indigo-50 text-indigo-600">
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
              localStorage.removeItem('user_id')
              localStorage.removeItem('user')
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
          <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
          <p className="text-sm text-gray-600">
            View and track all your past assessments
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Tests</option>
                    <option value="RAN">RAN Only</option>
                    <option value="VRG">VRG Only</option>
                    <option value="PUR">PUR Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-20 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading history...</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="p-20 text-center">
                    <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No test results found.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Test Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Percentage
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Classification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHistory.map((test) => (
                        <tr
                          key={test.test_id}
                          onClick={() => navigate(`/results?test_id=${test.test_id}`)}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {test.started_at}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-700">
                              {test.test_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                            {test.percentage}%
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getClassificationColor(test.classification)}`}
                            >
                              {test.classification}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {!loading && filteredHistory.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredHistory.length} results
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
