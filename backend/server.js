import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Log every incoming request so you can monitor GET, POST, PUT calls in the terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load products from product.json
const loadProductsData = () => {
  try {
    const jsonPath = path.join(__dirname, '../src/data/product.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const obj = {};
      data.forEach((p, idx) => {
        const key = String(p.id || idx + 1);
        obj[key] = p;
      });
      return obj;
    }
  } catch (err) {
    console.error("Failed to load product.json", err);
  }
  return {
    "1": { id: 1, name: "Classic Blue T-Shirt", price: 499, image: "blue-tshirt.jpg" }
  };
};

let products = loadProductsData();

let cart = [];

// Root endpoint for status and guidance
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Store Backend API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 60px 20px; text-align: center; background: #f1f5f9; color: #1e293b; }
          .card { background: white; max-width: 500px; margin: 0 auto; padding: 36px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); }
          h1 { margin-top: 0; font-size: 24px; color: #0f172a; }
          p { color: #64748b; font-size: 15px; line-height: 1.6; }
          .btn { display: inline-block; margin: 8px 4px; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 15px; }
          .btn-primary { background: #4f46e5; color: white; }
          .btn-primary:hover { background: #4338ca; }
          .btn-secondary { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
          .btn-secondary:hover { background: #e2e8f0; }
          .endpoint-list { text-align: left; background: #f8fafc; padding: 12px 18px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🛒 Backend API is Running!</h1>
          <p>You have reached the <strong>Express API server (port 5001)</strong>.</p>
          <p>The interactive React store frontend runs on <strong>port 3000</strong>.</p>
          <div style="margin: 20px 0;">
            <a class="btn btn-primary" href="http://localhost:3000">👉 Open Store Web App (localhost:3000)</a>
          </div>
          <div class="endpoint-list">
            <div><strong>Supported API Endpoints:</strong></div>
            <div>• GET /products (or /products.json)</div>
            <div>• POST /products (or /products.json)</div>
            <div>• PUT /products (or /products.json)</div>
            <div>• GET /cart (or /cart.json)</div>
            <div>• PUT /cart (or /cart.json)</div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// GET products (supports both /products and /products.json)
app.get(['/products', '/products.json'], (req, res) => {
  res.json(products);
});

// POST a new product (supports both /products and /products.json)
app.post(['/products', '/products.json'], (req, res) => {
  const newProduct = req.body;
  const newKey = Object.keys(products).length + 1;
  newProduct.id = newProduct.id || newKey;
  products[newKey] = newProduct;
  res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// PUT to replace or batch-update all products
app.put(['/products', '/products.json'], (req, res) => {
  if (req.body && typeof req.body === 'object') {
    products = req.body;
    res.json({ message: "Products updated successfully", products });
  } else {
    res.status(400).json({ error: "Invalid product data" });
  }
});

// PUT to update a single product by ID
app.put(['/products/:id', '/products/:id.json'], (req, res) => {
  const { id } = req.params;
  if (products[id]) {
    products[id] = { ...products[id], ...req.body };
    res.json({ message: "Product updated successfully", product: products[id] });
  } else {
    products[id] = { id: Number(id) || id, ...req.body };
    res.status(201).json({ message: "Product created successfully", product: products[id] });
  }
});

// GET cart items
app.get(['/cart', '/cart.json'], (req, res) => {
  res.json(cart);
});

// PUT cart (overwrites cart state, common pattern in React courses)
app.put(['/cart', '/cart.json'], (req, res) => {
  cart = Array.isArray(req.body) ? req.body : (req.body?.items || []);
  res.json({ message: "Cart saved successfully", cart });
});

// POST item to cart
app.post(['/cart', '/cart.json'], (req, res) => {
  const item = req.body;
  cart.push(item);
  res.status(201).json({ message: "Item added to cart", cart });
});

let orders = [];

// POST checkout / orders
app.post(['/checkout', '/checkout.json', '/orders', '/orders.json'], (req, res) => {
  const { cartItems } = req.body || {};
  const items = cartItems || req.body?.items || [];
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    items: items,
    itemCount: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  cart = []; // clear server-side cart
  console.log(`[CHECKOUT SUCCESS] Order #${orderId} created with ${newOrder.itemCount} item(s)`);
  res.status(201).json({
    message: "Checkout successful! Order placed.",
    orderId: orderId,
    order: newOrder
  });
});

// GET orders
app.get(['/orders', '/orders.json'], (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Local backend running at http://localhost:${PORT}`);
  console.log(`   - Products API: http://localhost:${PORT}/products`);
  console.log(`   - Checkout API: http://localhost:${PORT}/checkout`);
  console.log(`   - Orders API:   http://localhost:${PORT}/orders`);
  console.log(`   - React Frontend: http://localhost:3000\n`);
});