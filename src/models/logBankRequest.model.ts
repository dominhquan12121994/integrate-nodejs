const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logBankRequestSchema = new Schema({
    _id: Schema.Types.ObjectId,
    requestId: { type: String },
    bankCode: { type: String },
    amount: { type: Number },
}, { timestamps: true, collection: 'logBankRequests', });

module.exports = mongoose.model('logBankRequest', logBankRequestSchema);
