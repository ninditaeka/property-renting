import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Define a strict metadata type
type TokenMetadata = Record<string, string | number | boolean>;

interface CustomTokenPayload extends JwtPayload {
  email: string;
  role: string;
  metadata?: TokenMetadata;
}

export class TokenManager {
  // Use a consistent secret key method
  private static getSecretKey(): Secret {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return secret;
  }

  /**
   * Create a JWT token
   * @param email User's email address
   * @param role User's role/permission level
   * @param options Additional token configuration
   * @returns Generated JWT token
   */
  static createToken(
    email: string,
    role: string,
    options: {
      expirationTime?: string | number;
      metadata?: TokenMetadata;
    } = {},
  ): string {
    const {
      expirationTime = '1d', // Default 2 hours
      metadata = {},
    } = options;

    console.log('cek 1', process.env.JWT_SECRET, this.getSecretKey(), role);
    // Construct token payload
    const payload: CustomTokenPayload = {
      email,
      role,
      metadata,
      iat: Math.floor(Date.now() / 1000), // Issued At timestamp
    };

    // Prepare sign options
    const signOptions: SignOptions = {
      expiresIn:
        typeof expirationTime === 'number'
          ? expirationTime
          : (expirationTime as jwt.SignOptions['expiresIn']),
      algorithm: 'HS256',
    };

    // Generate JWT using a consistent secret key method

    console.log('cek 2', process.env.JWT_SECRET, this.getSecretKey(), role);
    return jwt.sign(payload, this.getSecretKey(), signOptions);
  }

  /**
   * Verify JWT token
   * @param token Token to verify
   * @returns Verification result
   */
  static verifyToken(token: string): {
    isValid: boolean;
    email: string;
    role: string;
    error?: string;
    metadata?: TokenMetadata;
  } {
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, this.getSecretKey(), {
        algorithms: ['HS256'],
      }) as CustomTokenPayload;

      return {
        isValid: true,
        email: decoded.email,
        role: decoded.role,
        metadata: decoded.metadata || {},
      };
    } catch (error) {
      // Handle different types of JWT verification errors
      let errorMessage = 'Invalid token';
      if (error instanceof jwt.TokenExpiredError) {
        errorMessage = 'Token has expired';
      } else if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = 'Token verification failed';
      }
      console.log('cek 3', process.env.JWT_SECRET, this.getSecretKey());

      return {
        isValid: false,
        email: '',
        role: '',
        error: errorMessage,
      };
    }
  }

  /**
   * Decode token without verification
   * @param token Token to decode
   * @returns Decoded token payload
   */
  static decodeToken(token: string): CustomTokenPayload | null {
    return jwt.decode(token) as CustomTokenPayload | null;
  }
}

// Example usage function
export function generateExampleToken() {
  return TokenManager.createToken('rentascustomer@yopmail.com', 'customer', {
    expirationTime: '2h',
    metadata: {
      loginSource: 'web',
      ipAddress: '192.168.1.1',
    },
  });
}
