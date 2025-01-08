const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  User_id: { type: Number, required: true },
  ident: { type: String, required: true },
  airtime_type: { type: String, required: false },
  network: { type: Number, required: true },
  paid_amount: { type: String, required: true },
  mobile_number: { type: String, required: true },
  amount: { type: String, required: true },
  plan_amount: { type: String, required: false },
  plan_network: { type: String, required: false },
  balance_before: { type: String, required: true },
  balance_after: { type: String, required: true },
  Status: { type: String, required: true },
  create_date: { type: Date, required: true },
  Ported_number: { type: Boolean, required: true },
  customer_ref: { type: String, required: false },
  api_response: { type: String, required: false },
}, { collection: 'Transactions' });
// });

module.exports = mongoose.model('Transactions', TransactionSchema);





// const mongoose = require('mongoose');

// const TransactionsSchema = new mongoose.Schema({
//   User_id: { type: Number, required: true },
//   Transaction_Type: { type: String, required: true },
//   Amount: { type: Number, required: true },
//   mobile_number: { type: String, required: true },
//   Status: { type: String, required: true },
//   Reference: { type: String, required: true },
//   CreatedAt: { type: Date, default: Date.now },
// }, { collection: 'Transactions' });

// module.exports = mongoose.model('Transactions', TransactionsSchema);




