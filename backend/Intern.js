const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('Intern', internSchema);
