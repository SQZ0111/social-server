const mongoose = require('mongoose'); 

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    timeFrom: {
        type: String,
        required: true
    },
    timeTo: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true,
        default: []
    },
    additionalInfo: {
        type: String
    }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;