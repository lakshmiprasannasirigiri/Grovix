import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, MapPin, Star, Leaf, Shield,
  MessageCircle, Truck, Package, Check,
  AlertCircle, Sun, Droplets
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CropDetail {
  id: string;
  crop_name: string;
  crop_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  is_organic: boolean;
  description: string;
  images: string[];
  location: string;
  created_at: string;
  farmer: {
    id: string;
    name: string;
    avatar_url: string;
    phone?: string;
    location?: string;
    rating?: number;
    total_sales?: number;
    verified?: boolean;
  };
}

const traceData = [
  { stage: 'Sowing', date: '15 Jun 2024', icon: Sun },
  { stage: 'Harvested', date: '28 Oct 2024', icon: Package },
  { stage: 'Stored', date: '30 Oct 2024', icon: Droplets },
  { stage: 'Ready for Delivery', date: 'Today', icon: Truck },
];

export default function CropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchCropDetails();
  }, [id]);

  const fetchCropDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('crop_listings')
      .select('*, profiles!crop_listings_farmer_id_fkey(id, name, avatar_url, phone, location)')
      .eq('id', id)
      .single();

    if (data && !error) {
      setCrop({
        id: data.id,
        crop_name: data.crop_name,
        crop_type: data.crop_type,
        quantity: data.quantity,
        unit: data.unit,
        price_per_unit: data.price_per_unit,
        is_organic: data.is_organic,
        description: data.description,
        images: data.images?.length > 0 ? data.images : [
          'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        location: data.location,
        created_at: data.created_at,
        farmer: {
          id: data.profiles?.id,
          name: data.profiles?.name || 'Farmer',
          avatar_url: data.profiles?.avatar_url || '',
          phone: data.profiles?.phone || '+91 98765 43210',
          location: data.profiles?.location || data.location,
          rating: 4.8,
          total_sales: 45,
          verified: true,
        },
      });
    }
    setLoading(false);
  };

  const handleBuy = async () => {
    if (!crop || !profile) return;

    const { error } = await supabase.from('marketplace_orders').insert([{
      buyer_id: profile.id,
      listing_id: crop.id,
      quantity: quantity,
      total_price: quantity * crop.price_per_unit,
      delivery_address: profile.location || 'Address pending',
    }]);

    if (!error) {
      setShowBuyModal(false);
      navigate('/orders');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop not found</h2>
          <button onClick={() => navigate(-1)} className="text-emerald-600">Go back</button>
        </div>
      </div>
    );
  }

  const totalPrice = quantity * crop.price_per_unit;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-80 bg-gray-200">
          <img
            src={crop.images[activeImage]}
            alt={crop.crop_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Indicators */}
        {crop.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {crop.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeImage === idx ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Title & Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              {crop.is_organic && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                  <Leaf className="w-3 h-3" />
                  Organic
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{crop.crop_name}</h1>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">Rs. {crop.price_per_unit}</span>
            <span className="text-gray-500">per {crop.unit}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{crop.quantity} {crop.unit} available</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{crop.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Farmer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <img
              src={crop.farmer.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
              alt={crop.farmer.name}
              className="w-14 h-14 rounded-full border-2 border-emerald-100"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{crop.farmer.name}</h3>
                {crop.farmer.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{crop.farmer.rating}</span>
                </div>
                <span>•</span>
                <span>{crop.farmer.total_sales} sales</span>
              </div>
            </div>
            <button className="p-3 bg-emerald-100 rounded-xl">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </motion.div>

        {/* Traceability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">Farm-to-Buyer Traceability</h3>
          </div>
          <div className="flex items-center justify-between">
            {traceData.map((item, idx) => (
              <div key={item.stage} className="flex-1 text-center relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-xs font-medium">{item.stage}</p>
                <p className="text-emerald-100 text-xs">{item.date}</p>
                {idx < traceData.length - 1 && (
                  <div className="absolute top-5 left-[60%] w-[80%] h-0.5 bg-white/30" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        {crop.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{crop.description}</p>
          </motion.div>
        )}

        {/* Safety Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Safety Guaranteed</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Verified Farmer</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-4 h-4 text-amber-600" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Location Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Report Fraud</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(crop.quantity, quantity + 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"
            >
              +
            </button>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">Total Price</p>
            <p className="text-xl font-bold text-gray-900">Rs. {totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowBuyModal(true)}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setShowBuyModal(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src={crop.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{crop.crop_name}</p>
                  <p className="text-sm text-gray-600">{crop.farmer.name}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity} {crop.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per {crop.unit}</span>
                  <span className="font-medium">Rs. {crop.price_per_unit}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBuy}
              className="w-full py-4 bg-emerald-500 text-white rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-colors"
            >
              Place Order
            </button>
            <button
              onClick={() => setShowBuyModal(false)}
              className="w-full py-3 text-gray-600 mt-2"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
