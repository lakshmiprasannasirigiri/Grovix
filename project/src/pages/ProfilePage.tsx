import { useState, useEffect } from 'react';
import {
  ArrowLeft, User, MapPin, Phone, Globe, LogOut,
  Settings, Package, ShoppingBag, Heart, Bell,
  ChevronRight, Camera, Edit2, Check, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

interface UserStats {
  listings: number;
  orders: number;
  saved: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, signOut, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats>({ listings: 0, orders: 0, saved: 0 });
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
  });

  useEffect(() => {
    fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;

    const [listingsRes, ordersRes] = await Promise.all([
      supabase.from('crop_listings').select('id', { count: 'exact' }).eq('farmer_id', profile.id),
      supabase.from('marketplace_orders').select('id', { count: 'exact' }).eq('buyer_id', profile.id),
    ]);

    setStats({
      listings: listingsRes.count || 0,
      orders: ordersRes.count || 0,
      saved: 3,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile(editForm);
    setLoading(false);
    if (!error) setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <button className="ml-auto p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={profile?.name}
                  className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    profile?.role === 'farmer'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {profile?.role === 'farmer' ? 'Farmer' : 'Buyer'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile?.location || 'Location not set'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate('/my-listings')}
                className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-2xl font-bold text-gray-900">{stats.listings}</p>
                <p className="text-sm text-gray-600">Listings</p>
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                <p className="text-sm text-gray-600">Orders</p>
              </button>
              <button
                onClick={() => navigate('/saved')}
                className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-2xl font-bold text-gray-900">{stats.saved}</p>
                <p className="text-sm text-gray-600">Saved</p>
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-200 p-6 bg-gray-50"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="divide-y divide-gray-100">
            <button
              onClick={() => navigate('/my-listings')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">My Listings</p>
                  <p className="text-sm text-gray-600">Manage your crop listings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/my-orders')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">My Orders</p>
                  <p className="text-sm text-gray-600">View your purchase history</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/saved')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Saved Items</p>
                  <p className="text-sm text-gray-600">Your favorite crops</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Settings</h3>
          </div>

          {/* Language Selection */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Language</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    language === lang.code
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-medium text-sm">{lang.native}</p>
                  <p className={`text-xs ${language === lang.code ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {lang.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">On</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </motion.div>

        {/* Sign Out */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleSignOut}
          className="mt-6 w-full p-4 bg-white rounded-2xl shadow-sm text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>

        {/* App Version */}
        <p className="text-center text-sm text-gray-500 mt-6 mb-4">
          Grovix v1.0.0
        </p>
      </div>
    </div>
  );
}
