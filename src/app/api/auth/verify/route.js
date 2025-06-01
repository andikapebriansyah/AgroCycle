import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);
    return NextResponse.json({ valid: true, user });
  } catch (error) {
    return NextResponse.json(
      { valid: false, message: error.message },
      { status: 401 }
    );
  }
} 