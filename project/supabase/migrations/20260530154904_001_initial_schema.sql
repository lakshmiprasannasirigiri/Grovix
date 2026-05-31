/*
  # FertiBloomix - Initial Database Schema

  1. Purpose
    Complete database schema for a farmer marketplace and assistance platform.
    Includes user management, crop marketplace, community features, and AI crop scanning.

  2. New Tables
    - `profiles` - User profiles with farmer/buyer role
      - `id` (uuid, primary key, references auth.users)
      - `name` (text, user's full name)
      - `role` (text, either 'farmer' or 'buyer')
      - `phone` (text, contact number)
      - `location` (text, farm/business location)
      - `avatar_url` (text, profile image)
      - `language` (text, preferred language, default 'en')
      - `created_at` (timestamp)
    
    - `crop_listings` - Crops posted for sale by farmers
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references profiles)
      - `crop_name` (text, name of crop)
      - `crop_type` (text, category: grain, vegetable, fruit, etc.)
      - `quantity` (numeric, amount available)
      - `unit` (text, kg, quintal, ton)
      - `price_per_unit` (numeric, price)
      - `is_organic` (boolean, organic certification)
      - `description` (text, crop details)
      - `images` (text array, crop images)
      - `location` (text, pickup location)
      - `status` (text, available, sold, reserved)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `marketplace_orders` - Orders placed by buyers
      - `id` (uuid, primary key)
      - `buyer_id` (uuid, references profiles)
      - `listing_id` (uuid, references crop_listings)
      - `quantity` (numeric, amount ordered)
      - `total_price` (numeric, total cost)
      - `status` (text, pending, confirmed, completed, cancelled)
      - `delivery_address` (text, where to deliver)
      - `notes` (text, order notes)
      - `created_at` (timestamp)
    
    - `crop_scans` - AI crop disease detection history
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `image_url` (text, uploaded image)
      - `detected_disease` (text, disease name if any)
      - `confidence_score` (numeric, AI confidence)
      - `treatment_suggestion` (text, how to treat)
      - `crop_name` (text, identified crop)
      - `created_at` (timestamp)
    
    - `community_posts` - Discussion forum posts
      - `id` (uuid, primary key)
      - `author_id` (uuid, references profiles)
      - `title` (text, post title)
      - `content` (text, post body)
      - `category` (text, question, experience, tips, news)
      - `likes_count` (integer, number of likes)
      - `created_at` (timestamp)
    
    - `community_comments` - Comments on posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, references community_posts)
      - `author_id` (uuid, references profiles)
      - `content` (text, comment text)
      - `created_at` (timestamp)
    
    - `messages` - Direct messages between users
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `content` (text, message body)
      - `read` (boolean, whether message was read)
      - `created_at` (timestamp)

  3. Security
    - Row Level Security (RLS) enabled on ALL tables
    - Policies restrict data access based on authentication and ownership
    - Users can only read/write their own data
    - Marketplace listings are viewable by all authenticated users
    - Buyers can only see their own orders, farmers can see orders for their listings
    - Community posts are viewable by all, editable by author only

  4. Important Notes
    - All tables use uuid primary keys with gen_random_uuid()
    - Timestamps use timestamptz with DEFAULT now()
    - Foreign key constraints ensure referential integrity
    - ON DELETE CASCADE for dependent data (comments when post deleted)
    - Indexes added for frequently queried columns
*/

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('farmer', 'buyer')),
  phone text DEFAULT '',
  location text DEFAULT '',
  avatar_url text DEFAULT '',
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- CROP LISTINGS TABLE
CREATE TABLE IF NOT EXISTS crop_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  crop_type text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL DEFAULT 'kg',
  price_per_unit numeric NOT NULL CHECK (price_per_unit >= 0),
  is_organic boolean DEFAULT false,
  description text DEFAULT '',
  images text[] DEFAULT '{}',
  location text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- MARKETPLACE ORDERS TABLE
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
  quantity numeric NOT NULL CHECK (quantity > 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  delivery_address text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- CROP SCANS TABLE
CREATE TABLE IF NOT EXISTS crop_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  detected_disease text DEFAULT '',
  confidence_score numeric DEFAULT 0,
  treatment_suggestion text DEFAULT '',
  crop_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'experience' CHECK (category IN ('question', 'experience', 'tips', 'news')),
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- COMMUNITY COMMENTS TABLE
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- CROP LISTINGS POLICIES
CREATE POLICY "All authenticated users can view available listings"
  ON crop_listings FOR SELECT
  TO authenticated
  USING (status = 'available' OR farmer_id = auth.uid());

CREATE POLICY "Farmers can create listings"
  ON crop_listings FOR INSERT
  TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can update own listings"
  ON crop_listings FOR UPDATE
  TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can delete own listings"
  ON crop_listings FOR DELETE
  TO authenticated
  USING (farmer_id = auth.uid());

-- MARKETPLACE ORDERS POLICIES
CREATE POLICY "Buyers can view own orders"
  ON marketplace_orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM crop_listings WHERE crop_listings.id = marketplace_orders.listing_id AND crop_listings.farmer_id = auth.uid()));

CREATE POLICY "Buyers can create orders"
  ON marketplace_orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update own orders"
  ON marketplace_orders FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM crop_listings WHERE crop_listings.id = marketplace_orders.listing_id AND crop_listings.farmer_id = auth.uid()))
  WITH CHECK (buyer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM crop_listings WHERE crop_listings.id = marketplace_orders.listing_id AND crop_listings.farmer_id = auth.uid()));

-- CROP SCANS POLICIES
CREATE POLICY "Users can view own scans"
  ON crop_scans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create scans"
  ON crop_scans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- COMMUNITY POSTS POLICIES
CREATE POLICY "All authenticated users can view posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- COMMUNITY COMMENTS POLICIES
CREATE POLICY "All authenticated users can view comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON community_comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- MESSAGES POLICIES
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_crop_listings_farmer ON crop_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_listings_status ON crop_listings(status);
CREATE INDEX IF NOT EXISTS idx_crop_listings_type ON crop_listings(crop_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);