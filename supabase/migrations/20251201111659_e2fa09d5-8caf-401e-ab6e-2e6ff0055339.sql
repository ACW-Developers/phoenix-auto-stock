-- Fix search_path for trigger functions

-- Update update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update check_stock_levels function
CREATE OR REPLACE FUNCTION public.check_stock_levels()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update update_inventory_on_sale function
CREATE OR REPLACE FUNCTION public.update_inventory_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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