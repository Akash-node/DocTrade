import mongoose, {Schema} from "mongoose"

// Create the user schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,   // fullName is required
        trim: true        // Removes leading and trailing whitespaces
    },
    userName: {
        type: String,
        required: true,
        unique: true,     // userName must be unique
        trim: true,
        lowercase : true
    },
    email: {
        type: String,
        required: true,
        unique: true,     // email must be unique
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Email format validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
        match: [
            /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/,
            'Password must contain at least one uppercase letter, one special character, and one number'
        ]   
           
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,     // phoneNumber must be unique
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],  // Validate phone number (e.g., for 10-digit numbers)
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],  // Allows only specific values for gender
        required: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true    // Automatically creates `createdAt` and `updatedAt` fields
});

// Export the model
export const User  = mongoose.model('User', userSchema);
