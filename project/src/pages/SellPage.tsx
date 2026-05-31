import { useState } from 'react';
import {
  ArrowLeft, Camera, Leaf, MapPin, DollarSign, Package,
  X, Check, Loader2, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CropFormData {
  crop_name: string;
  crop_type: string;
  quantity: string;
  unit: string;
  price_per_unit: string;
  is_organic: boolean;
  description: string;
  location: string;
}

const cropTypes = [
  { value: 'grain', label: 'Grains', examples: 'Rice, Wheat, Maize' },
  { value: 'vegetable', label: 'Vegetables', examples: 'Tomato, Potato, Onion' },
  { value: 'fruit', label: 'Fruits', examples: 'Mango, Banana, Apple' },
  { value: 'pulse', label: 'Pulses', examples: 'Dal, Chickpea, Moong' },
  { value: 'spice', label: 'Spices', examples: 'Turmeric, Chilli, Cumin' },
  { value: 'cash_crop', label: 'Cash Crops', examples: 'Cotton, Sugarcane, Tea' },
];

const units = ['kg', 'quintal', 'ton', 'piece', 'dozen'];

export default function SellPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CropFormData>({
    crop_name: '',
    crop_type: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    is_organic: false,
    description: '',
    location: profile?.location || '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          if (newImages.length === files.length) {
            setImages(prev => [...prev, ...newImages].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!profile) return;

    setLoading(true);

    try {
      // Upload images to storage (simulated with base64 for demo)
      const imageUrls = images.length > 0 ? images : [
        'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ];

      const { error } = await supabase.from('crop_listings').insert([{
        farmer_id: profile.id,
        crop_name: formData.crop_name,
        crop_type: formData.crop_type,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price_per_unit),
        is_organic: formData.is_organic,
        description: formData.description,
        images: imageUrls,
        location: formData.location,
        status: 'available',
      }]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.crop_name && formData.crop_type && formData.quantity;
  const isStep2Valid = formData.price_per_unit && formData.location;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Sell Your Crops</h1>
              <p className="text-emerald-100 text-sm">Create your listing</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium">{step}/3</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Crop Details</h2>
                    <p className="text-sm text-gray-600">Tell us about your crop</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Name *
                    </label>
                    <input
                      type="text"
                      value={formData.crop_name}
                      onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                      placeholder="e.g., Organic Tomatoes, Basmati Rice"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {cropTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, crop_type: type.value })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.crop_type === type.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.examples}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="Amount"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit *
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Organic Crop</p>
                        <p className="text-xs text-gray-600">Get premium rates for organic produce</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setFormData({ ...formData, is_organic: !formData.is_organic })}
                      className={`w-12 h-6 rounded-full transition-colors ${formData.is_organic ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.is_organic ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Price & Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pricing & Location</h2>
                    <p className="text-sm text-gray-600">Set your price and pickup location</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per {formData.unit} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                        Rs.
                      </span>
                      <input
                        type="number"
                        value={formData.price_per_unit}
                        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                        placeholder="Enter price"
                        className="w-full pl-14 pr-20 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        per {formData.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Total value: Rs. {(parseFloat(formData.quantity || '0') * parseFloat(formData.price_per_unit || '0')).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Enter your location"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your crop quality, harvest date, special features..."
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Add Photos</h2>
                    <p className="text-sm text-gray-600">Upload clear photos of your crop (max 5)</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img
                        src={img}
                        alt={`Crop ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {images.length === 0 && (
                  <div className="mt-4 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      <strong>Tip:</strong> Listings with clear photos get 3x more buyers!
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="font-semibold text-gray-900 mb-4">Listing Preview</h3>
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {images[0] ? (
                        <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{formData.crop_name || 'Crop Name'}</h4>
                      <p className="text-sm text-gray-600">{formData.quantity} {formData.unit} available</p>
                      <p className="text-lg font-bold text-emerald-600">Rs. {formData.price_per_unit || '0'}/{formData.unit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      List Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listing Created!</h3>
                <p className="text-gray-600 mb-4">Your crop listing is now live in the marketplace</p>
                <p className="text-sm text-gray-500">Redirecting to home...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
