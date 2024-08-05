const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
