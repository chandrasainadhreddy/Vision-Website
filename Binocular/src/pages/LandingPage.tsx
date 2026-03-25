import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  Brain,
  Activity,
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  Zap,
} from 'lucide-react'
export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-indigo-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Eye className="w-6 h-6" />
            VisionAI
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors">How It Works</a>
            <a href="#tests" className="text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors">Tests</a>
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors">Features</a>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-teal-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-indigo-200">
              <Brain className="w-4 h-4" />
              🚀 AI-Powered Vision Assessment
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-600 mb-6 leading-tight">
              Binocular Vision Assessment Using AI Technology
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Advanced AI-powered platform for comprehensive binocular vision testing. Track eye coordination, detect vision issues, and monitor progress over time with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-400/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-indigo-200 hover:border-indigo-400"
              >
                Sign In
              </button>
            </div>
          </div>
          
          {/* Hero Visual Element */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-2xl h-64 md:h-96 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 rounded-3xl border border-indigo-200/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-teal-600/5"></div>
              <Eye className="w-32 h-32 text-indigo-300 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How AI Detection Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to comprehensive vision assessment
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                <Eye className="w-12 h-12 text-white" />
              </div>
              <div className="text-5xl font-bold text-indigo-200 mb-4">01</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Camera Capture
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Position yourself in front of the camera. Our AI tracks your eye
                movements in real-time with precision.
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="text-5xl font-bold text-teal-200 mb-4">02</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms analyze fixation, saccades, vergence, and
                smooth pursuit patterns instantly.
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                <Activity className="w-12 h-12 text-white" />
              </div>
              <div className="text-5xl font-bold text-indigo-200 mb-4">03</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get Results
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed reports with classification, scores, and
                personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section id="tests" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Comprehensive Tests
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered assessments for complete binocular vision evaluation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-indigo-100 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                RAN Test
              </h3>
              <p className="text-sm text-indigo-600 font-semibold mb-4 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                Fixation + Saccades
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Evaluates your ability to maintain steady fixation and perform
                rapid eye movements between targets. Essential for reading and
                visual tracking.
              </p>
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 mr-2" />
                Duration: 2 minutes
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-teal-100 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                VRG Test
              </h3>
              <p className="text-sm text-teal-600 font-semibold mb-4 bg-teal-50 px-3 py-1 rounded-full inline-block">
                Vergence
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Measures how well your eyes work together to converge and
                diverge. Critical for depth perception and comfortable near
                vision.
              </p>
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 mr-2" />
                Duration: 2 minutes
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-indigo-100 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                PUR Test
              </h3>
              <p className="text-sm text-indigo-600 font-semibold mb-4 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                Smooth Pursuit
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Assesses your ability to smoothly track moving objects.
                Important for sports, driving, and following dynamic visual
                information.
              </p>
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 mr-2" />
                Duration: 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for comprehensive vision assessment
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 rounded-xl hover:bg-indigo-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Real-Time AI Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Instant processing and classification of eye movements
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl hover:bg-teal-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Comprehensive Reports
                </h3>
                <p className="text-gray-600 text-sm">
                  Detailed results with scores, metrics, and AI notes
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl hover:bg-indigo-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Progress Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor improvements over time with visual charts
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl hover:bg-teal-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data is encrypted and never shared
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl hover:bg-indigo-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Multi-User Support
                </h3>
                <p className="text-gray-600 text-sm">
                  Patient and doctor accounts with role-based access
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl hover:bg-teal-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Responsive Design
                </h3>
                <p className="text-gray-600 text-sm">
                  Works seamlessly on desktop and tablet devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-indigo-600 via-teal-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-40 -mr-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-10">
            Join thousands of users already benefiting from AI-powered vision assessment
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                VisionAI
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Advanced binocular vision assessment powered by cutting-edge artificial
                intelligence technology.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#tests" className="text-gray-400 hover:text-white transition-colors">
                    Test Types
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Create Account
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <p className="text-sm text-gray-500 mb-2">Email: support@visionai.com</p>
              <p className="text-sm text-gray-500">Educational Research Project</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p className="text-gray-500">&copy; 2026 VisionAI. Educational Research Project.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
