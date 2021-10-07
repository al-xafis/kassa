const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    _id: {
        type: String,
    },
    sequence_value: {
        type: Number,
        default: 0
    },
})

mongoose.model('counter', CounterSchema);

