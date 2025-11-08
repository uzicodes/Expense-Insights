const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true // One budget per user
  },
  monthlyBudget: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
