const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  network: { type: Number, required: true },
  ident: { type: String, required: true },
  balance_before: { type: String, required: true },
  balance_after: { type: String, required: true },
  mobile_number: { type: String, required: true },
  plan: { type: Number, required: true },
  Status: { type: String, required: true },
  plan_network: { type: String, required: true },
  plan_name: { type: String, required: true },
  plan_amount: { type: String, required: true },
  create_date: { type: Date, required: true },
  Ported_number: { type: Boolean, required: true },
  api_response: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Data', DataSchema);
