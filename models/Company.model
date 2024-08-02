const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyNumber: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Company', CompanySchema);
