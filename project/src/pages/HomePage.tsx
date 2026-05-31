import { useState, useEffect } from 'react';
import {
  Sun, CloudRain, Heart, MapPin, Star, TrendingUp,
  Search, ChevronRight, Leaf, Package, Truck, Shield, Clock,
  Filter, Cloud, Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  location: string;
}

interface CropListing {
  id: string;
  crop_name: string;
  crop_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  is_organic: boolean;
  images: string[];
  location: string;
  distance?: number;
  farmer: {
    name: string;
    avatar_url: string;
    rating?: number;
  };
}

const categories = [
  { id: 'grain', name: 'Rice', icon: '🌾', color: 'from-amber-400 to-orange-500' },
  { id: 'vegetable', name: 'Vegetables', icon: '🥬', color: 'from-green-400 to-emerald-500' },
  { id: 'fruit', name: 'Fruits', icon: '🍎', color: 'from-red-400 to-rose-500' },
  { id: 'pulse', name: 'Pulses', icon: '🫘', color: 'from-amber-500 to-yellow-600' },
  { id: 'spice', name: 'Cotton', icon: '☁️', color: 'from-gray-300 to-gray-400' },
  { id: 'spice', name: 'Spices', icon: '🌶️', color: 'from-red-500 to-orange-600' },
];

const mockWeather: WeatherData = {
  temp: 28,
  humidity: 65,
  condition: 'Partly Cloudy',
  location: 'Vijayawada',
};

const mockListings: CropListing[] = [
  {
    id: '1',
    crop_name: 'Premium Basmati Rice',
    crop_type: 'grain',
    quantity: 50,
    unit: 'quintal',
    price_per_unit: 2500,
    is_organic: true,
    images: ['https://images.pexels.com/photos/321880/pexels-photo-321880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Vijayawada, AP',
    distance: 25,
    farmer: { name: 'Rajesh Kumar', avatar_url: '', rating: 4.8 },
  },
  {
    id: '2',
    crop_name: 'Fresh Tomatoes',
    crop_type: 'vegetable',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 45,
    is_organic: true,
    images: ['https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Hyderabad, Telangana',
    distance: 85,
    farmer: { name: 'Sunita Devi', avatar_url: '', rating: 4.9 },
  },
  {
    id: '3',
    crop_name: 'Organic Cotton',
    crop_type: 'cash_crop',
    quantity: 30,
    unit: 'quintal',
    price_per_unit: 6200,
    is_organic: true,
    images: ['https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Guntur, AP',
    distance: 45,
    farmer: { name: 'Venkatesh Reddy', avatar_url: '', rating: 4.7 },
  },
  {
    id: '4',
    crop_name: 'Fresh Maize',
    crop_type: 'grain',
    quantity: 100,
    unit: 'quintal',
    price_per_unit: 1850,
    is_organic: false,
    images: ['https://images.pexels.com/photos/3270860/pexels-photo-3270860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Warangal, Telangana',
    distance: 120,
    farmer: { name: 'Amit Singh', avatar_url: '', rating: 4.6 },
  },
];

const priceComparison = [
  { crop: 'Rice', lowest: 2400, average: 2500, highest: 2700 },
  { crop: 'Tomato', lowest: 18, average: 22, highest: 30 },
  { crop: 'Cotton', lowest: 5800, average: 6200, highest: 6500 },
];

export default function BuyerHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [listings, setListings] = useState<CropListing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await supabase
      .from('crop_listings')
      .select('*, profiles!crop_listings_farmer_id_fkey(name, avatar_url)')
      .eq('status', 'available')
      .limit(10);

    if (data && data.length > 0) {
      setListings(data.map(item => ({
        id: item.id,
        crop_name: item.crop_name,
        crop_type: item.crop_type,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.price_per_unit,
        is_organic: item.is_organic,
        images: item.images || [],
        location: item.location,
        farmer: {
          name: item.profiles?.name || 'Farmer',
          avatar_url: item.profiles?.avatar_url || '',
        },
      })));
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredListings = activeCategory === 'all'
    ? listings
    : listings.filter(l => l.crop_type === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-emerald-100">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {profile?.name || 'Buyer'}
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, farmers, locations..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
              <Filter className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Weather Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                {getWeatherIcon(mockWeather.condition)}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockWeather.temp}°C</p>
                <p className="text-sm text-gray-600">{mockWeather.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-gray-600 justify-end mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{mockWeather.location}</span>
              </div>
              <p className="text-xs text-emerald-600">Good for transport</p>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`p-3 rounded-xl text-center transition-all ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white shadow-sm hover:shadow'
              }`}
            >
              <span className="text-2xl">🏪</span>
              <p className="text-xs font-medium mt-1">All</p>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white shadow-sm hover:shadow'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-xs font-medium mt-1">{cat.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Crops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Featured Crops</h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="text-emerald-600 text-sm font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredListings.slice(0, 4).map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/crop/${listing.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative h-32">
                  <img
                    src={listing.images[0] || 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                    alt={listing.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {listing.is_organic && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Organic
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 truncate">{listing.crop_name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-emerald-600">Rs. {listing.price_per_unit}</p>
                    <span className="text-xs text-gray-500">/ {listing.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                    <img
                      src={listing.farmer.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                      alt={listing.farmer.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">{listing.farmer.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="text-xs text-gray-600">{listing.farmer.rating || 4.5}</span>
                      </div>
                    </div>
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nearby Farmers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Nearby Farmers</h2>
            <button className="text-emerald-600 text-sm font-medium flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {[
              { name: 'Rajesh Kumar', location: 'Vijayawada', distance: '25 km', crops: 12 },
              { name: 'Sunita Devi', location: 'Hyderabad', distance: '85 km', crops: 8 },
              { name: 'Venkatesh Reddy', location: 'Guntur', distance: '45 km', crops: 15 },
            ].map((farmer, idx) => (
              <motion.div
                key={farmer.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-40 bg-white rounded-xl p-4 shadow-sm hover:shadow transition-all"
              >
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt={farmer.name}
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                />
                <h4 className="font-medium text-gray-900 text-center text-sm truncate">{farmer.name}</h4>
                <p className="text-xs text-gray-500 text-center">{farmer.distance}</p>
                <p className="text-xs text-emerald-600 text-center mt-1">{farmer.crops} crops</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Price Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Price Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-2">Crop</th>
                  <th className="text-right py-2">Lowest</th>
                  <th className="text-right py-2">Average</th>
                  <th className="text-right py-2">Highest</th>
                </tr>
              </thead>
              <tbody>
                {priceComparison.map((item) => (
                  <tr key={item.crop} className="border-b last:border-0">
                    <td className="py-2 font-medium text-gray-900">{item.crop}</td>
                    <td className="text-right py-2 text-green-600">Rs. {item.lowest}</td>
                    <td className="text-right py-2 text-gray-700">Rs. {item.average}</td>
                    <td className="text-right py-2 text-red-600">Rs. {item.highest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Trending Crops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Trending Crops</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Highest Demand', value: 'Rice', icon: TrendingUp, color: 'bg-blue-500' },
              { label: 'Best Price', value: 'Cotton', icon: Package, color: 'bg-green-500' },
              { label: 'Fastest Delivery', value: 'Tomato', icon: Truck, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-semibold mb-3">Why Buy on Grovix?</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, text: 'Verified Farmers' },
              { icon: Star, text: 'Quality Assured' },
              { icon: MapPin, text: 'Location Verified' },
              { icon: Clock, text: 'Fresh Produce' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white">
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
