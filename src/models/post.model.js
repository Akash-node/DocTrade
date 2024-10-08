import mongoose, {Schema} from "mongoose"

// Create the post schema
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    pdfUrl: {
        type: String,
        required: true,  // URL or path to the uploaded PDF file
    },
    price: {
        type: Number,
        required: true,
        min: 0  // Price cannot be negative
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the user who created the post
        ref: 'User',
        required: true
    },
    totalDownload: {
        type: Number,  // Reference to the user who created the post
        required: true || 0
    },
    forSell: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,   // Tags for categorizing the post
        trim: true
    }],

}, {
    timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

// Export the model
export const Post  = mongoose.model('Post', postSchema);