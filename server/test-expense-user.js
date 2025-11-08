// Test script to verify expenses are linked to users
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Expense = require('./models/Expense');

async function testExpenseUserLink() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all users
    const users = await User.find();
    console.log(`📊 Total users in database: ${users.length}\n`);
    
    // Check expenses for each user
    for (const user of users) {
      const userExpenses = await Expense.find({ userId: user._id });
      console.log(`👤 User: ${user.email} (${user.name || 'No name'})`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   💰 Total expenses: ${userExpenses.length}`);
      
      if (userExpenses.length > 0) {
        console.log('   Expenses:');
        userExpenses.forEach(exp => {
          console.log(`      - ${exp.title}: $${exp.amount} (${exp.category}) - ${new Date(exp.date).toLocaleDateString()}`);
        });
      }
      console.log('');
    }
    
    // Get all expenses
    const allExpenses = await Expense.find();
    console.log(`📊 Total expenses in database: ${allExpenses.length}\n`);
    
    if (allExpenses.length > 0) {
      console.log('All expenses with user info:');
      for (const expense of allExpenses) {
        const user = await User.findById(expense.userId);
        console.log(`  - ${expense.title}: $${expense.amount} | User: ${user ? user.email : 'Unknown'}`);
      }
    } else {
      console.log('⚠️  No expenses found in database yet.');
      console.log('💡 Add an expense through the app at http://localhost:8084');
    }
    
    console.log('\n✅ Test completed!');
    console.log('👉 Check MongoDB Atlas:');
    console.log('   Database: expense-tracker');
    console.log('   Collection: expenses (should have userId field for each expense)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

testExpenseUserLink();
