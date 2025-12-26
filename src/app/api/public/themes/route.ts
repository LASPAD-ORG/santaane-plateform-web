import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/public/themes
 * Get active themes (public - no auth required)
 */
export async function GET() {
  try {
    // Call backend API - Get only active themes (public endpoint)
    const response = await axios.get(`${API_URL}/api/v1/themes/active`);

    // Ensure we return an array
    let themes = response.data;
    if (!Array.isArray(themes)) {
      themes = response.data.results || response.data.items || [];
    }

    return NextResponse.json(themes);
  } catch (error: unknown) {
    console.error('Error fetching active themes:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Failed to fetch themes' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
