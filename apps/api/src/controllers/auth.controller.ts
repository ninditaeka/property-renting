import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt, { sign, verify } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import {
  generateVerificationToken,
  sendVerificationEmail,
  validateToken,
} from '../utils/email.service';
import { TokenManager } from '@/utils/tokenManager';
import { User } from '@/types/auth.types';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'jMhqStyWOlCA';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(CLIENT_ID);

// Helper function to verify token
const validateVerificationToken = (
  token: string,
): { email: string; role: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string; role: string };
  } catch (err) {
    throw new Error('Token is invalid or has expired');
  }
};

// Start Registration Process - No longer saves to database in this step
export const startRegistration = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    const { email, role } = req.body;

    // Validate role
    if (!['customer', 'tenant'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be customer or tenant',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Handle existing user scenarios
    if (existingUser) {
      // User already fully registered
      if (existingUser.password) {
        return res.status(409).json({
          status: 'error',
          message: 'Email is already registered',
          verified: true,
        });
      }
    }

    // Generate one-time verification token
    const newToken = TokenManager.createToken(email, role);

    // Send verification email
    await sendVerificationEmail(email, newToken, role);

    return res.status(200).json({
      status: 'success',
      message: 'Verification email has been sent',
    });
  } catch (error) {
    console.error('Registration verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  } finally {
    // Ensure Prisma connection is closed
    await prisma.$disconnect();
  }
};

export const loginProcess = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      return res.status(404).json({
        status: 'bad request',
        message: 'email or password invalid',
      });
    }

    // Check if user has completed registration
    if (!findUser.password) {
      return res.status(403).json({
        status: 'error',
        message: 'Registration not completed. Please check your email',
      });
    }

    // For Google-authenticated users who try to login with password
    if (findUser.google_id && !findUser.password) {
      return res.status(400).json({
        status: 'error',
        message:
          'This account uses Google authentication. Please sign in with Google.',
        isGoogleAccount: true,
      });
    }

    // Validate password
    const isPasswordValid = await compare(password, findUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const jwtPayload = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role || '', // Provide a default role if not set
      name: findUser.name || '', // Fallback to first_name if name is undefined
    };

    const token = sign(jwtPayload, String(process.env.JWT_SECRET), {
      expiresIn: '7d', // Add expiration time
    });
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// Separate route handler for token verification
export const verifyRegistrationToken = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    const { token } = req.body;

    // Verify token
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Token is required',
        valid: false,
      });
    }

    const verification = TokenManager.verifyToken(token);

    if (!verification.isValid) {
      return res.status(400).json({
        status: 'error',
        message: verification.error,
        valid: false,
      });
    }

    // Check if user has already completed registration
    const existingUser = await prisma.user.findUnique({
      where: { email: verification.email },
    });

    if (existingUser && existingUser.password) {
      return res.status(400).json({
        status: 'error',
        message: 'User has already completed registration',
        valid: false,
      });
    }

    // Return successful token verification details
    return res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      valid: true,
      email: verification.email,
      role: verification.role,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      valid: false,
    });
  } finally {
    // Ensure Prisma connection is closed
    await prisma.$disconnect();
  }
};

export const customerRegister = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    console.log('a1', 'token:', token);

    const { name, date_birth, address, gender, phone, id_number, password } =
      req.body;

    // Verify token
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification token is missing',
      });
    }

    // Decode and validate token
    let decoded;

    try {
      decoded = validateVerificationToken(token);
      console.log('a3', 'token:', token, 'decoded:', decoded);
      console.log('cek decoded value customer:', decoded);

      // Get email from decoded token
      const email = decoded.email;
      console.log('Email from decoded token:', email);

      // Ensure token sets role as customer
      if (decoded.role !== 'customer') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid registration token: not a customer token',
        });
      }
    } catch (tokenError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token',
      });
    }

    // Use email from the token
    const email = decoded.email;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Prevent re-registration of verified users
    if (existingUser && existingUser.is_verify) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already registered',
      });
    }

    // Hash password
    const hashedPassword = await hash(
      password,
      Number(process.env.PASSWORD_SALT || 10),
    );

    // Create user with email from token
    const newUser = await prisma.user.create({
      data: {
        email, // This is now using the email from the decoded token
        name,
        date_birth: date_birth ? new Date(date_birth) : undefined,
        address,
        gender,
        phone,
        id_number,
        password: hashedPassword,
        is_verify: true,
        role: 'customer',
      },
    });

    // Generate authentication token
    const authToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res.status(200).json({
      status: 'success',
      message: 'Customer registration successful',
      token: authToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Customer registration error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

export const tenantRegister = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  try {
    const {
      name,
      date_birth,
      address,
      gender,
      phone,
      id_number,
      password,
      bank_account,
      bank_name,
      npwp,
      photo,
    } = req.body;

    // Verify token
    if (!token) {
      console.log('abc');
      return res.status(400).json({
        status: 'error',
        message: 'Verification token is missing',
      });
    }

    // Decode and validate token
    let decoded;

    try {
      decoded = validateVerificationToken(token);
    } catch (tokenError) {
      console.log('abcd');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token',
      });
    }

    console.log('cek decoded value tenant:', decoded);

    // Get email from decoded token
    const email = decoded.email;
    console.log('Email from decoded token:', email);

    if (decoded.role !== 'tenant') {
      console.log(
        'abcde',
        'decoded.email:',
        decoded.email,
        'decoded.role:',
        decoded.role,
      );
      return res.status(400).json({
        status: 'error',
        message: 'Invalid registration token',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Prevent re-registration of verified users
    if (existingUser && existingUser.is_verify) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already registered',
      });
    }

    // Hash password
    const hashedPassword = await hash(
      password,
      Number(process.env.PASSWORD_SALT || 10),
    );

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email, // Using email from decoded token
        name,
        date_birth: date_birth ? new Date(date_birth) : undefined,
        address,
        gender,
        phone,
        id_number,
        password: hashedPassword,
        is_verify: true,
        role: 'tenant',
      },
    });

    // Create tenant details
    await prisma.tenantDetail.create({
      data: {
        user_id: newUser.id,
        bank_account,
        bank_name,
        npwp,
      },
    });

    // Generate authentication token
    const authToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res.status(200).json({
      status: 'success',
      message: 'Tenant registration successful',
      token: authToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Tenant registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// Verify token validity
export const verifyTokenLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Token is required',
        valid: false,
      });
    }

    try {
      // Use the validateToken function from email.service
      const decoded = validateToken(token);

      // Check if a user with this email already exists and has completed registration
      const existingUser = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (existingUser && existingUser.password) {
        return res.status(400).json({
          status: 'error',
          message: 'User has already completed registration',
          valid: false,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Token is valid',
        valid: true,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
        valid: false,
      });
    }
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      valid: false,
    });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('masuk4');
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        status: 'unauthenticated',
        message: 'Token missing',
        data: null,
      });
    }

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'unauthenticated',
        message: 'cannot access this page',
        data: null,
      });
      return;
    }
    const verifiedUser = await verify(token, String(process.env.JWT_SECRET));

    if (!verifiedUser) {
      res.status(401).json({
        status: 'unauthenticated',
        message: 'token invalid',
        data: null,
      });
      return;
    }

    req.user = verifiedUser as User;
    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
      data: null,
    });
  }
};

