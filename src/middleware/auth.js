import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(req) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
      throw new Error('Invalid authorization header format');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error(error.message || 'Invalid token');
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const user = verifyToken(req);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
} 