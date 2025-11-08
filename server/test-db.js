// Test script to verify MongoDB connection and user creation
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check existing users
    const existingUsers = await User.find();
    console.log(`\n📊 Current users in database: ${existingUsers.length}`);
    existingUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt}`);
    });
    
    // Try to create a test user
    const testEmail = `test${Date.now()}@example.com`;
    console.log(`\n🧪 Creating test user: ${testEmail}`);
    
    const testUser = new User({
      email: testEmail,
      password: 'testpassword123',
      name: 'Test User'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('User ID:', testUser._id);
    console.log('Email:', testUser.email);
    console.log('Name:', testUser.name);
    
    // Verify it was saved
    const savedUser = await User.findById(testUser._id);
    if (savedUser) {
      console.log('✅ User verified in database');
    }
    
    // List all users again
    const allUsers = await User.find();
    console.log(`\n📊 Total users after test: ${allUsers.length}`);
    
    console.log('\n✅ Database test completed successfully!');
    console.log('👉 Check MongoDB Atlas now - database: expense-tracker, collection: users');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

testDatabase();
