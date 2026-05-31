import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, Clock, ChevronRight, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  crop_name: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  farmer_name: string;
  location: string;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    crop_name: 'Premium Basmati Rice',
    quantity: 2,
    total_price: 5000,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    farmer_name: 'Rajesh Kumar',
    location: 'Vijayawada, AP',
    image: 'https://images.pexels.com/photos/321880/pexels-photo-321880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    crop_name: 'Fresh Tomatoes',
    quantity: 50,
    total_price: 2250,
    status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    farmer_name: 'Sunita Devi',
    location: 'Hyderabad, Telangana',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const statusConfig = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: Truck },
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [profile]);

  const fetchOrders = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        crop_listings!marketplace_orders_listing_id_fkey (
          crop_name,
          images,
          profiles!crop_listings_farmer_id_fkey (
            name
          )
        )
      `)
      .eq('buyer_id', profile.id)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setOrders(data.map(order => ({
        id: order.id,
        crop_name: order.crop_listings?.crop_name || 'Unknown',
        quantity: order.quantity,
        total_price: order.total_price,
        status: order.status,
        created_at: order.created_at,
        farmer_name: order.crop_listings?.profiles?.name || 'Farmer',
        location: order.delivery_address,
        image: order.crop_listings?.images?.[0] || '',
      })));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(o => o.status === activeFilter);

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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-600">{orders.length} total orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', 'pending', 'confirmed', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
            >
              Browse Crops
            </button>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <img
                    src={order.image || 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                    alt={order.crop_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{order.crop_name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{order.farmer_name}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">Rs. {order.total_price.toLocaleString()}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{order.location}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <span className="font-medium">{order.quantity} units</span>
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                      <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">
                        Cancel
                      </button>
                      <button className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">
                        Track Order
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
