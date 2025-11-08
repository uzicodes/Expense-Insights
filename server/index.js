const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Expense = require('./models/Expense');
const User = require('./models/User');
const Budget = require('./models/Budget');
const { authMiddleware, JWT_SECRET } = require('./middleware/auth');

const app = express();
// Allow all localhost ports for development
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO) {
  console.warn('Warning: MONGODB_URI is not set. Set it in environment before starting the server.');
}

mongoose
  .connect(MONGO || 'mongodb://localhost:27017/expense-insights')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is healthy', status: 'ok' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    console.log('✅ New user registered:', { id: user._id, email: user.email, name: user.name });
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get all users (for debugging/admin - should be protected in production)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ 
      count: users.length,
      users: users.map(u => ({ 
        id: u._id, 
        email: u.email, 
        name: u.name,
        createdAt: u.createdAt 
      })) 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Create expense (protected)
app.post('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { title, category, amount, date } = req.body;
    const expense = new Expense({ 
      title, 
      category, 
      amount, 
      date,
      userId: req.userId 
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Read expenses with optional category and month filters (protected)
// month expected as YYYY-MM (e.g., 2025-11)
app.get('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { category, month } = req.query;
    const filter = { userId: req.userId };
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

// Update (protected)
app.put('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete (protected)
app.delete('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Budget routes

// Get user's budget (protected)
app.get('/api/budget', authMiddleware, async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.userId });
    if (!budget) {
      // Return default budget if none exists
      return res.json({ monthlyBudget: 0, currency: 'USD' });
    }
    res.json({ 
      monthlyBudget: budget.monthlyBudget, 
      currency: budget.currency 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get budget' });
  }
});

// Create or update budget (protected)
app.post('/api/budget', authMiddleware, async (req, res) => {
  try {
    const { monthlyBudget, currency } = req.body;
    
    if (!monthlyBudget || monthlyBudget < 0) {
      return res.status(400).json({ error: 'Invalid budget amount' });
    }
    
    let budget = await Budget.findOne({ userId: req.userId });
    
    if (budget) {
      // Update existing budget
      budget.monthlyBudget = monthlyBudget;
      if (currency) budget.currency = currency;
      await budget.save();
    } else {
      // Create new budget
      budget = new Budget({ 
        userId: req.userId, 
        monthlyBudget,
        currency: currency || 'USD'
      });
      await budget.save();
    }
    
    console.log('✅ Budget saved:', { userId: req.userId, monthlyBudget, currency: budget.currency });
    
    res.json({ 
      monthlyBudget: budget.monthlyBudget, 
      currency: budget.currency 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
