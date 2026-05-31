import { useState } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, LineChart,
  Calendar, Leaf, DollarSign, Package, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';

const priceData = [
  { month: 'Jan', rice: 2050, wheat: 1900, tomato: 40 },
  { month: 'Feb', rice: 2120, wheat: 1950, tomato: 42 },
  { month: 'Mar', rice: 2180, wheat: 1980, tomato: 38 },
  { month: 'Apr', rice: 2150, wheat: 2000, tomato: 45 },
  { month: 'May', rice: 2200, wheat: 2050, tomato: 48 },
  { month: 'Jun', rice: 2250, wheat: 2100, tomato: 52 },
];

const cropTrends = [
  { name: 'Rice', trend: 5.2, price: 2250, unit: 'quintal', change: 'up' },
  { name: 'Wheat', trend: -2.1, price: 1980, unit: 'quintal', change: 'down' },
  { name: 'Tomato', trend: 12.5, price: 52, unit: 'kg', change: 'up' },
  { name: 'Onion', trend: -8.3, price: 32, unit: 'kg', change: 'down' },
  { name: 'Potato', trend: 3.4, price: 28, unit: 'kg', change: 'up' },
];

const seasonalData = [
  { crop: 'Paddy', season: 'Kharif', startMonth: 'Jun', endMonth: 'Nov', demand: 'High' },
  { crop: 'Wheat', season: 'Rabi', startMonth: 'Oct', endMonth: 'Mar', demand: 'Medium' },
  { crop: 'Maize', season: 'Zaid', startMonth: 'Feb', endMonth: 'May', demand: 'High' },
];

const marketDemand = [
  { day: 'Mon', volume: 1200 },
  { day: 'Tue', volume: 1450 },
  { day: 'Wed', volume: 1600 },
  { day: 'Thu', volume: 1380 },
  { day: 'Fri', volume: 1720 },
  { day: 'Sat', volume: 2100 },
  { day: 'Sun', volume: 1850 },
];

export default function InsightsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCrop, setSelectedCrop] = useState('rice');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Market Insights</h1>
              <p className="text-emerald-100 text-sm">Real-time prices and trends</p>
            </div>
          </div>

          {/* Time Range Tabs */}
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  timeRange === range
                    ? 'bg-white text-emerald-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs. 45.2K</p>
            <p className="text-sm text-gray-600">Avg. Transaction</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                2.3K tons
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">5,842</p>
            <p className="text-sm text-gray-600">Trades This Month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs. 2,150</p>
            <p className="text-sm text-gray-600">Rice/quintal</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">
                Premium
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">+25%</p>
            <p className="text-sm text-gray-600">Organic Premium</p>
          </motion.div>
        </div>

        {/* Price Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <LineChart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Price Trends</h3>
                <p className="text-sm text-gray-600">6 Months Overview</p>
              </div>
            </div>

            <div className="flex gap-2">
              {['rice', 'wheat', 'tomato'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCrop === crop
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedCrop}
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Crop Trends Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Crops This Season</h3>
              <p className="text-sm text-gray-600">Current market trends</p>
            </div>
          </div>

          <div className="space-y-3">
            {cropTrends.map((crop) => (
              <div
                key={crop.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-600">per {crop.unit}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rs. {crop.price.toLocaleString()}</p>
                  <div className={`flex items-center justify-end gap-1 ${
                    crop.change === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crop.change === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{crop.trend}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Market Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Market Volume</h3>
              <p className="text-sm text-gray-600">Trading activity this week</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketDemand}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Seasonal Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Seasonal Calendar</h3>
              <p className="text-emerald-100 text-sm">Best time to sell</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {seasonalData.map((item) => (
              <div key={item.crop} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-white" />
                  <h4 className="font-semibold text-white">{item.crop}</h4>
                </div>
                <p className="text-emerald-100 text-sm mb-2">{item.season} Season</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-100">
                    {item.startMonth} - {item.endMonth}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.demand === 'High' ? 'bg-green-400 text-green-900' : 'bg-amber-400 text-amber-900'
                  }`}>
                    {item.demand} Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Market Tips</h3>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Best Selling Day</p>
                <p className="text-sm text-gray-600">Saturday sees highest trading volume. Consider listing on Friday evening.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-blue-50 rounded-xl">
              <Leaf className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Organic Premium</p>
                <p className="text-sm text-gray-600">Organic produce commands 20-30% premium pricing.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-amber-50 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Seasonal Insight</p>
                <p className="text-sm text-gray-600">Kharif crops are in high demand. Plan your harvest accordingly.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
