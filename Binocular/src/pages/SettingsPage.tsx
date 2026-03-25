import { useState, useEffect, useRef } from 'react'
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
  Camera,
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
    profile_image: '',
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', profile_image: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now())

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
            profile_image: res.user.profile_image || '',
          })
        }
      })
      .catch((err) => setProfileError(err.backendMessage || err.message || 'Failed to load profile'))
      .finally(() => setLoadingProfile(false))
  }, [])

  const startEdit = () => {
    setEditForm({ name: userData.name, email: userData.email, phone: userData.phone, profile_image: userData.profile_image })
    setSelectedFile(null)
    setImagePreview(null)
    setSaveSuccess('')
    setSaveError('')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setSelectedFile(null)
    setIsEditing(false)
    setSaveError('')
  }

  // ─── Validate phone number (must be exactly 10 digits) ───
  const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.length === 10
  }

  const isPhoneEdited = editForm.phone !== userData.phone
  const isPhoneInvalid = isPhoneEdited && editForm.phone.trim() !== '' && !isValidPhone(editForm.phone)

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setSaveError('Name and email are required')
      return
    }
    if (editForm.phone.trim() !== '' && !isValidPhone(editForm.phone)) {
      setSaveError('Phone number must contain exactly 10 digits')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      let profileImagePath = editForm.profile_image
      const hadImageUpload = selectedFile !== null  // Capture before clearing state
      let imageUploadSuccess = false

      // Upload profile image if a file is selected
      if (selectedFile) {
        try {
          console.log('🖼️ Starting image upload:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type)
          
          const formData = new FormData()
          formData.append('user_id', userData.id)
          formData.append('image', selectedFile)

          const uploadResponse = await fetch('http://127.0.0.1:5000/api/user/upload-profile-image', {
            method: 'POST',
            body: formData,
          })

          console.log('📡 Upload response status:', uploadResponse.status)

          if (!uploadResponse.ok) {
            const responseText = await uploadResponse.text()
            console.error('❌ Upload error response:', responseText)
            throw new Error(`Upload failed with status ${uploadResponse.status}. Please check if the server is running.`)
          }

          const contentType = uploadResponse.headers.get('content-type') || ''
          if (!contentType.includes('application/json')) {
            throw new Error('Server returned invalid response format')
          }

          const uploadResult = await uploadResponse.json()
          console.log('✅ Upload result:', uploadResult)
          
          if (!uploadResult.status) {
            throw new Error(uploadResult.message || 'Upload failed on server side')
          }

          if (!uploadResult.image_path) {
            throw new Error('Server did not return image path')
          }

          profileImagePath = uploadResult.image_path
          imageUploadSuccess = true
          console.log('✅ Image uploaded successfully. New path:', profileImagePath)
          
        } catch (uploadErr: any) {
          console.error('❌ Image upload error:', uploadErr)
          const errorMsg = uploadErr.message || 'Unknown error during image upload'
          setSaveError(`Image upload failed: ${errorMsg}`)
          // Don't continue with profile update if image upload fails
          setSaving(false)
          return
        }
      }

      await updateProfile({
        user_id: userData.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        profile_image: profileImagePath,
      })

      console.log('✅ Profile updated in database with image path:', profileImagePath)

      // Update userData immediately with new image path
      const updatedUserData = { 
        ...userData,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        profile_image: profileImagePath
      }
      setUserData(updatedUserData)
      console.log('✅ Updated local userData state')

      // Force image refresh with new timestamp if image was uploaded
      if (imageUploadSuccess || hadImageUpload) {
        const newRefreshKey = Date.now()
        console.log('🔄 Refreshing image cache. New key:', newRefreshKey)
        setImageRefreshKey(newRefreshKey)
      }

      // Update localStorage so other pages (Dashboard) sync automatically
      const updatedUser = { id: userData.id, ...updatedUserData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log('✅ Updated localStorage')

      // Cleanup blob URL
      if (imagePreview) {
        console.log('🗑️ Revoking blob URL')
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(null)
      setSelectedFile(null)
      setEditForm({ name: '', email: '', phone: '', profile_image: '' })

      // Wait a moment for state updates to apply before exiting edit mode
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Re-fetch profile from server to verify the image was saved
      if (imageUploadSuccess || hadImageUpload) {
        try {
          console.log('🔄 Re-fetching profile from server to verify changes...')
          const freshProfile = await getProfile(userData.id)
          if (freshProfile.user) {
            console.log('✅ Fresh profile received. Image path:', freshProfile.user.profile_image)
            setUserData({
              id: String(freshProfile.user.id),
              name: freshProfile.user.name,
              email: freshProfile.user.email,
              phone: freshProfile.user.phone || '',
              profile_image: freshProfile.user.profile_image || '',
            })
          }
        } catch (refetchErr: any) {
          console.warn('⚠️ Could not re-fetch profile:', refetchErr.message)
          // Still continue - we already have the updated data in state
        }
      }
      
      setIsEditing(false)
      
      // Show appropriate success message
      const successMsg = hadImageUpload 
        ? 'Profile updated! Image uploaded successfully.' 
        : 'Profile updated successfully!'
      setSaveSuccess(successMsg)
      console.log('✅ Save complete!')
      setTimeout(() => setSaveSuccess(''), 4000)
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
                      {/* Avatar with optional camera overlay in edit mode */}
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        {/* Show local preview > existing server image > initials */}
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-300"
                          />
                        ) : userData.profile_image ? (
                          <img
                            src={`http://127.0.0.1:5000/${userData.profile_image}?v=${imageRefreshKey}`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                            {initials}
                          </div>
                        )}

                        {/* Camera overlay button — only visible in edit mode */}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            title="Change photo"
                          >
                            <Camera className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-semibold leading-tight">Change</span>
                          </button>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {isEditing ? (editForm.name || userData.name || '—') : (userData.name || '—')}
                      </h3>
                      <p className="text-gray-600">{isEditing ? editForm.email : userData.email}</p>
                      {isEditing && (
                        <p className="text-xs text-indigo-500 mt-1">Hover the avatar to change your photo</p>
                      )}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => {
                                  const input = e.target.value
                                  // Allow only digits and spaces/hyphens for formatting
                                  const filtered = input.replace(/[^0-9\s\-]/g, '')
                                  setEditForm({ ...editForm, phone: filtered })
                                }}
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm ${
                                  isPhoneInvalid
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                                placeholder="10 digits (e.g., 9876543210)"
                                maxLength="15"
                              />
                            </div>
                            {isPhoneInvalid && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <span>✕</span> Phone must be exactly 10 digits (currently {editForm.phone.replace(/\D/g, '').length})
                              </p>
                            )}
                            {editForm.phone.trim() === '' && (
                              <p className="text-xs text-gray-400 mt-1">Optional • 10 digits only</p>
                            )}
                          </div>
                          {/* Hidden file input — triggered by avatar overlay or button */}
                          <input
                            ref={fileInputRef}
                            key={selectedFile ? selectedFile.name : 'file-input'}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              console.log('File selected:', file ? `${file.name} (${file.size} bytes)` : 'null')
                              if (imagePreview) {
                                console.log('Revoking previous preview URL')
                                URL.revokeObjectURL(imagePreview)
                              }
                              setSelectedFile(file)
                              setImagePreview(file ? URL.createObjectURL(file) : null)
                            }}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                            <div className="flex items-center gap-3">
                              {/* Mini preview */}
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {imagePreview ? (
                                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : userData.profile_image ? (
                                  <img src={`http://127.0.0.1:5000/${userData.profile_image}?v=${imageRefreshKey}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm">{initials}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    console.log('File input ref:', fileInputRef.current)
                                    fileInputRef.current?.click()
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 border border-indigo-300 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
                                >
                                  <Camera className="w-4 h-4" />
                                  {selectedFile ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                {selectedFile ? (
                                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                  </p>
                                ) : (
                                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF or WebP • max 5 MB</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleSave}
                              disabled={saving || isPhoneInvalid}
                              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                          <div className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-gray-100 rounded-xl">
                              <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">Profile Image</p>
                              {userData.profile_image ? (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`http://127.0.0.1:5000/${userData.profile_image}?v=${imageRefreshKey}`}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <span className="text-sm text-gray-600">Image uploaded</span>
                                </div>
                              ) : (
                                <p className="font-semibold text-gray-900 text-lg">No image uploaded</p>
                              )}
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
