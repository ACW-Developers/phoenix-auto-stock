-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE reorder_status AS ENUM ('pending', 'ordered', 'received', 'cancelled');
CREATE TYPE stock_status AS ENUM ('critical', 'low', 'adequate', 'good');

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shops table
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Phoenix',
  state TEXT DEFAULT 'Arizona',
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table (separate from profiles for security)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User shop access (which users can access which shops)
CREATE TABLE user_shop_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shop_id)
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (master product data)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  brand TEXT,
  part_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory table (shop-specific stock)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  reorder_quantity INTEGER NOT NULL DEFAULT 50,
  location TEXT,
  last_restocked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, shop_id)
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sale items table
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reorder requests table
CREATE TABLE reorder_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  status reorder_status DEFAULT 'pending',
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  ordered_date TIMESTAMPTZ,
  expected_date TIMESTAMPTZ,
  received_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock alerts table
CREATE TABLE stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_level stock_status NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shop_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(check_role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = check_role
  )
$$;

-- Create function to check shop access
CREATE OR REPLACE FUNCTION public.has_shop_access(check_shop_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_shop_access
    WHERE user_id = auth.uid()
    AND shop_id = check_shop_id
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for shops (users can only see shops they have access to)
CREATE POLICY "Users can view their shops"
  ON shops FOR SELECT
  USING (has_shop_access(id) OR has_role('admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id OR has_role('admin'));

-- RLS Policies for user_shop_access
CREATE POLICY "Users can view own shop access"
  ON user_shop_access FOR SELECT
  USING (auth.uid() = user_id OR has_role('admin'));

-- RLS Policies for suppliers
CREATE POLICY "Authenticated users can view suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage suppliers"
  ON suppliers FOR ALL
  USING (has_role('admin') OR has_role('manager'));

-- RLS Policies for categories
CREATE POLICY "Authenticated users can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (has_role('admin'));

-- RLS Policies for products
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage products"
  ON products FOR ALL
  USING (has_role('admin') OR has_role('manager'));

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory for their shops"
  ON inventory FOR SELECT
  USING (has_shop_access(shop_id) OR has_role('admin'));

CREATE POLICY "Managers and admins can manage inventory"
  ON inventory FOR ALL
  USING (has_role('admin') OR has_role('manager'));

-- RLS Policies for sales
CREATE POLICY "Users can view sales for their shops"
  ON sales FOR SELECT
  USING (has_shop_access(shop_id) OR has_role('admin'));

CREATE POLICY "Staff can create sales for their shops"
  ON sales FOR INSERT
  WITH CHECK (has_shop_access(shop_id));

-- RLS Policies for sale_items
CREATE POLICY "Users can view sale items"
  ON sale_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sales
    WHERE sales.id = sale_items.sale_id
    AND (has_shop_access(sales.shop_id) OR has_role('admin'))
  ));

CREATE POLICY "Staff can create sale items"
  ON sale_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sales
    WHERE sales.id = sale_items.sale_id
    AND has_shop_access(sales.shop_id)
  ));

-- RLS Policies for reorder_requests
CREATE POLICY "Users can view reorders for their shops"
  ON reorder_requests FOR SELECT
  USING (has_shop_access(shop_id) OR has_role('admin'));

CREATE POLICY "Managers and admins can manage reorders"
  ON reorder_requests FOR ALL
  USING (has_role('admin') OR has_role('manager'));

-- RLS Policies for stock_alerts
CREATE POLICY "Users can view alerts for their shops"
  ON stock_alerts FOR SELECT
  USING (has_shop_access(shop_id) OR has_role('admin'));

CREATE POLICY "Staff can acknowledge alerts"
  ON stock_alerts FOR UPDATE
  USING (has_shop_access(shop_id));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reorder_requests_updated_at
  BEFORE UPDATE ON reorder_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to automatically create stock alerts
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  alert_status stock_status;
  alert_msg TEXT;
BEGIN
  -- Determine alert level
  IF NEW.quantity = 0 THEN
    alert_status := 'critical';
    alert_msg := 'OUT OF STOCK: Immediate action required';
  ELSIF NEW.quantity <= (NEW.reorder_level * 0.5) THEN
    alert_status := 'critical';
    alert_msg := 'CRITICAL: Stock below 50% of reorder level';
  ELSIF NEW.quantity <= NEW.reorder_level THEN
    alert_status := 'low';
    alert_msg := 'LOW STOCK: Reorder recommended';
  ELSIF NEW.quantity <= (NEW.reorder_level * 2) THEN
    alert_status := 'adequate';
    alert_msg := 'ADEQUATE: Stock approaching reorder level';
  ELSE
    alert_status := 'good';
    alert_msg := 'GOOD: Stock levels healthy';
  END IF;

  -- Only create alerts for low or critical levels
  IF alert_status IN ('critical', 'low') THEN
    INSERT INTO stock_alerts (shop_id, product_id, alert_level, message)
    VALUES (NEW.shop_id, NEW.product_id, alert_status, alert_msg)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_inventory_levels
  AFTER INSERT OR UPDATE OF quantity ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION check_stock_levels();

-- Function to update inventory after sale
CREATE OR REPLACE FUNCTION update_inventory_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  sale_shop_id UUID;
BEGIN
  -- Get the shop_id from the sale
  SELECT shop_id INTO sale_shop_id
  FROM sales
  WHERE id = NEW.sale_id;

  -- Update inventory
  UPDATE inventory
  SET quantity = quantity - NEW.quantity
  WHERE product_id = NEW.product_id
  AND shop_id = sale_shop_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_inventory_after_sale
  AFTER INSERT ON sale_items
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_sale();