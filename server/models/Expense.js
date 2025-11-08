const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Utilities', 'Other'],
    default: 'Other',
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
