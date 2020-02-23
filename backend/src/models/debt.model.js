const Mongoose = require('mongoose');

const DebtSchema = new Mongoose.Schema({
    clientId: {type: String, required: true},
    reason: {type: String},
    value: {type: String, required: true},
    date: {type: Date, required: true}
});

module.exports = Mongoose.model('Debt', DebtSchema);