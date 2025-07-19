import zod from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import User from "../models/User/UserSchema.js";

// Parsers
const emailParser  = zod.string().email();
const passwordParser = zod.string().min(6);
const nameParser = zod.string();
const phoneNoParser = zod.string().min(10).max(14);
const usernameParser = zod.string();

const registerUser = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);
    const { email, password, name, phoneNo, userName } = req.body;
    
    // Log the extracted data for debugging
    console.log("Extracted registration data:", { email, password: "***", name, phoneNo, userName });
    
    // Zod validation
    const isEmail = emailParser.safeParse(email);
    const isPassword = passwordParser.safeParse(password);
    const isFullName = nameParser.safeParse(name);
    const isPhoneNo = phoneNoParser.safeParse(phoneNo);
    const isUsername = usernameParser.safeParse(userName);

    // If any validation fails, return specific error
    if (!isEmail.success) {
      console.log("Email validation failed:", isEmail.error);
      return res.status(400).json({ errors: [{ field: "email", msg: "Invalid email" }] });
    }
    if (!isPassword.success) {
      console.log("Password validation failed:", isPassword.error);
      return res.status(400).json({ errors: [{ field: "password", msg: "Password must be at least 6 characters long" }] });
    }
    if (!isFullName.success) {
      console.log("Name validation failed:", isFullName.error);
      return res.status(400).json({ errors: [{ field: "name", msg: "Full name is required" }] });
    }
    if (!isPhoneNo.success) {
      console.log("Phone number validation failed:", isPhoneNo.error);
      return res.status(400).json({ errors: [{ field: "phoneNo", msg: "Invalid phone number format" }] });
    }
    if (!isUsername.success) {
      console.log("Username validation failed:", isUsername.error);
      return res.status(400).json({ errors: [{ field: "userName", msg: "Username is required" }] });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phoneNo,
      userName,
    });
    // Save the user to the database
    await newUser.save();
    // Return success response
    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    // Provide more detailed error information
    if (error.name === 'ValidationError') {
      // Handle mongoose validation errors
      const errors = Object.values(error.errors).map(err => ({ field: err.path, msg: err.message }));
      return res.status(400).json({ errors });
    } else if (error.code === 11000) {
      // Handle duplicate key errors (like duplicate email or username)
      const field = Object.keys(error.keyValue)[0];
      const value = Object.values(error.keyValue)[0];
      return res.status(400).json({ 
        errors: [{ field, msg: `${field} '${value}' is already in use` }] 
      });
    } else if (error.code === 'ECONNREFUSED' || error.syscall === 'connect') {
      // Handle database connection errors
      console.error('Database connection error:', error);
      return res.status(503).json({ 
        errors: [{ msg: "Unable to connect to database. Please try again later." }],
        details: process.env.NODE_ENV !== 'production' ? error.toString() : undefined
      });
    }
    
    // General server error with more details
    return res.status(500).json({ 
      errors: [{ msg: "Server error occurred during registration" }],
      details: process.env.NODE_ENV !== 'production' ? error.toString() : undefined
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Zod validation
    const isEmail = emailParser.safeParse(email);
    const isPassword = passwordParser.safeParse(password);

    // Handle invalid email or password input
    if (!isEmail.success) {
      return res.status(400).json({ errors: [{ field: "email", msg: "Invalid email format" }] });
    }

    if (!isPassword.success) {
      return res.status(400).json({ errors: [{ field: "password", msg: "Password must be at least 6 characters long" }] });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate access token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

    if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }

    // Optional: Save token to user document (If required for session management)
    user.AccessToken = token;
    await user.save();

    // Return success response with token
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,  // Include both _id and id for compatibility
        id: user._id,   // Some frontend code might expect id instead of _id
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        userName: user.userName,
      },
      token // Send token in response
    });
  } catch (error) {
    console.error("Error during login:", error);
    // Provide more detailed error information
    const errorMessage = error.code === 'ECONNREFUSED' ? 
      "Network connection refused. Please check if the server is running." : 
      error.message || "Server error";
      
    return res.status(500).json({ 
      errors: [{ msg: errorMessage }],
      details: process.env.NODE_ENV !== 'production' ? error.toString() : undefined
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId);
    
    // Check if user exists and if AccessToken is already null
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the AccessToken is already null
    if (user.AccessToken === null) {
      return res.status(400).json({ message: "User is already logged out" });
    }

    // Update the AccessToken to null
    await User.findByIdAndUpdate(
      userId,
      { AccessToken: null }, // Set AccessToken to null
      { new: true } // Return the updated user document
    );

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    
    // Handle specific connection errors
    if (error.code === 'ECONNREFUSED' || error.name === 'MongoNetworkError') {
      return res.status(503).json({
        message: "Database connection error during logout",
        error: "Unable to connect to database. Please try again later.",
        details: process.env.NODE_ENV !== 'production' ? error.toString() : undefined
      });
    }
    
    return res.status(500).json({
      message: "Server error during logout",
      error: error.message,
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};
export { loginUser, registerUser ,logoutUser };