// Resend verification email
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and role are required',
      });
    }

    // Check if user already exists and completed registration
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.password) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already registered',
      });
    }

    // Generate new token
    const token = generateVerificationToken(email, role);

    // Send verification email without saving to database
    await sendVerificationEmail(email, token, role);

    return res.status(200).json({
      status: 'success',
      message: 'Verification email has been resent',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// Google OAuth Registration/Login - Kept mostly the same
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Google access token is required',
      });
    }

    // Get user info from Google
    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
    );
    const userData = await googleResponse.json();
    const { sub: googleId, name, email, picture } = userData;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message:
          'Email from Google is not available. Please use another registration method.',
      });
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ google_id: googleId }, { email: email }],
      },
    });

    if (user) {
      // Check if user is a tenant trying to use Google login
      if (user.role === 'tenant') {
        return res.status(400).json({
          status: 'error',
          message:
            'Tenant accounts cannot use Google authentication. Please use email and password.',
        });
      }

      // If user exists but doesn't have Google ID, update it
      if (!user.google_id) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            google_id: googleId,
            is_verify: true,
          },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || 'customer' },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.status(200).json({
        status: 'success',
        message: 'Login with Google successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,

          role: user.role,
        },
      });
    } else {
      // Create new user with Google info as customer
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hash(
        randomPassword,
        Number(process.env.PASSWORD_SALT || 10),
      );

      const newUser = await prisma.user.create({
        data: {
          google_id: googleId,
          email,
          name,
          role: 'customer', // Default to customer for Google sign-ups

          is_verify: true,
          password: hashedPassword,
          address: '',
          phone: '',
          gender: '',
          id_number: '',
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.status(201).json({
        status: 'success',
        message: 'Registration with Google successful',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error) {
    console.error('Error with Google authentication:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// The rest of the functions remain mostly the same

// Request to complete profile for Google users
export const requestProfileCompletion = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (user.google_id) {
      // Generate new token
      const token = generateVerificationToken(email, user.role || 'customer');

      // Send email with link to complete profile
      await sendVerificationEmail(email, token, user.role || 'customer', false);

      return res.status(200).json({
        status: 'success',
        message: 'Profile completion email sent successfully',
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message:
          'This feature is only available for Google-authenticated users',
      });
    }
  } catch (error) {
    console.error('Error requesting profile completion:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// Check account type
export const checkAccountType = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: 'success',
        exists: false,
        message: 'Email not registered',
      });
    }

    return res.status(200).json({
      status: 'success',
      exists: true,
      role: user.role,
      isGoogleAccount: !!user.google_id,
      isRegistrationComplete: !!user.password,
    });
  } catch (error) {
    console.error('Error checking account type:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

// Link Google account to existing user
export const linkGoogleAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { accessToken } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (user.role === 'tenant') {
      return res.status(400).json({
        status: 'error',
        message: 'Tenants cannot link Google accounts',
      });
    }

    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
    );
    const userData = await googleResponse.json();
    const { sub: googleId, picture } = userData;

    const existingGoogleUser = await prisma.user.findFirst({
      where: { google_id: googleId },
    });

    if (existingGoogleUser && existingGoogleUser.id !== Number(userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Google account is already linked to another account',
      });
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        google_id: googleId,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Google account successfully linked',
    });
  } catch (error) {
    console.error('Link Google error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};
