import { useState } from 'react';
import { ArrowLeft, Heart, MapPin, Star, Trash2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const mockWishlist = [
  {
    id: '1',
    crop_name: 'Premium Basmati Rice',
    price_per_unit: 2500,
    unit: 'quintal',
    location: 'Vijayawada, AP',
    is_organic: true,
    image: 'https://images.pexels.com/photos/321880/pexels-photo-321880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    farmer: { name: 'Rajesh Kumar', rating: 4.8 },
  },
  {
    id: '2',
    crop_name: 'Fresh Tomatoes',
    price_per_unit: 45,
    unit: 'kg',
    location: 'Hyderabad, Telangana',
    is_organic: true,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    farmer: { name: 'Sunita Devi', rating: 4.9 },
  },
];

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(mockWishlist);

  const removeItem = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wishlist</h1>
            <p className="text-sm text-gray-600">{wishlist.length} saved crops</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved crops</h3>
            <p className="text-gray-600 mb-6">Start adding crops to your wishlist</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
            >
              Browse Crops
            </button>
          </div>
        ) : (
          wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div onClick={() => navigate(`/crop/${item.id}`)} className="flex cursor-pointer">
                <div className="relative w-28 h-28">
                  <img
                    src={item.image}
                    alt={item.crop_name}
                    className="w-full h-full object-cover"
                  />
                  {item.is_organic && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-0.5">
                      <Leaf className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.crop_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Rs. {item.price_per_unit}/{item.unit}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-gray-700">{item.farmer.name}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-xs text-gray-600">{item.farmer.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
