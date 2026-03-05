import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  LogOut,
  TrendingUp,
} from 'lucide-react'
export function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Eye className="w-6 h-6" />
            VisionAI Admin
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-indigo-50 text-indigo-600">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5" />
            All Users
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            Test Records
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Monitor and manage all system activities
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +8%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">1,247</h3>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +15%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">8,432</h3>
              <p className="text-sm text-gray-600">Total Tests</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  Stable
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">78%</h3>
              <p className="text-sm text-gray-600">Normal Results</p>
            </div>
          </div>

          {/* Classification Distribution */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Classification Distribution
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${78 * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">78%</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Normal</p>
                <p className="text-sm text-gray-500">6,577 tests</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#f59e0b"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${18 * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">18%</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Mild Issue</p>
                <p className="text-sm text-gray-500">1,518 tests</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#ef4444"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${4 * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">4%</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 mb-1">
                  Needs Attention
                </p>
                <p className="text-sm text-gray-500">337 tests</p>
              </div>
            </div>
          </div>

          {/* Recent Tests Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Test Records
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Test Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Classification
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      user: 'Alex Johnson',
                      type: 'RAN',
                      date: '2026-02-20',
                      score: 85,
                      classification: 'Normal',
                    },
                    {
                      user: 'Sarah Miller',
                      type: 'VRG',
                      date: '2026-02-20',
                      score: 72,
                      classification: 'Mild Issue',
                    },
                    {
                      user: 'Mike Chen',
                      type: 'PUR',
                      date: '2026-02-19',
                      score: 91,
                      classification: 'Normal',
                    },
                    {
                      user: 'Emma Davis',
                      type: 'RAN',
                      date: '2026-02-19',
                      score: 68,
                      classification: 'Mild Issue',
                    },
                    {
                      user: 'James Wilson',
                      type: 'VRG',
                      date: '2026-02-19',
                      score: 88,
                      classification: 'Normal',
                    },
                  ].map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {record.user}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-700">
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {record.score}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${record.classification === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                        >
                          {record.classification}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
