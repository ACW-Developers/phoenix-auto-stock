// Auto Parts Sample Data for Phoenix Arizona Shops

export const sampleCategories = [
  { id: "cat-1", name: "Brakes", description: "Brake pads, rotors, calipers, and brake fluid" },
  { id: "cat-2", name: "Engine Parts", description: "Engine components, gaskets, and seals" },
  { id: "cat-3", name: "Filters", description: "Oil, air, fuel, and cabin filters" },
  { id: "cat-4", name: "Suspension", description: "Shocks, struts, springs, and control arms" },
  { id: "cat-5", name: "Electrical", description: "Batteries, alternators, starters, and wiring" },
  { id: "cat-6", name: "Cooling System", description: "Radiators, water pumps, thermostats, and hoses" },
  { id: "cat-7", name: "Transmission", description: "Clutches, CV joints, and transmission fluids" },
  { id: "cat-8", name: "Exhaust", description: "Mufflers, catalytic converters, and exhaust pipes" },
  { id: "cat-9", name: "Lighting", description: "Headlights, taillights, bulbs, and LED upgrades" },
  { id: "cat-10", name: "Body Parts", description: "Mirrors, bumpers, fenders, and trim" },
];

export const sampleSuppliers = [
  { 
    id: "sup-1", 
    name: "AutoZone Distribution", 
    contact_person: "Mike Rodriguez", 
    email: "mike@autozone-dist.com", 
    phone: "(602) 555-0101",
    address: "4521 W McDowell Rd",
    city: "Phoenix",
    state: "Arizona",
    zip_code: "85035",
    notes: "Main brake parts supplier, 2-day delivery"
  },
  { 
    id: "sup-2", 
    name: "O'Reilly Auto Parts Wholesale", 
    contact_person: "Sarah Thompson", 
    email: "sarah@oreilly-wholesale.com", 
    phone: "(602) 555-0102",
    address: "2100 E Camelback Rd",
    city: "Phoenix",
    state: "Arizona",
    zip_code: "85016",
    notes: "Fast turnaround on electrical parts"
  },
  { 
    id: "sup-3", 
    name: "NAPA Phoenix Hub", 
    contact_person: "James Wilson", 
    email: "james@napa-phoenix.com", 
    phone: "(480) 555-0103",
    address: "8910 E Indian School Rd",
    city: "Scottsdale",
    state: "Arizona",
    zip_code: "85251",
    notes: "Premium quality parts, warranty included"
  },
  { 
    id: "sup-4", 
    name: "RockAuto Southwest", 
    contact_person: "Linda Garcia", 
    email: "linda@rockauto-sw.com", 
    phone: "(623) 555-0104",
    address: "15601 N 28th Ave",
    city: "Phoenix",
    state: "Arizona",
    zip_code: "85053",
    notes: "Best prices on suspension and exhaust"
  },
  { 
    id: "sup-5", 
    name: "Advance Auto Parts Distribution", 
    contact_person: "Robert Chen", 
    email: "robert@advanceauto-dist.com", 
    phone: "(480) 555-0105",
    address: "1250 S Dobson Rd",
    city: "Mesa",
    state: "Arizona",
    zip_code: "85202",
    notes: "Next-day delivery on most items"
  },
];

