import { useState, useEffect } from 'react';
import {
  ArrowLeft, Plus, Search, MessageCircle, Heart, Share2,
  Clock, TrendingUp, Tag, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: 'question' | 'experience' | 'tips' | 'news';
  author: {
    name: string;
    avatar_url: string;
    role: 'farmer' | 'buyer';
  };
  likes_count: number;
  created_at: string;
  replies?: number;
}

const categories = [
  { value: 'all', label: 'All Posts', icon: TrendingUp },
  { value: 'question', label: 'Questions', icon: MessageCircle },
  { value: 'experience', label: 'Experiences', icon: Award },
  { value: 'tips', label: 'Tips & Tricks', icon: Tag },
];

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'Best practices for paddy transplanting this season',
    content: 'Sharing my experience with direct wet seeding method...',
    category: 'experience',
    author: { name: 'Rajesh Kumar', avatar_url: '', role: 'farmer' },
    likes_count: 24,
    replies: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'How to control stem borer in rice?',
    content: 'My field has been affected by stem borer. Please help!',
    category: 'question',
    author: { name: 'Amit Singh', avatar_url: '', role: 'farmer' },
    likes_count: 18,
    replies: 12,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Organic pest control tips that worked for me',
    content: 'Here are some natural remedies that helped protect my crops...',
    category: 'tips',
    author: { name: 'Sunita Devi', avatar_url: '', role: 'farmer' },
    likes_count: 45,
    replies: 15,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'question' as const });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles!community_posts_author_id_fkey(name, avatar_url, role)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && !error && data.length > 0) {
      const transformed = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        author: {
          name: post.profiles?.name || 'User',
          avatar_url: post.profiles?.avatar_url || '',
          role: post.profiles?.role || 'farmer',
        },
        likes_count: post.likes_count,
        created_at: post.created_at,
      }));
      setPosts(transformed);
    }
  };

  const handleCreatePost = async () => {
    if (!profile || !newPost.title || !newPost.content) return;

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        author_id: profile.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
      }])
      .select()
      .single();

    if (data && !error) {
      setPosts([{
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        author: {
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: profile.role as 'farmer' | 'buyer',
        },
        likes_count: 0,
        created_at: data.created_at,
      }, ...posts]);

      setNewPost({ title: '', content: '', category: 'question' });
      setShowNewPost(false);
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    await supabase
      .from('community_posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', postId);

    setPosts(posts.map(p =>
      p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
    ));
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Community</h1>
              <p className="text-emerald-100 text-sm">Connect with fellow farmers</p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="p-3 bg-white text-emerald-600 rounded-xl font-semibold shadow-lg flex items-center gap-2 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Post</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      post.author.role === 'farmer'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.author.role === 'farmer' ? 'Farmer' : 'Buyer'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(post.created_at)}</span>
                    <span className="mx-1">•</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      post.category === 'question' ? 'bg-blue-100 text-blue-700' :
                      post.category === 'tips' ? 'bg-amber-100 text-amber-700' :
                      post.category === 'experience' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {expandedPost === post.id
                      ? post.content
                      : post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '')}
                  </p>

                  {post.content.length > 150 && (
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="text-emerald-600 text-sm font-medium mt-2 hover:underline"
                    >
                      {expandedPost === post.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.replies || 0} replies</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to start a discussion!</p>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowNewPost(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['question', 'experience', 'tips'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, category: cat as any })}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          newPost.category === cat
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your topic?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
