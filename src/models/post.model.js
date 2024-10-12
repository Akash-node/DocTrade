import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Create the post schema
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  pdfUrl: {
    type: String,
    required: true, // URL or path to the uploaded PDF file
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
    ref: 'User',
    required: true,
  },
  totalDownload: {
    type: Number,
    default: 0, // Set default value for totalDownload
  },
  forSell: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String, // Tags for categorizing the post
      trim: true,
    },
  ],
  category: {
    type: String,
    enum: [
      "Technology & Software",
      "Education & Academic",
      "Business & Finance",
      "Health & Wellness",
      "Arts & Humanities",
      "Science & Engineering",
      "Personal Development",
      "Lifestyle & Hobbies",
      "Entertainment & Media",
      "Law & Politics",
      "Spirituality & Religion",
      "Environmental & Social Issues",
    ],
    required: true,
  },
}, {
  timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
});

postSchema.plugin(mongooseAggregatePaginate);

// Export the model
export const Post = mongoose.model('Post', postSchema);