export const sampleProducts = [
  // Brakes
  { id: "prod-1", name: "Premium Ceramic Brake Pads - Front", sku: "BRK-001", brand: "Bosch", part_number: "BC905", cost_price: 35.99, unit_price: 59.99, category_id: "cat-1", supplier_id: "sup-1", description: "High-performance ceramic brake pads for smooth, quiet braking" },
  { id: "prod-2", name: "Brake Rotor - Front", sku: "BRK-002", brand: "ACDelco", part_number: "18A1705A", cost_price: 45.00, unit_price: 79.99, category_id: "cat-1", supplier_id: "sup-1", description: "OEM quality vented brake rotor" },
  { id: "prod-3", name: "Brake Caliper - Rear Left", sku: "BRK-003", brand: "Cardone", part_number: "19-B2973", cost_price: 65.00, unit_price: 109.99, category_id: "cat-1", supplier_id: "sup-1", description: "Remanufactured brake caliper with core exchange" },
  { id: "prod-4", name: "DOT 4 Brake Fluid 32oz", sku: "BRK-004", brand: "Prestone", part_number: "AS401", cost_price: 8.50, unit_price: 14.99, category_id: "cat-1", supplier_id: "sup-3", description: "High-temp brake fluid for all vehicles" },
  
  // Engine Parts
  { id: "prod-5", name: "Spark Plugs - Iridium (Set of 4)", sku: "ENG-001", brand: "NGK", part_number: "6619", cost_price: 28.00, unit_price: 49.99, category_id: "cat-2", supplier_id: "sup-2", description: "Long-life iridium spark plugs" },
  { id: "prod-6", name: "Timing Belt Kit", sku: "ENG-002", brand: "Gates", part_number: "TCKWP329", cost_price: 125.00, unit_price: 199.99, category_id: "cat-2", supplier_id: "sup-3", description: "Complete timing belt kit with water pump" },
  { id: "prod-7", name: "Head Gasket Set", sku: "ENG-003", brand: "Fel-Pro", part_number: "HS26317PT", cost_price: 89.00, unit_price: 149.99, category_id: "cat-2", supplier_id: "sup-3", description: "Multi-layer steel head gasket set" },
  { id: "prod-8", name: "Motor Oil 5W-30 5Qt", sku: "ENG-004", brand: "Mobil 1", part_number: "120764", cost_price: 24.00, unit_price: 39.99, category_id: "cat-2", supplier_id: "sup-5", description: "Full synthetic motor oil" },
  
  // Filters
  { id: "prod-9", name: "Engine Air Filter", sku: "FLT-001", brand: "K&N", part_number: "33-2364", cost_price: 35.00, unit_price: 59.99, category_id: "cat-3", supplier_id: "sup-2", description: "High-flow washable air filter" },
  { id: "prod-10", name: "Oil Filter", sku: "FLT-002", brand: "Fram", part_number: "PH7317", cost_price: 6.00, unit_price: 11.99, category_id: "cat-3", supplier_id: "sup-5", description: "Premium oil filter with anti-drain valve" },
  { id: "prod-11", name: "Cabin Air Filter", sku: "FLT-003", brand: "Bosch", part_number: "6055C", cost_price: 15.00, unit_price: 24.99, category_id: "cat-3", supplier_id: "sup-2", description: "HEPA cabin air filter" },
  { id: "prod-12", name: "Fuel Filter", sku: "FLT-004", brand: "ACDelco", part_number: "GF652", cost_price: 18.00, unit_price: 32.99, category_id: "cat-3", supplier_id: "sup-1", description: "In-line fuel filter" },
  
  // Suspension
  { id: "prod-13", name: "Front Strut Assembly", sku: "SUS-001", brand: "Monroe", part_number: "172233", cost_price: 85.00, unit_price: 149.99, category_id: "cat-4", supplier_id: "sup-4", description: "Complete strut assembly with spring" },
  { id: "prod-14", name: "Rear Shock Absorber", sku: "SUS-002", brand: "KYB", part_number: "349105", cost_price: 45.00, unit_price: 79.99, category_id: "cat-4", supplier_id: "sup-4", description: "Gas-charged shock absorber" },
  { id: "prod-15", name: "Control Arm - Front Lower", sku: "SUS-003", brand: "Moog", part_number: "RK620375", cost_price: 75.00, unit_price: 129.99, category_id: "cat-4", supplier_id: "sup-4", description: "Premium control arm with ball joint" },
  
  // Electrical
  { id: "prod-16", name: "Car Battery 12V", sku: "ELC-001", brand: "DieHard", part_number: "50748", cost_price: 95.00, unit_price: 159.99, category_id: "cat-5", supplier_id: "sup-2", description: "Gold series automotive battery" },
  { id: "prod-17", name: "Alternator", sku: "ELC-002", brand: "Denso", part_number: "210-0548", cost_price: 145.00, unit_price: 249.99, category_id: "cat-5", supplier_id: "sup-3", description: "OEM replacement alternator" },
  { id: "prod-18", name: "Starter Motor", sku: "ELC-003", brand: "Bosch", part_number: "SR0463X", cost_price: 110.00, unit_price: 189.99, category_id: "cat-5", supplier_id: "sup-3", description: "Remanufactured starter motor" },
  
  // Cooling
  { id: "prod-19", name: "Radiator", sku: "COL-001", brand: "Spectra Premium", part_number: "CU2951", cost_price: 125.00, unit_price: 219.99, category_id: "cat-6", supplier_id: "sup-5", description: "Direct-fit aluminum radiator" },
  { id: "prod-20", name: "Water Pump", sku: "COL-002", brand: "GMB", part_number: "130-7340", cost_price: 35.00, unit_price: 64.99, category_id: "cat-6", supplier_id: "sup-5", description: "OE-quality water pump" },
  { id: "prod-21", name: "Thermostat Housing Kit", sku: "COL-003", brand: "Dorman", part_number: "902-204", cost_price: 28.00, unit_price: 49.99, category_id: "cat-6", supplier_id: "sup-5", description: "Complete thermostat housing assembly" },
  { id: "prod-22", name: "Coolant 50/50 1Gal", sku: "COL-004", brand: "Zerex", part_number: "ZXG051", cost_price: 12.00, unit_price: 21.99, category_id: "cat-6", supplier_id: "sup-2", description: "Pre-mixed antifreeze/coolant" },
  
  // Lighting
  { id: "prod-23", name: "Headlight Bulb H11 (Pair)", sku: "LGT-001", brand: "Sylvania", part_number: "H11XV2BP", cost_price: 35.00, unit_price: 59.99, category_id: "cat-9", supplier_id: "sup-2", description: "XtraVision high-performance bulbs" },
  { id: "prod-24", name: "LED Headlight Conversion Kit", sku: "LGT-002", brand: "Auxbeam", part_number: "F-16", cost_price: 55.00, unit_price: 99.99, category_id: "cat-9", supplier_id: "sup-4", description: "6000K LED headlight kit" },
  
  // Exhaust
  { id: "prod-25", name: "Catalytic Converter - Universal", sku: "EXH-001", brand: "Walker", part_number: "15634", cost_price: 185.00, unit_price: 329.99, category_id: "cat-8", supplier_id: "sup-4", description: "EPA compliant catalytic converter" },
  { id: "prod-26", name: "Muffler - Performance", sku: "EXH-002", brand: "Flowmaster", part_number: "42441", cost_price: 95.00, unit_price: 169.99, category_id: "cat-8", supplier_id: "sup-4", description: "Original 40 series muffler" },
];

