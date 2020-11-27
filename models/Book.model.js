const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: [`Mint`, `Near Mint`, `Excellent`, `Good`, `Poor`],
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: [
      `Adventure`,
      `Fiction`,
      `Poetry`,
      `Science-fiction`,
      `History`,
      `Thriller`,
      `Dystopian`,
      `Memoir`,
      `Romance`,
      `Non-Fiction`,
    ],
  },
  dateAdded: { type: Date, default: Date.now() },
  owner: {
    //required: true,
    // unique: true, --> Might break, we can have several books by the same author.
    type: Schema.Types.ObjectId,
    ref: `User`,
  },
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: `Request`,
    },
  ],
  /*optional stuff:
  API would make things way smoother
  coverPic: Cloudimagethingy
  IBSN code: fetched from API
  */
});
const Book = model(`Book`, bookSchema);
module.exports = Book;
