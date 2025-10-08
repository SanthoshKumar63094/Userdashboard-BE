// routes/api.js
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// -------------------- Dashboard Summary --------------------
router.get('/summary', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT sales_today, sales_yesterday, monthly_sales, yearly_sales,
              orders_count, customers_count, low_stock_count
         FROM dashboard_stats
         ORDER BY created_at DESC
         LIMIT 1`
    );

    if (!rows.length) return res.status(404).json({ message: 'No summary found' });

    const s = rows[0];
    res.json({
      sales: {
        today: Number(s.sales_today),
        yesterday: Number(s.sales_yesterday),
        monthly: Number(s.monthly_sales),
        yearly: Number(s.yearly_sales),
      },
      orders: Number(s.orders_count),
      customers: Number(s.customers_count),
      lowStockCount: Number(s.low_stock_count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Products --------------------
router.get('/products', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, name, subtitle, category, stock, price, image_url as image
         FROM products
         ORDER BY id`
    );

    const data = rows.map(r => ({
      ...r,
      stock: Number(r.stock),
      price: Number(r.price),
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Customers --------------------
router.get('/customers', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, customer_id as "customerId", name, email,
             total_orders as "totalOrders",
             total_spent as "totalSpent",
             district, status, avatar
         FROM customers
         ORDER BY id`
    );

    const data = rows.map(r => ({
      ...r,
      totalOrders: Number(r.totalOrders),
      totalSpent: Number(r.totalSpent),
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Orders --------------------
router.get('/orders', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
        o.id,
        o.order_id as "orderId",
        c.name as "userName",
        p.name as name,
        p.subtitle as subtitle,
        o.price,
        o.qty,
        o.payment,
        o.status,
        COALESCE(o.image_url, p.image_url) as image,
        o.created_at as "createdAt"
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC`
    );

    const data = rows.map(r => ({
      ...r,
      price: Number(r.price),
      qty: Number(r.qty),
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- District Sales --------------------
router.get('/district-sales', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT district, total_sales as value
         FROM district_sales
         ORDER BY total_sales DESC`
    );

    const data = rows.map(r => ({ district: r.district, value: Number(r.value) }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Profits --------------------
router.get('/profits', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT year, value
         FROM profits
         ORDER BY year DESC`
    );

    const data = rows.map(r => ({ name: String(r.year), value: Number(r.value) }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

