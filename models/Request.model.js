const mongoose = require(`mongoose`);

const requestSchema = new mongoose.Schema({
  when: {
    type: Date,
    default: Date.now(),
  },
  requestingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Book`,
  },
  status: {
    type: String,
    enum: ["Accepted", "Declined", "Pending"],
    default: "Pending",
  },
});
const Request = mongoose.model(`Request`, requestSchema);
module.exports = Request;
