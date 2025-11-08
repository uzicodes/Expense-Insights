const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Expense = require('./models/Expense');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO) {
  console.warn('Warning: MONGODB_URI is not set. Set it in environment before starting the server.');
}

mongoose
  .connect(MONGO || 'mongodb://localhost:27017/expense-insights', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { title, category, amount, date } = req.body;
    const expense = new Expense({ title, category, amount, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Read expenses with optional category and month filters
// month expected as YYYY-MM (e.g., 2025-11)
app.get('/api/expenses', async (req, res) => {
  try {
    const { category, month } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (month) {
      const [y, m] = month.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 1);
        filter.date = { $gte: start, $lt: end };
      }
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Update
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const expense = await Expense.findByIdAndUpdate(id, update, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
