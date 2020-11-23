const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: String,
  bio: {
    type: String,
  },
  booksToGive: [
    {
      type: Schema.Types.ObjectID,
      ref: `Book`,
    },
  ],
  wishList: [
    {
      type: Schema.Types.ObjectID,
      ref: `Book`,
    },
  ],
  bookScore: {
    type: Number,
    default: 0,
  },
  /*optional stuff:
  status: {
    type: enum
  },
  profilePic: Cloudpicthingy
  address: split into several micro-properties for hashing purposes
  */
});
const User = model(`User`, userSchema);
module.exports = User;