export const sampleShops = [
  { 
    id: "shop-1", 
    name: "Phoenix Auto Parts Central", 
    location: "Central Phoenix",
    contact_email: "central@phoenixautoparts.com",
    contact_phone: "(602) 555-1000",
    address: "2301 N 7th St",
    city: "Phoenix",
    state: "Arizona",
    zip_code: "85006"
  },
  { 
    id: "shop-2", 
    name: "Scottsdale Auto Supply", 
    location: "Scottsdale",
    contact_email: "scottsdale@phoenixautoparts.com",
    contact_phone: "(480) 555-2000",
    address: "7014 E Camelback Rd",
    city: "Scottsdale",
    state: "Arizona",
    zip_code: "85251"
  },
  { 
    id: "shop-3", 
    name: "Mesa Auto Parts Warehouse", 
    location: "Mesa",
    contact_email: "mesa@phoenixautoparts.com",
    contact_phone: "(480) 555-3000",
    address: "1455 W Southern Ave",
    city: "Mesa",
    state: "Arizona",
    zip_code: "85202"
  },
];

export const generateInventory = () => {
  const inventory: any[] = [];
  sampleProducts.forEach((product, index) => {
    sampleShops.forEach((shop) => {
      const quantity = Math.floor(Math.random() * 50) + 5;
      const reorderLevel = Math.floor(Math.random() * 15) + 5;
      inventory.push({
        id: `inv-${shop.id}-${product.id}`,
        product_id: product.id,
        shop_id: shop.id,
        quantity,
        reorder_level: reorderLevel,
        reorder_quantity: reorderLevel * 3,
        location: `Aisle ${Math.floor(index / 5) + 1}, Shelf ${(index % 5) + 1}`,
        last_restocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  });
  return inventory;
};

export const generateSampleAlerts = () => {
  const alerts: any[] = [];
  const inventory = generateInventory();
  
  inventory.forEach((item) => {
    if (item.quantity <= item.reorder_level) {
      const product = sampleProducts.find(p => p.id === item.product_id);
      const shop = sampleShops.find(s => s.id === item.shop_id);
      const alertLevel = item.quantity <= item.reorder_level * 0.5 ? 'critical' : 'low';
      
      alerts.push({
        id: `alert-${item.id}`,
        shop_id: item.shop_id,
        product_id: item.product_id,
        alert_level: alertLevel,
        message: alertLevel === 'critical' 
          ? `CRITICAL: ${product?.name} at ${shop?.name} is critically low (${item.quantity} units)`
          : `LOW STOCK: ${product?.name} at ${shop?.name} needs reorder (${item.quantity} units)`,
        acknowledged: false,
        created_at: new Date().toISOString(),
      });
    }
  });
  
  return alerts;
};

export const generateSampleSales = () => {
  const sales: any[] = [];
  const saleItems: any[] = [];
  
  for (let i = 0; i < 15; i++) {
    const saleId = `sale-${i + 1}`;
    const shop = sampleShops[Math.floor(Math.random() * sampleShops.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = product.unit_price * quantity;
      totalAmount += subtotal;
      
      saleItems.push({
        id: `item-${saleId}-${j}`,
        sale_id: saleId,
        product_id: product.id,
        quantity,
        unit_price: product.unit_price,
        subtotal,
      });
    }
    
    sales.push({
      id: saleId,
      shop_id: shop.id,
      user_id: 'demo-user',
      total_amount: totalAmount,
      customer_name: ['John Smith', 'Maria Garcia', 'David Johnson', 'Lisa Chen', null][Math.floor(Math.random() * 5)],
      customer_phone: Math.random() > 0.5 ? `(602) 555-${String(Math.floor(Math.random() * 9000) + 1000)}` : null,
      payment_method: ['cash', 'card', 'check'][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return { sales, saleItems };
};

export const generateReorderRequests = () => {
  const requests: any[] = [];
  const statuses = ['pending', 'ordered', 'received', 'cancelled'] as const;
  
  for (let i = 0; i < 8; i++) {
    const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    const shop = sampleShops[Math.floor(Math.random() * sampleShops.length)];
    const supplier = sampleSuppliers.find(s => s.id === product.supplier_id) || sampleSuppliers[0];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    requests.push({
      id: `reorder-${i + 1}`,
      shop_id: shop.id,
      product_id: product.id,
      supplier_id: supplier.id,
      quantity: Math.floor(Math.random() * 30) + 10,
      status,
      requested_by: 'demo-user',
      notes: status === 'cancelled' ? 'Out of stock at supplier' : null,
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      ordered_date: status !== 'pending' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      expected_date: status === 'ordered' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      received_date: status === 'received' ? new Date().toISOString() : null,
    });
  }
  
  return requests;
};
