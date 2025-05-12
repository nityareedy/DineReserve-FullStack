import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export const generateToken = (payload: { id: number | string; email: string; role: string }) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    console.log('Generating token with payload:', payload); // Debug log
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    console.log('Generated token:', token); // Debug log
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    console.log('Verifying token:', token); // Debug log
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token payload');
    }
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error instanceof TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token format');
    }
    throw new Error('Invalid token');
  }
};
