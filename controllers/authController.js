import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';  
import createError from '../utils/appError.js';

// REGISTER USER
export async function signup(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        // Ensure required fields are provided
        if (!name || !email || !password) {
            return next(new createError('Name, email, and password are required', 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new createError('User already exists!', 400));
        }

        // Hash the password with 12 salt rounds
        const hashedPassword = await hash(password, 12);

        // Create the user with the hashed password
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default role is 'user'
        });

        // Generate a JWT token
        const token = jwt.sign({ _id: newUser._id }, 'secretkey123', {
            expiresIn: '90d'
        });

        // Send the response
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                name: name,
                email: email,  
                role: role
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        next(error);
    }
}

// LOGIN USER
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Ensure required fields are provided
        if (!email || !password) {
            return next(new createError('Email and password are required', 400));
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new createError('Email does not exist', 401));
        }

        // Check if the password is correct
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(new createError('Invalid email or password', 401));
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, 'secretkey123', {
            expiresIn: '90d'
        });

        // Send response
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,  
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        next(error);
    }
}
