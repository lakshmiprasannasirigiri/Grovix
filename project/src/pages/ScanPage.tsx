import { useState, useRef } from 'react';
import { Camera, Upload, Image, AlertCircle, CheckCircle, Loader2, ArrowLeft, Leaf, Microscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface ScanResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
}

const mockResults: ScanResult[] = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 87,
    severity: 'medium',
    treatment: [
      'Apply copper-based fungicide every 7-10 days',
      'Remove and destroy infected leaves',
      'Improve air circulation around plants',
    ],
    prevention: [
      'Use disease-resistant varieties',
      'Practice crop rotation',
      'Avoid overhead watering',
    ],
  },
  {
    crop: 'Rice',
    disease: 'Bacterial Leaf Blight',
    confidence: 92,
    severity: 'high',
    treatment: [
      'Apply streptomycin sulfate or copper oxychloride',
      'Drain field to reduce humidity',
      'Remove affected plants',
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Maintain proper spacing',
      'Avoid excessive nitrogen fertilization',
    ],
  },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Use mock result for demo
    const mockResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(mockResult);
    setScanning(false);

    // Save to database
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await supabase.from('crop_scans').insert([{
          user_id: user.data.user.id,
          image_url: preview || '',
          detected_disease: mockResult.disease,
          confidence_score: mockResult.confidence,
          treatment_suggestion: mockResult.treatment.join(', '),
          crop_name: mockResult.crop,
        }]);
      }
    } catch (error) {
      console.error('Error saving scan:', error);
    }
  };

  const resetScan = () => {
    setPreview(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Crop Scanner</h1>
              <p className="text-emerald-100 text-sm">Detect diseases instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'camera'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </button>
        </div>

        {/* Upload Section */}
        <AnimatePresence mode="wait">
          {!preview && !result && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {activeTab === 'upload' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl p-12 text-center cursor-pointer transition-all group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Image className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your image here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: JPG, PNG, WEBP (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                    <Camera className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Camera Access Required
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Take a clear photo of the affected crop leaves for accurate detection
                  </p>
                  <button
                    onClick={() => {
                      // Simulate camera capture with file input
                      fileInputRef.current?.click();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                  >
                    Open Camera
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Crop Type</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-xs text-gray-600">Disease ID</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Treatment</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Section */}
        <AnimatePresence>
          {preview && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={preview}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={resetScan}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Microscope className="w-5 h-5" />
                      Start Analysis
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning Animation */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <Microscope className="absolute inset-0 m-auto w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI Analysis in Progress
                </h3>
                <p className="text-gray-600 text-sm">
                  Identifying crop type and detecting diseases...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Result Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={preview || ''}
                    alt="Scanned crop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{result.crop}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                            {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                          </span>
                          <span className="text-white/80 text-xs">
                            {result.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disease Detected */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Disease Detected</h4>
                    <p className="text-sm text-gray-600">{result.disease}</p>
                  </div>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{result.confidence}% match confidence</p>
              </div>

              {/* Treatment */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Recommended Treatment</h4>
                </div>

                <div className="space-y-2">
                  {result.treatment.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-white">Prevention Tips</h4>
                </div>

                <div className="space-y-2">
                  {result.prevention.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </span>
                      <p className="text-white text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={resetScan}
                  className="py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                >
                  Ask Community
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
