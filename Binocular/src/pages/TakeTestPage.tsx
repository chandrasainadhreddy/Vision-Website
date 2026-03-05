import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  LayoutDashboard,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Play,
  Camera,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Brain,
  Activity,
} from 'lucide-react'
import * as faceapi from 'face-api.js'

type TestType = 'RAN' | 'VRG' | 'PUR' | null
type TestStep =
  | 'selection'
  | 'camera-permission'
  | 'eyes-detection'
  | 'red-dot-detection'
  | 'blue-dot-sequence'
  | 'saving-data'
  | 'ai-analysis'

interface DotPosition {
  x: number
  y: number
  size: number
  opacity: number
}

export function TakeTestPage() {
  const navigate = useNavigate()
  const [selectedTest, setSelectedTest] = useState<TestType>(null)
  const [currentStep, setCurrentStep] = useState<TestStep>('selection')
  const [countdown, setCountdown] = useState(120)
  const [progress, setProgress] = useState(0)
  const [dotPosition, setDotPosition] = useState<DotPosition>({
    x: 50,
    y: 50,
    size: 20,
    opacity: 1,
  })
  const elapsedTimeRef = useRef(0) // tracks elapsed time in test

  // Refs for animation and intervals
  const animationFrameRef = useRef<number | undefined>(undefined)
  const ranIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const detectionIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const modeChangeIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const dotPositionRef = useRef<DotPosition>(dotPosition)

  // Camera and face detection states
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [eyesDetected, setEyesDetected] = useState(false)
  const [detectionStatus, setDetectionStatus] = useState<string>('Initializing...')
  const facesDetectedRef = useRef(0) // tracks how many faces detected
  const modelsLoadedRef = useRef(false)
  const eyesDetectedTransitionRef = useRef(false)

  // Pursuit logic refs
  const lastFrameTimeRef = useRef<number>(0)
  const pursuitSpeedRef = useRef<number>(1.0)
  const phaseRef = useRef<number>(0)
  const pursuitModeRef = useRef<'horizontal' | 'circular' | 'figure8' | 'oval' | 'verticalInfinity'>('horizontal')

  // --- Backend Integration States ---
  const [testId, setTestId] = useState<number | null>(null)
  const samplesRef = useRef<any[]>([])
  const sampleCountRef = useRef(0)
  const streamRef = useRef<MediaStream | null>(null)
  // processingRef removed - replaced by savingRef and aiRunningRef for clearer step separation
  const userId = localStorage.getItem('user_id')

  // Sync dotPositionRef with state
  useEffect(() => {
    dotPositionRef.current = dotPosition
  }, [dotPosition])

  // Backend: Start Test
  const startTest = async (testType: TestType) => {
    if (!userId) {
      alert('Please login first')
      navigate('/')
      return
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/start_test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          test_type: testType
        })
      })
      const data = await res.json()
      if (data.status) {
        setTestId(data.test_id)
        setSelectedTest(testType)
        setCurrentStep('camera-permission')
        setCountdown(120)
        setProgress(0)
        elapsedTimeRef.current = 0
        eyesDetectedTransitionRef.current = false
        sampleCountRef.current = 0
        samplesRef.current = []
      } else {
        alert('Failed to start test: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Start test error:', err)
      alert('Network error while starting test')
    }
  }

  // Backend: Upload Batch
  const uploadBatch = async (items: any[], isFinal = false) => {
    if (!testId || items.length === 0) return
    try {
      await fetch('http://127.0.0.1:5000/upload_eye_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_id: testId, samples: items }),
      })
      // Removed async resetting, array is now reset synchronously in detectFaces
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  // Auto-Reconnect Video Stream regardless of component unmounting
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch((e) => console.error('Auto-play error:', e))
    }
  })

  // Load face-api models & Camera
  useEffect(() => {
    let isCancelled = false
    const loadModelsAndCamera = async () => {
      try {
        if (activeCaptureSteps.includes(currentStep)) {
          try {
            setDetectionStatus('Requesting camera access...')
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: 640, height: 480, facingMode: 'user' },
              audio: false,
            })

            if (isCancelled) {
              stream.getTracks().forEach((track) => track.stop())
              return
            }

            if (videoRef.current && !cameraReady) {
              videoRef.current.srcObject = stream
              videoRef.current.play().catch((e) => console.error('Play error:', e))
              streamRef.current = stream
              setCameraReady(true)
              setDetectionStatus('Camera ready.')
            }
          } catch (cameraError: any) {
            if (isCancelled) return
            console.error('Camera access error:', cameraError)
            setDetectionStatus(`❌ Camera error: ${cameraError.message}`)
            setCameraReady(false)
            return
          }
        }

        if (!modelsLoadedRef.current && activeCaptureSteps.includes(currentStep) && !isCancelled) {
          setDetectionStatus('Loading AI models...')
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'
          try {
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ])
            if (isCancelled) return
            modelsLoadedRef.current = true
            setDetectionStatus('✓ AI models loaded. Detecting face...')
          } catch (modelError: any) {
            if (isCancelled) return
            console.error('Model loading error:', modelError)
            setDetectionStatus(`❌ Model load failed: ${modelError.message}`)
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Init error:', error)
          setDetectionStatus('❌ An error occurred.')
        }
      }
    }

    if (activeCaptureSteps.includes(currentStep)) {
      loadModelsAndCamera()
    } else {
      // Stop the camera proactively if we move out of a capture step
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setCameraReady(false)
    }

    return () => {
      isCancelled = true
    }
  }, [currentStep, cameraReady])

  const activeCaptureSteps: TestStep[] = ['camera-permission', 'eyes-detection', 'red-dot-detection', 'blue-dot-sequence']


  // Detection and Data Capture Loop
  useEffect(() => {
    if (!activeCaptureSteps.includes(currentStep) || !cameraReady || !videoRef.current) return

    const canvas = canvasRef.current
    const displaySize = { width: 640, height: 480 }

    const detectFaces = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()

        facesDetectedRef.current = detections.length

        if (detections.length > 0) {
          const landmarks = detections[0].landmarks.positions
          const leftEye = landmarks.slice(36, 42).reduce((acc, p) => ({ x: acc.x + p.x / 6, y: acc.y + p.y / 6 }), { x: 0, y: 0 })
          const rightEye = landmarks.slice(42, 48).reduce((acc, p) => ({ x: acc.x + p.x / 6, y: acc.y + p.y / 6 }), { x: 0, y: 0 })

          if (currentStep === 'blue-dot-sequence') {
            sampleCountRef.current += 1
            const sample = {
              n: sampleCountRef.current,
              x: dotPositionRef.current.x,
              y: dotPositionRef.current.y,
              lx: leftEye.x,
              ly: leftEye.y,
              rx: rightEye.x,
              ry: rightEye.y
            }
            samplesRef.current.push(sample)

            if (samplesRef.current.length >= 50) {
              const batchToUpload = [...samplesRef.current]
              samplesRef.current = [] // clear instantly to prevent mutation overlaps
              uploadBatch(batchToUpload)
            }
          }

          if (!eyesDetected) {
            setEyesDetected(true)
            setDetectionStatus('Eyes detected!')
          }
        } else if (currentStep === 'eyes-detection') {
          setEyesDetected(false)
          setDetectionStatus('No face detected.')
        }

        if ((currentStep === 'camera-permission' || currentStep === 'eyes-detection') && canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const resized = faceapi.resizeResults(detections, displaySize)
            faceapi.draw.drawDetections(canvas, resized)
            faceapi.draw.drawFaceLandmarks(canvas, resized)
          }
        }
      } catch (error) {
        console.error('Detection error:', error)
      }
    }

    detectionIntervalRef.current = setInterval(detectFaces, 100) // 10 FPS
    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current)
    }
  }, [currentStep, cameraReady, eyesDetected, testId])

  // Step Progression Logic
  useEffect(() => {
    // 1. Camera Permission -> Eyes Detection (Once eyes are seen)
    if (currentStep === 'camera-permission' && eyesDetected && !eyesDetectedTransitionRef.current) {
      eyesDetectedTransitionRef.current = true
      setTimeout(() => setCurrentStep('eyes-detection'), 1000)
    }

    // 2. Eyes Detection (Confirm) -> Red Dot (Calibration)
    if (currentStep === 'eyes-detection') {
      const timer = setTimeout(() => setCurrentStep('red-dot-detection'), 2000)
      return () => clearTimeout(timer)
    }

    // 3. Red Dot (Calibration) -> Blue Dot (Test)
    if (currentStep === 'red-dot-detection') {
      const timer = setTimeout(() => setCurrentStep('blue-dot-sequence'), 3000)
      return () => clearTimeout(timer)
    }
    if (currentStep === 'blue-dot-sequence') {
      const startTime = Date.now()
      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval)
            setCurrentStep('saving-data')
            return 0
          }
          return c - 1
        })
        setProgress((p) => Math.min(p + 100 / 120, 100))
      }, 1000)

      if (selectedTest === 'RAN') {
        const jump = () => setDotPosition({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70, size: 20, opacity: 1 })
        jump()
        ranIntervalRef.current = setInterval(jump, 1200)
      }

      if (selectedTest === 'PUR') {
        modeChangeIntervalRef.current = setInterval(() => {
          const modes: Array<'horizontal' | 'circular' | 'figure8' | 'oval' | 'verticalInfinity'> = ['horizontal', 'circular', 'figure8', 'oval', 'verticalInfinity']
          const next = modes[(modes.indexOf(pursuitModeRef.current) + 1) % modes.length]
          pursuitModeRef.current = next
        }, 10000)
      }

      const animate = () => {
        const now = Date.now()
        if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now
        const delta = (now - lastFrameTimeRef.current) / 1000
        lastFrameTimeRef.current = now
        const elapsed = (now - startTime) / 1000

        if (selectedTest === 'PUR') {
          phaseRef.current += pursuitSpeedRef.current * delta
          const p = phaseRef.current
          const m = pursuitModeRef.current
          const r = 35
          if (m === 'horizontal') setDotPosition({ x: 50 + r * Math.sin(p), y: 50, size: 20, opacity: 1 })
          else if (m === 'circular') setDotPosition({ x: 50 + r * Math.cos(p), y: 50 + r * Math.sin(p), size: 20, opacity: 1 })
          else if (m === 'figure8') setDotPosition({ x: 50 + r * Math.sin(p), y: 50 + r * Math.sin(p) * Math.cos(p), size: 20, opacity: 1 })
          else if (m === 'oval') setDotPosition({ x: 50 + r * Math.cos(p), y: 50 + (r / 2) * Math.sin(p), size: 20, opacity: 1 })
          else if (m === 'verticalInfinity') setDotPosition({ x: 50 + r * Math.sin(p) * Math.cos(p), y: 50 + r * Math.sin(p), size: 20, opacity: 1 })
        } else if (selectedTest === 'VRG') {
          const size = 95 + 155 * Math.sin(elapsed * 2)
          const op = 0.7 + 0.3 * Math.sin(elapsed * 2)
          setDotPosition({ x: 50, y: 50, size: Math.max(10, Math.min(80, size)), opacity: Math.max(0.2, Math.min(1, op)) })
        }
        animationFrameRef.current = requestAnimationFrame(animate)
      }

      if (selectedTest !== 'RAN') animate()

      return () => {
        clearInterval(interval)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        if (ranIntervalRef.current) clearInterval(ranIntervalRef.current)
        if (modeChangeIntervalRef.current) clearInterval(modeChangeIntervalRef.current)
      }
    }
  }, [currentStep, cameraReady, eyesDetected, testId, selectedTest, navigate])

  // Handle Finalization (saving-data step)
  const savingRef = useRef(false)
  useEffect(() => {
    if (currentStep === 'saving-data' && !savingRef.current) {
      savingRef.current = true
      const finalize = async () => {
        try {
          if (samplesRef.current.length > 0) {
            await uploadBatch(samplesRef.current, true)
          }
        } catch (err) {
          console.error('Final upload error:', err)
        } finally {
          setCurrentStep('ai-analysis')
          savingRef.current = false
        }
      }
      finalize()
    }
  }, [currentStep])

  // Handle AI Analysis step
  const aiRunningRef = useRef(false)
  useEffect(() => {
    if (currentStep !== 'ai-analysis') return
    if (aiRunningRef.current) return
    aiRunningRef.current = true

    const runAI = async () => {
      if (!testId) {
        console.error('No test ID found for AI analysis')
        navigate('/dashboard')
        aiRunningRef.current = false
        return
      }
      try {
        console.log('[AI] Starting analysis for test:', testId)
        const res = await fetch('http://127.0.0.1:5000/run_ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test_id: testId })
        })

        const d = await res.json()
        console.log('[AI] Response:', d)

        if (d.status === true && d.test_id) {
          console.log('[AI] Success! Navigating to results for test:', d.test_id)
          navigate(`/results?test_id=${d.test_id}`, { state: { testId: d.test_id, testType: selectedTest } })
        } else {
          console.error('[AI] Analysis failed:', d)
          alert('AI Analysis failed: ' + (d.error || d.message || 'Unknown error'))
          navigate('/dashboard')
        }
      } catch (err: any) {
        console.error('[AI] Network error:', err)
        alert('Network error during AI analysis: ' + err.message)
        navigate('/dashboard')
      } finally {
        aiRunningRef.current = false
      }
    }

    runAI()
  }, [currentStep, testId, navigate])


  const goBack = () => {
    if (currentStep === 'selection') navigate('/dashboard')
    else {
      setCurrentStep('selection')
      setSelectedTest(null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Eye className="w-6 h-6" />
            VisionAI
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-indigo-50 text-indigo-600">
            <FlaskConical className="w-5 h-5" /> Take Test
          </button>
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <History className="w-5 h-5" /> Test History
          </button>
          <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => { localStorage.removeItem('user_id'); localStorage.removeItem('user'); navigate('/') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            {currentStep !== 'selection' && (
              <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Take Test</h1>
              <p className="text-sm text-gray-600">
                {currentStep === 'selection' ? 'Choose a test to begin' : `${selectedTest} Test - ${currentStep.replace('-', ' ')}`}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeCaptureSteps.includes(currentStep) && (
            <video ref={videoRef} autoPlay playsInline muted width="640" height="480" className="hidden" />
          )}

          {currentStep === 'selection' && (
            <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {[
                {
                  id: 'RAN',
                  title: 'RAN Test',
                  subtitle: 'Fixation + Saccades',
                  desc: 'Evaluates your ability to maintain steady fixation and perform rapid eye movements between targets. Essential for reading and visual tracking.',
                  color: 'indigo',
                  icon: Eye
                },
                {
                  id: 'VRG',
                  title: 'VRG Test',
                  subtitle: 'Vergence',
                  desc: 'Measures how well your eyes work together to converge and diverge. Critical for depth perception and comfortable near vision.',
                  color: 'teal',
                  icon: Brain
                },
                {
                  id: 'PUR',
                  title: 'PUR Test',
                  subtitle: 'Smooth Pursuit',
                  desc: 'Assesses your ability to smoothly track moving objects. Important for sports, driving, and following dynamic visual information.',
                  color: 'indigo',
                  icon: Activity
                }
              ].map((t) => (
                <div key={t.id} className={`bg-white rounded-[40px] p-10 shadow-sm border ${t.id === 'VRG' ? 'border-teal-100 bg-teal-50/10' : 'border-gray-100'} hover:shadow-2xl transition-all duration-500 flex flex-col relative group`}>
                  <div className={`w-16 h-16 ${t.id === 'VRG' ? 'bg-teal-600' : 'bg-indigo-600'} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                    <t.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{t.title}</h3>

                  <div className="mb-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${t.id === 'VRG' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {t.subtitle}
                    </span>
                  </div>

                  <p className="text-gray-500 text-base leading-relaxed mb-10 flex-1">
                    {t.desc}
                  </p>

                  <div className="flex items-center gap-3 mb-8 text-gray-400">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wide">Duration: 2 minutes</span>
                  </div>

                  <button
                    onClick={() => startTest(t.id as TestType)}
                    className={`w-full ${t.id === 'VRG' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-3xl font-bold py-5 flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-gray-100`}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span className="text-lg">Start Test</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'camera-permission' && (
            <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
              <video ref={videoRef} autoPlay playsInline muted width="640" height="480" className={`w-full h-auto ${!cameraReady ? 'opacity-0 absolute -z-10' : 'opacity-100'}`} />
              <canvas ref={canvasRef} className={`absolute inset-0 w-full h-auto ${!cameraReady ? 'opacity-0' : 'opacity-100'}`} />

              {!cameraReady ? (
                <div className="p-12 text-center">
                  <Camera className="w-16 h-16 text-slate-300 mx-auto mb-8 animate-pulse" />
                  <h2 className="text-3xl font-bold text-white mb-6">Camera Access Required</h2>
                  <div className="bg-slate-800 rounded-2xl p-4 mb-6 border border-slate-700 text-slate-200">{detectionStatus}</div>
                  <p className="text-slate-400">Please allow camera access to proceed with the assessment.</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 text-center">
                    {eyesDetected ? (
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    ) : (
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    )}
                    <p className={`text-lg font-bold ${eyesDetected ? 'text-green-400' : 'text-yellow-300'}`}>
                      {eyesDetected ? '✓ Eyes Detected!' : 'Detecting Eyes...'}
                    </p>
                    <p className="text-white text-sm">{detectionStatus}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'eyes-detection' && (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-200">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-8" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Eyes Detected!</h2>
              <p className="text-gray-600">Great! We've calibrated your position. Starting calibration...</p>
            </div>
          )}


          {currentStep === 'red-dot-detection' && (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-200">
              <div className="w-20 h-20 bg-red-500 rounded-full animate-ping mx-auto mb-8" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Focus on the Red Dot</h2>
              <p className="text-gray-600">Keep your eyes on the center dot</p>
            </div>
          )}

          {currentStep === 'blue-dot-sequence' && (
            <div className="max-w-4xl mx-auto relative bg-white rounded-3xl shadow-2xl border border-gray-200 aspect-[16/9] overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted width="160" height="120" className={`absolute bottom-4 left-4 rounded-lg border border-gray-300 z-10 shadow-lg ${!cameraReady ? 'opacity-0' : 'opacity-100'}`} />
              <div className="absolute rounded-full bg-blue-500 transition-all duration-100" style={{ left: `${dotPosition.x}%`, top: `${dotPosition.y}%`, width: `${dotPosition.size}px`, height: `${dotPosition.size}px`, opacity: dotPosition.opacity, transform: 'translate(-50%, -50%)' }} />
              <div className="absolute bottom-8 left-8 right-8 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-mono text-3xl font-bold">{formatTime(countdown)}</div>
            </div>
          )}

          {currentStep === 'saving-data' && (
            <div className="text-center py-20">
              <Save className="w-16 h-16 text-teal-600 mx-auto mb-8 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Saving Data</h2>
              <p className="text-gray-600">Finalizing test records...</p>
            </div>
          )}

          {currentStep === 'ai-analysis' && (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Analysis</h2>
              <p className="text-gray-600 mb-8">Generating your comprehensive report...</p>
              {testId && (
                <button
                  onClick={() => navigate(`/results?test_id=${testId}`, { state: { testId, testType: selectedTest } })}
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-semibold"
                >
                  Skip Waiting (If Results Ready)
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
