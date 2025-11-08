// Create test expenses for existing users
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Expense = require('./models/Expense');

async function createTestExpenses() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get the first user (or create one if none exists)
    let user = await User.findOne();
    
    if (!user) {
      console.log('No users found. Creating a test user...');
      user = new User({
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User'
      });
      await user.save();
      console.log('✅ Test user created\n');
    }
    
    console.log(`👤 Creating expenses for: ${user.email}`);
    console.log(`   User ID: ${user._id}\n`);
    
    // Create sample expenses
    const testExpenses = [
      {
        title: 'Grocery Shopping',
        category: 'Food',
        amount: 45.50,
        date: new Date('2024-11-05'),
        userId: user._id
      },
      {
        title: 'Uber Ride',
        category: 'Transport',
        amount: 15.20,
        date: new Date('2024-11-06'),
        userId: user._id
      },
      {
        title: 'Electric Bill',
        category: 'Utilities',
        amount: 120.00,
        date: new Date('2024-11-01'),
        userId: user._id
      },
      {
        title: 'Restaurant Dinner',
        category: 'Food',
        amount: 65.80,
        date: new Date('2024-11-07'),
        userId: user._id
      }
    ];
    
    console.log('Creating test expenses...');
    for (const expData of testExpenses) {
      const expense = new Expense(expData);
      await expense.save();
      console.log(`✅ Created: ${expense.title} - $${expense.amount} (${expense.category})`);
    }
    
    // Verify expenses were saved
    const savedExpenses = await Expense.find({ userId: user._id });
    console.log(`\n📊 Total expenses for ${user.email}: ${savedExpenses.length}`);
    
    const totalAmount = savedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    console.log(`💰 Total amount: $${totalAmount.toFixed(2)}`);
    
    console.log('\n✅ Test expenses created successfully!');
    console.log('👉 Now check:');
    console.log('   1. MongoDB Atlas - Database: expense-tracker, Collection: expenses');
    console.log('   2. Your app at http://localhost:8084');
    console.log(`   3. Login with: ${user.email}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

createTestExpenses();
