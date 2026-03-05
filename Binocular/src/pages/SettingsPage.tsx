import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import { getProfile, updateProfile } from '../services/authService'

export function SettingsPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<
    'profile' | 'help' | 'privacy'
  >('profile')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Profile state
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  // Load profile on mount
  useEffect(() => {
    const stored = localStorage.getItem('user')
    let user_id = localStorage.getItem('user_id')
    if (!user_id && stored) {
      try { user_id = JSON.parse(stored)?.id } catch { }
    }
    if (!user_id) {
      setProfileError('Not logged in')
      setLoadingProfile(false)
      return
    }
    getProfile(user_id)
      .then((res) => {
        if (res.user) {
          setUserData({
            id: String(res.user.id),
            name: res.user.name,
            email: res.user.email,
            phone: res.user.phone || '',
          })
        }
      })
      .catch((err) => setProfileError(err.backendMessage || err.message || 'Failed to load profile'))
      .finally(() => setLoadingProfile(false))
  }, [])

  const startEdit = () => {
    setEditForm({ name: userData.name, email: userData.email, phone: userData.phone })
    setSaveSuccess('')
    setSaveError('')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setSaveError('')
  }

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setSaveError('Name and email are required')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await updateProfile({
        user_id: userData.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      })
      setUserData((prev) => ({ ...prev, ...editForm }))

      // Update localStorage so other pages (Dashboard) sync automatically
      const updatedUser = { id: userData.id, ...editForm }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setIsEditing(false)
      setSaveSuccess('Profile updated successfully!')
      setTimeout(() => setSaveSuccess(''), 3000)
    } catch (err: any) {
      setSaveError(err.backendMessage || err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Derive initials from name
  const initials = userData.name
    ? userData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'


  const faqs = [
    {
      question: 'What is binocular vision assessment?',
      answer:
        'Binocular vision assessment evaluates how well your eyes work together as a team. It tests eye coordination, tracking ability, and focus stability to detect potential vision issues.',
    },
    {
      question: 'How accurate is this AI assessment?',
      answer:
        'This is a student research project designed for educational purposes. While it uses advanced algorithms, it should not replace professional medical diagnosis. Always consult an eye care professional for accurate diagnosis.',
    },
    {
      question: 'How long does a test take?',
      answer:
        "A quick screening, fixation takes about 2-3 minutes, while a full assessment also takes 2-3 minutes. Make sure you're in a well-lit area and can hold your device steady.",
    },
    {
      question: 'Do I need to remove my glasses?',
      answer:
        "You can perform the test with or without glasses. However, for best results, we recommend testing without glasses if you're comfortable doing so.",
    },
    {
      question: 'What do the test results mean?',
      answer:
        'Results are categorized as Normal (healthy coordination), Mild (minor issues detected), or Needs Attention (consult a professional). Each result includes specific recommendations.',
    },
    {
      question: 'Is my data stored or shared?',
      answer:
        'All processing happens locally on your device. No images or videos are uploaded to any server. Test results are stored securely and are not shared.',
    },
    {
      question: 'Can I retake a test?',
      answer:
        'Yes! You can retake tests as many times as you want. We recommend spacing tests at least a few hours apart for accurate tracking of changes.',
    },
    {
      question: 'What should I do if I get an error?',
      answer:
        'Common issues include poor lighting or camera access denied. Check your camera permissions, ensure good lighting, and restart the app if needed.',
    },
  ]
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-indigo-50 text-indigo-600 transition-colors"
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
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">
            Manage your account and preferences
          </p>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <User className="w-5 h-5" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveSection('help')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'help' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <HelpCircle className="w-5 h-5" />
                Help & FAQ
              </button>
              <button
                onClick={() => setActiveSection('privacy')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'privacy' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Shield className="w-5 h-5" />
                Privacy Policy
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <main className="flex-1 overflow-y-auto p-8">
            {/* Profile Information Section */}
            {activeSection === 'profile' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                {/* Success / Error banners */}
                {saveSuccess && (
                  <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" /> {saveSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    {profileError}
                  </div>
                )}

                {loadingProfile ? (
                  <div className="text-center py-16 text-gray-400">Loading profile…</div>
                ) : (
                  <>
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl p-8 text-center mb-8">
                      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-3xl font-bold">
                        {initials}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {userData.name || '—'}
                      </h3>
                      <p className="text-gray-600">{userData.email}</p>
                    </div>

                    {/* Account Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="font-bold text-gray-900 text-lg">Account Details</h3>
                        <p className="text-sm text-gray-500">Your personal information</p>
                      </div>

                      {isEditing ? (
                        /* ── Edit Form ── */
                        <div className="p-6 space-y-4">
                          {saveError && (
                            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{saveError}</p>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="Full name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="Email address"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="Phone number"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
                            >
                              <Check className="w-4 h-4" />
                              {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={saving}
                              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Read-only view ── */
                        <div className="divide-y divide-gray-200">
                          <div className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-gray-100 rounded-xl">
                              <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="font-semibold text-gray-900 text-lg">{userData.name || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-gray-100 rounded-xl">
                              <Mail className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-semibold text-gray-900 text-lg">{userData.email || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-gray-100 rounded-xl">
                              <Phone className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">Phone Number</p>
                              <p className="font-semibold text-gray-900 text-lg">{userData.phone || '—'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={startEdit}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </>
                )}
              </div>
            )}


            {/* Help & FAQ Section */}
            {activeSection === 'help' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Help & FAQ
                </h2>
                <p className="text-gray-600 mb-8">
                  Find answers to common questions about the binocular vision
                  assessment platform.
                </p>

                <div className="space-y-4 mb-8">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFAQ(openFAQ === index ? null : index)
                        }
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {openFAQ === index && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>


              </div>
            )}

            {/* Privacy Policy Section */}
            {activeSection === 'privacy' && (
              <div className="max-w-4xl">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-indigo-600" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Privacy Policy
                </h2>
                <p className="text-sm text-gray-500 mb-8 text-center">
                  Last updated: January 20, 2026
                </p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      1. Introduction
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This Privacy Policy explains how the Binocular Vision
                      Assessment platform ("we", "our", or "the platform")
                      handles your information. This is a student research
                      project designed for educational purposes.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      2. Data Collection
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      <strong>Camera Access:</strong> The platform uses your
                      device's camera to track eye movements during assessments.
                      All processing happens locally on your device.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Test Results:</strong> Assessment results are
                      stored securely in our database. No video or image data is
                      retained after processing.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      3. Data Usage
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We use the collected data solely to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Perform binocular vision assessments</li>
                      <li>Display your test history and results</li>
                      <li>Track progress over time</li>
                      <li>
                        Generate reports for healthcare providers (with your
                        consent)
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      4. Data Storage
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Test results and account information are stored securely
                      using industry-standard encryption. Camera feeds are
                      processed in real-time and never stored. You can request
                      deletion of your data at any time.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      5. Third-Party Services
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This platform does not share your data with third-party
                      services for advertising or tracking purposes. We use
                      secure hosting services that comply with data protection
                      regulations.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      6. User Rights
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Access your stored test results</li>
                      <li>Request deletion of your data</li>
                      <li>Export your test history</li>
                      <li>
                        Deny camera permissions (though this will limit
                        functionality)
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      7. Security
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      We implement industry-standard security measures including
                      encrypted data transmission, secure authentication, and
                      regular security audits. However, no system is 100%
                      secure, and we recommend using strong passwords.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      8. Children's Privacy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This platform is suitable for all ages. If used by
                      children under 13, parental consent is required.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      9. Medical Disclaimer
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      This platform is not a medical device and should not be
                      used for medical diagnosis. Results are for educational
                      and informational purposes only. Always consult a
                      qualified eye care professional for medical advice.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      10. Changes to This Policy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      As this is a student project, this privacy policy may be
                      updated. Any changes will be reflected with an updated
                      "Last modified" date at the top of this page.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      11. Contact
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      For questions about this privacy policy or data handling,
                      please contact the development team at
                      support@visionai.com.
                    </p>
                  </section>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
