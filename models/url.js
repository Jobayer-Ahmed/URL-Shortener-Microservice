const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
	original_url: String,
	shortner_url: String
}, {timestamps: true});

const modelClass = mongoose.model('short_url', urlSchema);

module.exports = modelClass;