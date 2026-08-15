-- Sample "Our Eggs" products for Mallanna Farms.
--
-- Run this once in Supabase → SQL Editor. It inserts real product rows
-- through the same `products` table the admin dashboard manages — these
-- are fully editable/deletable at /admin/products afterward, exactly like
-- any product you'd add by hand. Uses the site's own farm/packaging
-- photography (already in public/assets/farm), not stock images.
--
-- Safe to run once. Re-running will error on the unique `slug` — that's
-- expected and means the products are already there.

insert into products (
  name, slug, description, short_description, price, discount_price,
  pack_size, egg_count, grade, sku, category, stock_status,
  features, nutrition, feed_info, main_image_url, featured, active, sort_order
) values
(
  'Farm Fresh Free Range Eggs – 6 Eggs',
  'free-range-eggs-6',
  'Fresh, nutritious free-range eggs from happy hens raised in Mallanna Farms'' open, natural surroundings. A perfect small pack for trying us out or topping up your kitchen.',
  'Fresh, nutritious free-range eggs from happy hens.',
  60, null, 'Tray of 6', 6, 'Grade A', 'MF-EGG-06', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Natural, open farming environment', 'No hormones or antibiotics', 'Collected and packed fresh'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/eggs-in-basket-hay.jpg', false, true, 1
),
(
  'Farm Fresh Free Range Eggs – 12 Eggs',
  'free-range-eggs-12',
  'A family pack of naturally fresh and wholesome eggs, collected daily and graded for quality. Our most popular pack — the everyday choice for healthy family meals.',
  'A family pack of naturally fresh and wholesome eggs.',
  110, null, 'Tray of 12', 12, 'Grade A', 'MF-EGG-12', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Natural, open farming environment', 'No hormones or antibiotics', 'Collected and packed fresh', 'Great for everyday family use'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/egg-carton-and-bowl.jpg', true, true, 2
),
(
  'Premium Free Range Eggs – 18 Eggs',
  'premium-free-range-eggs-18',
  'Premium-quality free-range eggs, carefully selected from our farm for size and shell quality. A generous pack for larger households and frequent cooking.',
  'Premium-quality free-range eggs, carefully selected from our farm.',
  165, null, 'Tray of 18', 18, 'Grade A', 'MF-EGG-18', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Hand-selected premium quality', 'Natural, open farming environment', 'No hormones or antibiotics', 'Collected and packed fresh'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/mallanna-carton-closeup.jpg', false, true, 3
),
(
  'Farm Fresh Eggs – 30 Eggs',
  'farm-fresh-eggs-30',
  'Value family pack of fresh farm eggs for everyday use. The most economical way to keep your family stocked with naturally raised, farm-fresh eggs.',
  'Value family pack of fresh farm eggs for everyday use.',
  270, null, 'Tray of 30', 30, 'Grade A', 'MF-EGG-30', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Best value family pack', 'Natural, open farming environment', 'No hormones or antibiotics'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/f5.jpeg', false, true, 4
),
(
  'Premium Brown Eggs – 6 Eggs',
  'premium-brown-eggs-6',
  'Naturally rich and delicious brown eggs from free-range hens. A smaller premium pack, ideal for trying our brown-shell variety.',
  'Naturally rich and delicious brown eggs from free-range hens.',
  75, null, 'Tray of 6', 6, 'Grade A', 'MF-BRN-06', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Naturally rich brown shell', 'Natural, open farming environment', 'No hormones or antibiotics', 'Collected and packed fresh'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/hen-with-egg-basket.jpg', false, true, 5
),
(
  'Premium Brown Eggs – 12 Eggs',
  'premium-brown-eggs-12',
  'Fresh premium brown eggs, perfect for healthy family meals. Rich in flavour and colour, collected fresh from our free-range hens.',
  'Fresh premium brown eggs, perfect for healthy family meals.',
  140, null, 'Tray of 12', 12, 'Grade A', 'MF-BRN-12', 'Free Range Eggs', 'in_stock',
  array['100% free-range hens', 'Naturally rich brown shell', 'Natural, open farming environment', 'No hormones or antibiotics', 'Collected and packed fresh'],
  '{"Energy": "143 kcal", "Protein": "12.6 g", "Total_Fat": "9.5 g", "Carbohydrate": "0.7 g", "Cholesterol": "372 mg"}'::jsonb,
  'Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.',
  '/assets/farm/f6.jpeg', true, true, 6
)
on conflict (slug) do nothing;
