import { useState, useEffect } from 'react';
import {
  Search, MapPin, Leaf, Star, ChevronRight,
  Grid3X3, List, ArrowLeft, SlidersHorizontal, X, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface CropListing {
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
  farmer: {
    name: string;
    avatar_url: string;
  };
  distance?: number;
}

const mockListings: CropListing[] = [
  {
    id: '1',
    crop_name: 'Organic Tomatoes',
    crop_type: 'vegetable',
    quantity: 500,
    unit: 'kg',
    price_per_unit: 45,
    is_organic: true,
    description: 'Fresh organic tomatoes, naturally ripened',
    images: ['https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Pune, Maharashtra',
    farmer: {
      name: 'Rajesh Kumar',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 25,
  },
  {
    id: '2',
    crop_name: 'Basmati Rice',
    crop_type: 'grain',
    quantity: 10,
    unit: 'quintal',
    price_per_unit: 4500,
    is_organic: false,
    description: 'Premium quality Basmati rice',
    images: ['https://images.pexels.com/photos/321880/pexels-photo-321880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Ludhiana, Punjab',
    farmer: {
      name: 'Harpreet Singh',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 120,
  },
  {
    id: '3',
    crop_name: 'Fresh Mangoes',
    crop_type: 'fruit',
    quantity: 100,
    unit: 'kg',
    price_per_unit: 80,
    is_organic: true,
    description: 'Alphonso mangoes, naturally ripened',
    images: ['https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Ratnagiri, Maharashtra',
    farmer: {
      name: 'Suresh Patil',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 85,
  },
  {
    id: '4',
    crop_name: 'Red Onions',
    crop_type: 'vegetable',
    quantity: 1000,
    unit: 'kg',
    price_per_unit: 35,
    is_organic: false,
    description: 'Fresh red onions, good quality',
    images: ['https://images.pexels.com/photos/149632/pexels-photo-149632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Nashik, Maharashtra',
    farmer: {
      name: 'Vikram Deshmukh',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 45,
  },
  {
    id: '5',
    crop_name: 'Organic Wheat',
    crop_type: 'grain',
    quantity: 20,
    unit: 'quintal',
    price_per_unit: 2500,
    is_organic: true,
    description: 'Certified organic wheat, no chemicals',
    images: ['https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Bhopal, Madhya Pradesh',
    farmer: {
      name: 'Rahul Sharma',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 200,
  },
  {
    id: '6',
    crop_name: 'Green Chillies',
    crop_type: 'vegetable',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 60,
    is_organic: false,
    description: 'Spicy green chillies, farm fresh',
    images: ['https://images.pexels.com/photos/736367/pexels-photo-736367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    location: 'Guntur, Andhra Pradesh',
    farmer: {
      name: 'Venkatesh Reddy',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    distance: 350,
  },
];

const cropTypes = ['All', 'grain', 'vegetable', 'fruit', 'pulse', 'spice'];
const sortOptions = ['Nearest', 'Price: Low to High', 'Price: High to Low', 'Quantity'];

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<CropListing[]>(mockListings);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Nearest');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('crop_listings')
      .select('*, profiles!crop_listings_farmer_id_fkey(name, avatar_url)')
      .eq('status', 'available')
      .limit(20);

    if (data && !error) {
      // Transform data to match local type
      const transformed = data.map(item => ({
        id: item.id,
        crop_name: item.crop_name,
        crop_type: item.crop_type,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.price_per_unit,
        is_organic: item.is_organic,
        description: item.description,
        images: item.images || [],
        location: item.location,
        farmer: {
          name: item.profiles?.name || 'Farmer',
          avatar_url: item.profiles?.avatar_url || '',
        },
      }));
      // Only use mock data if database is empty
      if (transformed.length > 0) {
        setListings(transformed);
      }
    }
  };

  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || listing.crop_type === selectedType;
      const matchesOrganic = !organicOnly || listing.is_organic;
      return matchesSearch && matchesType && matchesOrganic;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price_per_unit - b.price_per_unit;
        case 'Price: High to Low':
          return b.price_per_unit - a.price_per_unit;
        case 'Nearest':
          return (a.distance || 0) - (b.distance || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops, locations..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
              {cropTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Min"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Max"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Organic Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Crop Type</h3>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <span className="text-gray-700">Organic Only</span>
                      <div
                        onClick={() => setOrganicOnly(!organicOnly)}
                        className={`w-12 h-6 rounded-full transition-colors ${organicOnly ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${organicOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  </div>

                  {/* Distance */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Distance</h3>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      defaultValue="500"
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0 km</span>
                      <span>500 km</span>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {sortOptions.map(option => (
                        <label
                          key={option}
                          onClick={() => setSortBy(option)}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
                        >
                          <span className="text-gray-700">{option}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortBy === option ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                            {sortBy === option && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-gray-600 mb-4">{filteredListings.length} crops available</p>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/listing/${listing.id}`)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={listing.images[0] || `https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={listing.crop_name}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === 'grid' ? 'h-48' : 'h-32'
                  }`}
                />
                {listing.is_organic && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Organic
                  </div>
                )}
                {listing.distance && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.distance} km
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {listing.crop_name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      Rs. {listing.price_per_unit}
                    </p>
                    <p className="text-xs text-gray-500">per {listing.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {listing.quantity} {listing.unit}
                    </p>
                    <p className="text-xs text-gray-500">available</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <img
                    src={listing.farmer.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                    alt={listing.farmer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{listing.farmer.name}</p>
                    <p className="text-xs text-gray-500">Verified Farmer</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
