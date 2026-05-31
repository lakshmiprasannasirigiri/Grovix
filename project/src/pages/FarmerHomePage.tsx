import { useState, useEffect } from 'react';
import {
  Cloud, CloudRain, Sun, Leaf, TrendingUp, Truck, Users, Landmark,
  Camera, Bell, ChevronRight, Sprout, Thermometer, Droplets,
  Wind, Package, ArrowRight, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
  rainChance: number;
  forecast: { day: string; temp: number; icon: string }[];
}

interface MarketPrice {
  crop: string;
  price: number;
  change: number;
  unit: string;
}

const mockWeather: WeatherData = {
  temp: 28,
  humidity: 65,
  wind: 12,
  condition: 'Partly Cloudy',
  rainChance: 40,
  forecast: [
    { day: 'Mon', temp: 29, icon: 'sun' },
    { day: 'Tue', temp: 27, icon: 'cloud-rain' },
    { day: 'Wed', temp: 28, icon: 'cloud' },
    { day: 'Thu', temp: 30, icon: 'sun' },
    { day: 'Fri', temp: 26, icon: 'cloud-rain' },
  ],
};

const marketPrices: MarketPrice[] = [
  { crop: 'Rice', price: 2150, change: 2.5, unit: 'quintal' },
  { crop: 'Wheat', price: 1980, change: -1.2, unit: 'quintal' },
  { crop: 'Tomato', price: 45, change: 8.3, unit: 'kg' },
  { crop: 'Cotton', price: 6200, change: 3.1, unit: 'quintal' },
];

const schemes = [
  {
    name: 'PM-KISAN',
    description: 'Direct income support of Rs. 6000 per year',
    eligibility: 'All landholding farmer families',
  },
  {
    name: 'Crop Insurance',
    description: 'Protection against crop failure',
    eligibility: 'Farmers with bank accounts',
  },
];

const cropAdvisory = {
  season: 'Kharif 2024',
  recommendations: [
    {
      crop: 'Paddy',
      reason: 'Ideal conditions for transplanting. Expected good rainfall.',
      water: 'Maintain 2-3 cm water level',
      fertilizer: 'Apply DAP at transplanting',
    },
    {
      crop: 'Maize',
      reason: 'Good for early sowing. High market demand.',
      water: 'Irrigate at critical stages',
      fertilizer: 'Apply NPK 20:20:20',
    },
  ],
  alerts: [
    'Rain expected in 2 days - avoid pesticide spraying',
    'Monitor for stem borer in paddy fields',
  ],
};

export default function FarmerHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchOrdersCount();
  }, []);

  const fetchOrdersCount = async () => {
    if (!profile) return;

    const { data: listings } = await supabase
      .from('crop_listings')
      .select('id')
      .eq('farmer_id', profile.id);

    if (listings && listings.length > 0) {
      const listingIds = listings.map(l => l.id);
      const { count } = await supabase
        .from('marketplace_orders')
        .select('*', { count: 'exact', head: true })
        .in('listing_id', listingIds);
      setOrdersCount(count || 0);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'sun':
        return <Sun className="w-10 h-10 text-yellow-500" />;
      case 'rain':
      case 'cloud-rain':
        return <CloudRain className="w-10 h-10 text-blue-500" />;
      default:
        return <Cloud className="w-10 h-10 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {profile?.name || 'Farmer'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
              >
                <img
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                {getWeatherIcon(mockWeather.condition)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{mockWeather.temp}°C</h3>
                <p className="text-gray-600">{mockWeather.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-500 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-medium">{mockWeather.rainChance}% rain</span>
              </div>
              <p className="text-gray-500 text-sm">Today</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Humidity</p>
              <p className="font-semibold text-gray-900">{mockWeather.humidity}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Wind className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Wind</p>
              <p className="font-semibold text-gray-900">{mockWeather.wind} km/h</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Feels Like</p>
              <p className="font-semibold text-gray-900">30°C</p>
            </div>
          </div>

          {/* Farming Advice */}
          {cropAdvisory.alerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  {cropAdvisory.alerts.map((alert, idx) => (
                    <p key={idx} className="text-sm text-amber-800">{alert}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5-Day Forecast */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
            {mockWeather.forecast.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{day.day}</p>
                <div className="w-8 h-8 mx-auto mb-1">
                  {day.icon === 'sun' ? (
                    <Sun className="w-8 h-8 text-yellow-500" />
                  ) : day.icon === 'cloud-rain' ? (
                    <CloudRain className="w-8 h-8 text-blue-500" />
                  ) : (
                    <Cloud className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">{day.temp}°</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/scan')}
            className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-200 text-center group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Scan Crop</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => navigate('/sell')}
            className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-200 text-center group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Sell Crops</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/orders')}
            className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-200 text-center group relative"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Orders</p>
            {ordersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Crop Advisor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Crop Advisor</h3>
                <p className="text-sm text-gray-600">{cropAdvisory.season}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/insights')}
              className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {cropAdvisory.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.crop}</h4>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Droplets className="w-3 h-3" />
                    <span>{rec.water}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Leaf className="w-3 h-3" />
                    <span>{rec.fertilizer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Government Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl flex items-center justify-center">
              <Landmark className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Govt Schemes</h3>
              <p className="text-sm text-gray-600">Subsidies & Benefits</p>
            </div>
          </div>

          <div className="space-y-3">
            {schemes.map((scheme, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <h4 className="font-semibold text-gray-900 mb-1">{scheme.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                <p className="text-xs text-emerald-600 font-medium">{scheme.eligibility}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Prices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Market Prices</h3>
                <p className="text-sm text-gray-600">Today's Rates</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/insights')}
              className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              View Trends <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {marketPrices.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.crop}</p>
                    <p className="text-xs text-gray-600">per {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rs. {item.price}</p>
                  <p className={`text-xs font-medium flex items-center justify-end gap-1 ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transport Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Transport Services</h3>
                <p className="text-blue-100 text-sm">Book trucks & logistics</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Community Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600">Connect with farmers</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/community')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <p className="text-xs text-gray-500 mb-1">Latest Discussion</p>
              <p className="font-medium text-gray-900 text-sm">Paddy pest control tips</p>
              <p className="text-xs text-emerald-600 mt-1">24 replies</p>
            </button>
            <button
              onClick={() => navigate('/community')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <p className="text-xs text-gray-500 mb-1">Ask Question</p>
              <p className="font-medium text-gray-900 text-sm">Get expert advice</p>
              <p className="text-xs text-emerald-600 mt-1">Start now</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
