import jwt from 'jsonwebtoken';
import pool from './db';

export async function verifyAuth(token) {
  try {
    // For development: always return a default user
    return {
      userId: 1,
      name: 'Demo User',
      email: 'demo@example.com'
    };
    
    // TODO: Implement proper JWT verification for production
    /*
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query(
      'SELECT user_id, name, email, location, poin FROM User WHERE user_id = ?',
      [decoded.userId]
    );
    if (!users.length) {
      return null;
    }
    return users[0];
    */
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
} 