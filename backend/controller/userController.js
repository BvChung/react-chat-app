const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Register new user
// @route POST /api/v1/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, username, email, password } = req.body;

	if (!name || !username || !email || !password) {
		res.status(400);
		throw new Error("Please fill in all fields");
	}

	// Check if user exists in the database based on email
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User with email already exists");
	}

	// Hash(encrypt) password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create User using mongoose schema
	const user = await User.create({
		name,
		username,
		email,
		password: hashedPassword,
	});

	// If user is succesfully created
	if (user) {
		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc Login new user
// @route POST /api/v1/
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user based on email
	const user = await User.findOne({ email });

	// bcrypt.compare() compares password from request and hashed password from database schema
	if (user && (await bcrypt.compare(password, user.password))) {
		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid credentials");
	}
});

// @desc Get user data
// @route GET /api/v1/users/currentUser
// @access Private
const getCurrentUser = asyncHandler(async (req, res) => {
	return res.status(200).json(req.user);
});

// Generate a JWT: used to validate user
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = { registerUser, loginUser, getCurrentUser };
