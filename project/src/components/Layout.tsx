import { Home, ShoppingCart, PlusCircle, TrendingUp, Users, User, Heart, MessageCircle, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const farmerNavItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/insights', icon: TrendingUp, label: 'Insights' },
  { path: '/sell', icon: PlusCircle, label: 'Sell' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const buyerNavItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/marketplace', icon: ShoppingCart, label: 'Browse' },
  { path: '/wishlist', icon: Heart, label: 'Wishlist' },
  { path: '/orders', icon: Package, label: 'Orders' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const navItems = profile?.role === 'farmer' ? farmerNavItems : buyerNavItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                  active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-emerald-100 rounded-xl -m-2"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-6 h-6 relative ${active ? 'text-emerald-600' : ''}`} />
                </div>
                <span className={`text-xs mt-1 font-medium ${active ? 'text-emerald-600' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
