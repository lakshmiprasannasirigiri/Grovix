import { useEffect, useState } from 'react';
import { Sprout, Leaf, Truck, Shield, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: Sprout, title: 'AI Crop Scanner', desc: 'Detect diseases instantly with smart scanning' },
  { icon: TrendingUp, title: 'Market Insights', desc: 'Real-time prices and market trends' },
  { icon: Truck, title: 'Direct Farm-to-Buyer', desc: 'No middlemen, fair prices for all' },
  { icon: Shield, title: 'Verified Farmers', desc: 'Safe and secure transactions' },
  { icon: Leaf, title: 'Fresh Produce', desc: 'Quality crops with traceability' },
  { icon: Users, title: 'Growing Community', desc: 'Connect with farmers and buyers' },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Empowering Farmers',
      subtitle: 'Technology at Your Fingertips',
      image: 'https://images.pexels.com/photos/2165759/pexels-photo-2165759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Smart Farming',
      subtitle: 'AI-Powered Disease Detection',
      image: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Fair Trade',
      subtitle: 'Direct Connections with Buyers',
      image: 'https://images.pexels.com/photos/3270860/pexels-photo-3270860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/85 to-emerald-900/90 z-10" />
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl rotate-12 transform flex items-center justify-center shadow-2xl">
                  <Leaf className="w-12 h-12 text-white -rotate-12" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-emerald-900" />
                </div>
              </div>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-white mb-3 tracking-tight">
              Gro<span className="text-emerald-400">vix</span>
            </h1>
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl text-emerald-100 font-light"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10"
          >
            {features.slice(0, 6).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
              >
                <feature.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-white text-xs sm:text-sm font-medium">{feature.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-lg backdrop-blur-sm border border-white/30 transition-all"
            >
              Sign In
            </button>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-emerald-400 w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From farm to table, Grovix supports every step of the journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '150+', label: 'Active Users' },
              { value: '320+', label: 'Crops Listed' },
              { value: '12', label: 'Cities Covered' },
              { value: '95%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Grovix Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account as a farmer or buyer</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600"> Farmers list crops, buyers browse and compare</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trade</h3>
              <p className="text-gray-600">Complete secure transactions with verified users</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join Grovix today and experience the future of agriculture.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105"
            >
              Create Free Account
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Grovix</span>
            </div>
            <p className="text-sm">
              Connecting farmers and buyers with technology. Made with care for agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
